import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useSound } from '@/hooks/useSound';

// ── Review Screen (shown when mission already completed) ─────────────────────
const ReviewScreen = ({ savedMeta, themeColor, accentColor, questionText, topTitle, onBack }) => (
  <div className="w-full max-w-xl animate-in zoom-in-95 duration-400">
    <div className="text-center mb-8">
      <div className="text-[80px] leading-none mb-4 drop-shadow-2xl">📖</div>
      <h2 className="font-heading text-4xl font-black text-white uppercase tracking-widest mb-2">Your Answer</h2>
      <p className="text-secondary-text font-ui">Here's what you shared for this mission!</p>
    </div>

    <div className="space-y-4 mb-8">
      {/* Question */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: themeColor }}>{topTitle}</p>
        <p className="text-white font-heading font-black text-xl">"{questionText}"</p>
      </div>

      {/* Their Answer */}
      {savedMeta?.familyAnswer && (
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-xs font-black uppercase tracking-widest mb-2 text-blue-400">THEY SAID:</p>
          <p className="text-white font-ui text-lg">"{savedMeta.familyAnswer}"</p>
        </div>
      )}

      {/* Who Asked */}
      {savedMeta?.whoAsked && (
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4">
          <span className="text-3xl">👥</span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1 text-purple-400">YOU ASKED:</p>
            <p className="text-white font-heading font-black text-xl">{savedMeta.whoAsked}</p>
          </div>
        </div>
      )}

      {/* Will Try */}
      {savedMeta?.willTry && (
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4">
          <span className="text-3xl">🤔</span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1 text-yellow-400">WOULD YOU TRY IT:</p>
            <p className="text-white font-heading font-black text-xl">{savedMeta.willTry}</p>
          </div>
        </div>
      )}

      <div className="p-4 rounded-2xl text-center border-2 border-green-500/30 bg-green-500/10">
        <span className="text-2xl">✅</span>
        <p className="text-green-400 font-black mt-1">Mission Already Completed! +50 XP Earned</p>
      </div>
    </div>

    <button
      onClick={onBack}
      className="w-full py-5 rounded-full font-heading font-black text-white text-xl tracking-widest uppercase hover:scale-[1.02] transition-all border border-white/20"
      style={{ background: `linear-gradient(135deg, ${themeColor}, ${accentColor})` }}
    >
      ← BACK TO MISSIONS
    </button>
  </div>
);

