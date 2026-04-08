import { useState, useCallback, useEffect } from 'react';
import { useSound } from '@/hooks/useSound';

const SPACE_LEVELS = [
  { level: 1, title: 'Our Home Planet', question: 'Where do we live?',            options: ['🌙 Moon','🌍 Earth','⭐ Star','🚀 Rocket'], correctIndex: 1 },
  { level: 2, title: 'Night Sky',       question: 'What shines at night?',         options: ['☀️ Sun','🌈 Rainbow','🌙 Moon','🌲 Tree'], correctIndex: 2 },
  { level: 3, title: 'Super Hot!',      question: 'Which one is VERY hot?',        options: ['🌙 Moon','⭐ Star','☀️ Sun','🪐 Saturn'], correctIndex: 2 },
  { level: 4, title: 'Space Travel',    question: 'Which one can fly in space?',   options: ['🚗 Car','🚀 Rocket','🚲 Bike','🛶 Boat'], correctIndex: 1 },
  { level: 5, title: 'Memory Flash',    question: 'You saw 🌍🌙⭐🚀 — What was LAST?', options: ['🌍','🌙','⭐','🚀'], correctIndex: 3 },
];

export const Mission1_SpaceQuiz = ({ onComplete, onBack }) => {
  const [level,     setLevel]    = useState(0);
  const [selected,  setSelected] = useState(null);
  const [feedback,  setFeedback] = useState(null);
  const [streak,    setStreak]   = useState(0);
  const [timeLeft,  setTimeLeft] = useState(8); // changed to 8s (6s is very punishing)
  const { playClick, playLevelUp, playWrong, playCountdown, playBgMusic, stopBgMusic } = useSound();

  const current = SPACE_LEVELS[level];

  useEffect(() => {
    playBgMusic();
    return () => stopBgMusic();
  }, [playBgMusic, stopBgMusic]);

  useEffect(() => {
    if (feedback || level >= SPACE_LEVELS.length) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(-1, true); 
          return 0;
        }
        if (prev === 4) playCountdown();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [level, feedback, playCountdown]);

  const handleAnswer = useCallback((idx, timeout = false) => {
    if (feedback) return;
    if (!timeout) playClick();
    
    setSelected(idx);
    const correct = idx === current.correctIndex;
    setFeedback(correct ? 'correct' : 'wrong');
    
    if (correct) {
      setStreak(s => s + 1);
      playLevelUp();
    } else {
      setStreak(0);
      playWrong();
    }

    setTimeout(() => {
      if (level < SPACE_LEVELS.length - 1) {
        setLevel(l => l + 1);
        setSelected(null);
        setFeedback(null);
        setTimeLeft(8);
      } else {
        stopBgMusic();
        onComplete();
      }
    }, correct ? 1200 : 1500); 
  }, [feedback, current, level, onComplete, playLevelUp, playWrong, playClick, stopBgMusic]);

  const progressPct = ((level) / SPACE_LEVELS.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 overflow-hidden touch-none selection:bg-transparent"
         style={{ background: 'radial-gradient(100% 100% at 50% 0%, rgba(139,92,246,0.15) 0%, #050814 100%)' }}>
      
      <div className="w-full max-w-xl flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col">
          <span className="text-secondary-text text-[10px] font-black uppercase tracking-widest pl-1">Question {level + 1}/5</span>
          <div className="w-32 h-2.5 rounded-full bg-white/10 mt-1 overflow-hidden">
            <div className="h-full bg-violet-500 transition-all duration-500 ease-out" style={{ width: `${progressPct}%`, boxShadow: '0 0 10px #8b5cf6' }} />
          </div>
        </div>
        
        {streak >= 2 && (
          <div className="animate-pulse flex items-center gap-1 bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-black uppercase">{streak} Streak!</span>
          </div>
        )}

        <button onClick={() => { stopBgMusic(); if (onBack) onBack(); }} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      <div key={level} className="w-full max-w-xl animate-in fade-in slide-in-from-right-8 duration-300">
        
        <div className="w-full h-1.5 bg-white/5 mb-6 rounded-full overflow-hidden relative">
          <div className={`absolute top-0 left-0 bottom-0 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? 'bg-red-500' : 'bg-violet-400'}`}
               style={{ width: `${(timeLeft / 8) * 100}%` }} />
        </div>

        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase border mb-6" 
                style={{ background: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.4)', color: '#c4b5fd' }}>
            {current.title}
          </span>
          <h2 className="font-heading text-4xl sm:text-6xl font-black text-white leading-tight drop-shadow-2xl mb-2 px-4">{current.question}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {current.options.map((opt, i) => {
            const isSelected  = selected === i;
            const isCorrect   = i === current.correctIndex;
            
            let bg = 'bg-white/5 hover:bg-white/10';
            let border = 'border-white/10 hover:border-white/20';
            let color = 'text-white';
            let animation = 'hover:-translate-y-1 hover:shadow-lg';
            
            if (feedback) {
              animation = ''; 
              if (isSelected && isCorrect)  { bg = 'bg-green-500'; border = 'border-green-400'; color = 'text-white'; animation = 'scale-105 shadow-[0_0_40px_rgba(34,197,94,0.6)]'; }
              if (isSelected && !isCorrect) { bg = 'bg-red-500';   border = 'border-red-400';   color = 'text-white'; animation = 'animate-shake opacity-80'; }
              if (!isSelected && isCorrect) { bg = 'bg-green-500/40'; border = 'border-green-500'; color = 'text-white'; animation = 'animate-pulse'; }
              if (!isSelected && !isCorrect){ bg = 'bg-white/5';   border = 'border-transparent'; color = 'text-white/30'; }
            }

            return (
              <button
                key={i}
                disabled={feedback !== null}
                onClick={() => handleAnswer(i)}
                className={`w-full aspect-video sm:aspect-[2/1] rounded-[2rem] border-b-4 text-3xl sm:text-4xl font-heading font-black transition-all duration-200 flex items-center justify-center ${bg} ${border} ${color} ${animation}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="h-20 mt-8 flex justify-center items-center">
          {feedback && (
            <div className={`px-6 py-3 rounded-2xl border-2 text-lg font-black tracking-widest uppercase animate-in zoom-in-50 duration-200
              ${feedback === 'correct' ? 'bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_30px_rgba(16,200,100,0.3)]' : 
                                         'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_30px_rgba(240,60,60,0.3)]'}`}>
              {feedback === 'correct' ? '🚀 ASTRONAUT! +10 XP' : '❌ KEEP TRYING!'}
            </div>
          )}
        </div>

      </div>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-10px)} 40%,80%{transform:translateX(10px)} } .animate-shake { animation: shake 0.4s ease-in-out }`}</style>
    </div>
  );
};
