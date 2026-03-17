import { useState } from 'react';
import { useSound } from '@/hooks/useSound';

export const Mission2 = ({ onComplete }) => {
  const [task,        setTask]        = useState(0); // 0: question, 1: who
  const [familyAnswer,setFamilyAnswer]= useState('');
  const [willTry,     setWillTry]     = useState('');
  const [whoAsked,    setWhoAsked]    = useState('');
  const { playClick, playSuccess, playCombo } = useSound();

  const canProceedTask1 = familyAnswer.trim().length > 2 && willTry;
  const canProceedTask2 = whoAsked;

  const handleNext = () => {
    playSuccess();
    setTask(1);
  };

  const handeWhoClick = (opt) => {
    playCombo();
    setWhoAsked(opt);
  };

  const Task1 = (
    <div className="w-full max-w-xl text-center animate-in zoom-in-95 duration-300">
      
      {/* Comic Book Speech Bubble */}
      <div className="relative mb-10">
        <div className="text-[100px] leading-none mb-2 drop-shadow-2xl animate-bounce">🏠✨</div>
        <div className="bg-white text-background p-6 rounded-[2rem] rounded-bl-sm relative shadow-[0_20px_50px_rgba(255,255,255,0.2)]">
          <div className="font-heading text-2xl sm:text-3xl font-black leading-tight uppercase tracking-tight text-indigo-900 border-4 border-dashed border-indigo-200 p-4 rounded-xl flex flex-col gap-2">
            <span className="text-xl sm:text-2xl text-[#ec4899]">Ask anyone at home:</span>
            <span>"What was their favourite hobby growing up?"</span>
          </div>
          <div className="absolute -bottom-6 left-12 w-0 h-0 border-l-[16px] border-l-transparent border-t-[24px] border-t-white border-r-[16px] border-r-transparent" />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-6 shadow-xl backdrop-blur-md">
        <h3 className="font-heading text-2xl font-black text-white mb-4 uppercase tracking-widest text-left pl-2">Their Answer:</h3>
        <textarea
          value={familyAnswer}
          onChange={e => setFamilyAnswer(e.target.value)}
          placeholder="✍️ Type what they said here..."
          rows={2}
          className="w-full px-6 py-5 rounded-[1.5rem] bg-black/40 text-white placeholder-white/30 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all resize-none shadow-inner"
        />

        <h3 className="font-heading text-xl font-black text-white mt-8 mb-4 uppercase tracking-widest text-left pl-2">You want to try it?</h3>
        <div className="grid grid-cols-2 gap-3">
          {['HECK YES! 🤩', 'MAYBE 🤔', 'NOT REALLY 🤷', 'NO WAY 🙈'].map(opt => (
            <button
              key={opt}
              onClick={() => { playClick(); setWillTry(opt); }}
              className={`py-5 rounded-2xl border-4 font-black transition-all ${
                willTry === opt 
                  ? 'border-accent bg-accent/30 text-white shadow-[0_0_20px_#7c4dff] scale-[1.02]' 
                  : 'border-white/10 bg-white/5 text-secondary-text hover:bg-white/10'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!canProceedTask1}
        className="w-full py-6 rounded-full font-heading font-black text-white text-2xl tracking-widest uppercase transition-all disabled:opacity-30 hover:scale-[1.02] shadow-[0_15px_30px_rgba(124,77,255,0.4)]"
        style={{ background: 'linear-gradient(135deg, #7c4dff, #ec4899)' }}
      >
        NEXT STEP ⚡
      </button>
    </div>
  );

  const Task2 = (
    <div className="w-full max-w-xl text-center animate-in slide-in-from-right-10 duration-400">
      
      <div className="text-[120px] leading-none mb-6 drop-shadow-2xl animate-pulse">👥</div>
      
      <h2 className="font-heading text-5xl font-black text-white mb-10 tracking-tight drop-shadow-lg">Who shared their story?</h2>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          { label: 'Mom/Dad', emoji: '🧑‍🤝‍🧑', color: '#3b82f6' },
          { label: 'Sibling', emoji: '👦👧', color: '#10b981' },
          { label: 'Grandparent', emoji: '👵👴', color: '#f59e0b' },
          { label: 'Friend', emoji: '🙋‍♂️', color: '#ec4899' }
        ].map(opt => (
          <button
            key={opt.label}
            onClick={() => handeWhoClick(opt.label)}
            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-[3px] transition-all group ${
              whoAsked === opt.label 
                ? 'border-white bg-white/20 scale-[1.05] shadow-[0_0_40px_rgba(255,255,255,0.3)]' 
                : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            <span className="text-6xl mb-3 group-hover:scale-110 transition-transform">{opt.emoji}</span>
            <span className="font-heading font-black text-xl uppercase tracking-wider text-white">{opt.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => { playSuccess(); onComplete(); }}
        disabled={!canProceedTask2}
        className="w-full py-6 rounded-full font-heading font-black text-white text-2xl tracking-widest uppercase transition-all disabled:opacity-30 hover:scale-[1.02] shadow-[0_15px_30px_rgba(124,77,255,0.4)]"
        style={{ background: 'linear-gradient(135deg, #7c4dff, #ec4899)' }}
      >
        CLAIM REWARD 🏆
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 overflow-hidden touch-none selection:bg-transparent"
         style={{ background: 'radial-gradient(100% 100% at 50% 0%, rgba(124,77,255,0.1) 0%, #050814 100%)' }}>
      
      {/* HUD Bar */}
      <div className="w-full max-w-xl flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col">
          <span className="text-secondary-text text-[10px] font-black uppercase tracking-widest pl-1">Step {task + 1}/2</span>
          <div className="w-32 h-2.5 rounded-full bg-white/10 mt-1 overflow-hidden">
            <div className="h-full transition-all duration-500 ease-out" style={{ width: `${((task+1)/2)*100}%`, background: 'linear-gradient(90deg, #7c4dff, #ec4899)' }} />
          </div>
        </div>
        <button onClick={() => window.location.reload()} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      {task === 0 ? Task1 : Task2}

    </div>
  );
};