// ── Main FamilyQuest Component ────────────────────────────────────────────────
export const FamilyQuest = ({
  onComplete,
  questionText = "What was their favourite hobby growing up?",
  questionAudioText = "Ask anyone at home: What was their favourite hobby growing up?",
  visualEmoji = "🏠✨",
  themeColor = "#7c4dff",
  accentColor = "#ec4899",
  topTitle = "Ask anyone at home:",
  savedMeta = null,     // passed when mission already completed
  onBack = null,        // called when review → back
}) => {
  const { user } = useAuth();
  const [task, setTask] = useState(0);
  const [familyAnswer, setFamilyAnswer] = useState('');
  const [willTry, setWillTry] = useState('');
  const [whoAsked, setWhoAsked] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(''); // live transcript while listening
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { playClick, playSuccess, playCombo, playLevelUp } = useSound();
  const recognitionRef = useRef(null);

  // If already completed — show review
  if (savedMeta && onBack) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden touch-none"
           style={{ background: `radial-gradient(100% 100% at 50% 0%, ${themeColor}20 0%, #050814 100%)` }}>
        <div className="w-full max-w-xl flex items-center justify-between mb-8 px-2">
          <span className="text-secondary-text text-[10px] font-black uppercase tracking-widest">Mission Review</span>
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">✕</button>
        </div>
        <ReviewScreen savedMeta={savedMeta} themeColor={themeColor} accentColor={accentColor} questionText={questionText} topTitle={topTitle} onBack={onBack} />
      </div>
    );
  }

  const handleNext = () => {
    playSuccess();
    setTask(prev => prev + 1);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(questionAudioText);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser. Please type your answer.");
      return;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(_) {}
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => { setIsListening(true); setTranscript(''); };
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const final = event.results[i][0].transcript;
          setFamilyAnswer(prev => (prev ? prev + ' ' : '') + final.trim());
          setTranscript('');
          playCombo();
        } else {
          interim += event.results[i][0].transcript;
          setTranscript(interim);
        }
      }
    };
    recognition.onerror = () => { setIsListening(false); setTranscript(''); };
    recognition.onend = () => { setIsListening(false); setTranscript(''); };
    recognition.start();
  }, [playCombo]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(_) {}
    }
    setIsListening(false);
  }, []);

  const handleFinish = async () => {
    setSaving(true);
    const payload = { familyAnswer, willTry, whoAsked };
    try {
      if (user) {
        // metadata is saved by DayPageTemplate via onComplete payload
      }
      playLevelUp();
      setSaved(true);
      setTimeout(() => onComplete(payload), 1500);
    } catch (err) {
      console.error('Save error:', err);
      onComplete(payload); // still complete even if save fails
    } finally {
      setSaving(false);
    }
  };

  const displayAnswer = (familyAnswer + (transcript && isListening ? (familyAnswer ? ' ' : '') + transcript : '')).trim();

  const canProceedTask2 = familyAnswer.trim().length > 2 || displayAnswer.length > 2;
  const canProceedTask3 = willTry !== '';
  const canProceedTask4 = whoAsked !== '';

  // ── Screen 1: Quest Brief ──────────────────────────────────────────────────
  const Task1 = (
    <div className="w-full max-w-xl text-center animate-in zoom-in-95 duration-300">
      <div className="relative mb-10">
        <div className="text-[100px] leading-none mb-6 drop-shadow-2xl animate-bounce">{visualEmoji}</div>
        <div className="bg-white text-background p-6 rounded-[2rem] rounded-bl-sm relative shadow-[0_20px_50px_rgba(255,255,255,0.2)]">
          <div className="font-heading text-2xl sm:text-3xl font-black leading-tight uppercase tracking-tight text-indigo-900 border-4 border-dashed border-indigo-200 p-4 rounded-xl flex flex-col gap-2">
            <span className="text-xl sm:text-2xl" style={{ color: accentColor }}>{topTitle}</span>
            <span>"{questionText}"</span>
          </div>
          <div className="absolute -bottom-6 left-12 w-0 h-0 border-l-[16px] border-l-transparent border-t-[24px] border-t-white border-r-[16px] border-r-transparent" />
        </div>
      </div>

      <button
        onClick={() => { playClick(); speakQuestion(); }}
        className="w-full mb-6 py-4 rounded-3xl font-heading font-black text-white text-xl tracking-widest uppercase transition-all bg-white/10 hover:bg-white/20 border-2 border-white/30 backdrop-blur-md flex items-center justify-center gap-3 hover:scale-[1.01]"
      >
        🔊 TAP TO HEAR THE QUESTION
      </button>

      <button
        onClick={handleNext}
        className="w-full py-6 rounded-full font-heading font-black text-white text-2xl tracking-widest uppercase transition-all hover:scale-[1.02] shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
        style={{ background: `linear-gradient(135deg, ${themeColor}, ${accentColor})` }}
      >
        I'M READY TO ASK! ⚡
      </button>
    </div>
  );

  // ── Screen 2: Capture Answer ───────────────────────────────────────────────
  const Task2 = (
    <div className="w-full max-w-xl text-center animate-in slide-in-from-right-10 duration-400">
      <div className="text-[80px] leading-none mb-4 drop-shadow-2xl animate-pulse">✍️</div>
      <h2 className="font-heading text-4xl font-black text-white mb-2 uppercase tracking-widest">Their Answer</h2>
      <p className="text-secondary-text mb-6 font-ui">Type what they said, or tap the mic to record!</p>

      <div className={`bg-white/5 border ${isListening ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-white/10 shadow-xl'} rounded-[2rem] p-6 mb-6 transition-all duration-300 backdrop-blur-md`}>
        <textarea
          value={displayAnswer}
          onChange={e => {
            if (!isListening) setFamilyAnswer(e.target.value);
          }}
          placeholder={isListening ? "Listening..." : "Type what they said here..."}
          rows={4}
          disabled={isListening}
          className="w-full px-6 py-5 rounded-[1.5rem] bg-black/40 text-white placeholder-white/30 text-xl font-bold focus:outline-none focus:ring-4 transition-all resize-none shadow-inner mb-4 disabled:opacity-80"
          style={{ focusRingColor: themeColor }}
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 border-2 text-lg ${
              isListening
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse scale-[1.02]'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {isListening ? '⏹ STOP' : '🎤 VOICE'}
          </button>
          <button
            onClick={() => setFamilyAnswer('')}
            className="py-4 rounded-2xl font-black border-2 border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20 transition-all text-lg"
          >
            🗑 CLEAR
          </button>
        </div>

        {isListening && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="w-1.5 rounded-full bg-red-400"
                style={{ height: `${12 + Math.random() * 20}px`, animation: `voiceBar 0.6s ${i * 0.1}s ease-in-out infinite alternate` }} />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={!canProceedTask2}
        className="w-full py-6 rounded-full font-heading font-black text-white text-2xl tracking-widest uppercase transition-all disabled:opacity-30 hover:scale-[1.02]"
        style={{ background: `linear-gradient(135deg, ${themeColor}, ${accentColor})`, boxShadow: `0 15px 30px ${themeColor}40` }}
      >
        GOT THEIR ANSWER! ✅
      </button>
      <style>{`@keyframes voiceBar { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }`}</style>
    </div>
  );

  // ── Screen 3: Would YOU try it? ────────────────────────────────────────────
  const Task3 = (
    <div className="w-full max-w-xl text-center animate-in slide-in-from-right-10 duration-400">
      <div className="text-[80px] leading-none mb-4 drop-shadow-2xl">🤔</div>
      <h2 className="font-heading text-4xl font-black text-white mb-3 uppercase tracking-widest">Would YOU try it?</h2>
      <p className="text-secondary-text mb-8 font-ui">Think about what they said... what do YOU think?</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {['HECK YES! 🤩', 'MAYBE 🤔', 'NOT REALLY 🤷', 'NO WAY 🙈'].map(opt => (
          <button
            key={opt}
            onClick={() => { playClick(); setWillTry(opt); }}
            className={`py-6 rounded-[2rem] border-4 font-black text-lg transition-all ${
              willTry === opt
                ? 'bg-white/20 text-white scale-[1.05]'
                : 'border-white/10 bg-white/5 text-secondary-text hover:bg-white/10'
            }`}
            style={{
              borderColor: willTry === opt ? accentColor : undefined,
              boxShadow: willTry === opt ? `0 0 30px ${accentColor}60` : undefined
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!canProceedTask3}
        className="w-full py-6 rounded-full font-heading font-black text-white text-2xl tracking-widest uppercase transition-all disabled:opacity-30 hover:scale-[1.02]"
        style={{ background: `linear-gradient(135deg, ${themeColor}, ${accentColor})`, boxShadow: `0 15px 30px ${themeColor}40` }}
      >
        NEXT! 🚀
      </button>
    </div>
  );

  // ── Screen 4: Who did you ask? ─────────────────────────────────────────────
  const Task4 = (
    <div className="w-full max-w-xl text-center animate-in slide-in-from-right-10 duration-400">
      <div className="text-[100px] leading-none mb-6 drop-shadow-2xl animate-pulse">👥</div>
      <h2 className="font-heading text-5xl font-black text-white mb-10 tracking-tight drop-shadow-lg">Who did you ask?</h2>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          { label: 'Mom/Dad', emoji: '🧑‍🤝‍🧑' },
          { label: 'Sibling', emoji: '👦👧' },
          { label: 'Grandparent', emoji: '👵👴' },
          { label: 'Teacher', emoji: '👩‍🏫' },
          { label: 'Friend', emoji: '🙋‍♂️' },
          { label: 'Neighbour', emoji: '🏠' },
        ].map(opt => (
          <button
            key={opt.label}
            onClick={() => { playCombo(); setWhoAsked(opt.label); }}
            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-[3px] transition-all group ${
              whoAsked === opt.label
                ? 'border-white bg-white/20 scale-[1.05] shadow-[0_0_40px_rgba(255,255,255,0.3)]'
                : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">{opt.emoji}</span>
            <span className="font-heading font-black text-lg uppercase tracking-wider text-white">{opt.label}</span>
          </button>
        ))}
      </div>

      {saved ? (
        <div className="w-full py-6 rounded-full border-2 border-green-500 bg-green-500/20 text-green-400 font-heading font-black text-2xl tracking-widest uppercase text-center animate-in zoom-in-50">
          ✅ SAVED! CLAIMING REWARD...
        </div>
      ) : (
        <button
          onClick={handleFinish}
          disabled={!canProceedTask4 || saving}
          className="w-full py-6 rounded-full font-heading font-black text-white text-2xl tracking-widest uppercase transition-all disabled:opacity-30 hover:scale-[1.02] relative overflow-hidden group"
          style={{ background: `linear-gradient(135deg, ${themeColor}, ${accentColor})`, boxShadow: `0 15px 30px ${themeColor}40` }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10">
            {saving ? '💾 SAVING...' : 'CLAIM REWARD 🏆'}
          </span>
        </button>
      )}
    </div>
  );

  const screens = [Task1, Task2, Task3, Task4];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 overflow-hidden touch-none selection:bg-transparent"
         style={{ background: `radial-gradient(100% 100% at 50% 0%, ${themeColor}20 0%, #050814 100%)` }}>

      {/* HUD Bar */}
      <div className="w-full max-w-xl flex items-center justify-between mb-8 px-2 z-10">
        <div className="flex flex-col">
          <span className="text-secondary-text text-[10px] font-black uppercase tracking-widest pl-1">Step {task + 1}/4</span>
          <div className="w-32 h-2.5 rounded-full bg-white/10 mt-1 overflow-hidden">
            <div className="h-full transition-all duration-500 ease-out"
                 style={{ width: `${((task + 1) / 4) * 100}%`, background: `linear-gradient(90deg, ${themeColor}, ${accentColor})` }} />
          </div>
        </div>
        <button onClick={() => { if (onBack) onBack(); }}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      {screens[task]}
    </div>
  );
};
