// src/pages/dashboard/Day1Page.jsx
import { useState, useRef, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { FaArrowRight, FaCheck, FaBrain, FaUsers, FaPalette, FaStar, FaTimes, FaUpload } from 'react-icons/fa';
import clsx from 'clsx';
import { useSound } from '@/hooks/useSound';

// ─── Data ─────────────────────────────────────────────────────────────────────
const BRAIN_LEVELS = [
  { level: 1, title: 'Fruit Math',     question: '🍎 + 🍎 = ?', options: ['1','2','3','4'], correctIndex: 1 },
  { level: 2, title: 'Odd One Out',    question: 'Find the odd one out:', options: ['🐶','🐱','🚗','🐠'], correctIndex: 2 },
  { level: 3, title: 'Shape Logic',    question: 'Which shape has 3 sides?', options: ['🟥','🔵','🔺','⭐'], correctIndex: 2 },
  { level: 4, title: 'Pattern Match',  question: '🔴 🔵 🔴 🔵 __ ?', options: ['🔴','🔵','🟢','⭐'], correctIndex: 0 },
  { level: 5, title: 'Star Counter',   question: '⭐ ⭐ ⭐', options: ['1','2','3','4'], correctIndex: 2 },
];

// ─── Utility: Confetti particle ───────────────────────────────────────────────
const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
    {Array.from({ length: 40 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-sm"
        style={{
          left: `${Math.random() * 100}%`,
          top: '-10px',
          background: ['#1f6feb','#7c4dff','#f59e0b','#10b981','#ec4899'][i % 5],
          animation: `confettiFall ${1.5 + Math.random() * 2}s ${Math.random() * 0.8}s ease-in forwards`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }}
      />
    ))}
    <style>{`
      @keyframes confettiFall {
        to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `}</style>
  </div>
);

// ─── Gamified Reward Banner ────────────────────────────────────────────────────
const RewardBanner = ({ emoji, title, points, color, onContinue }) => {
  const ref = useRef(null);
  const { playUnlock, playClick } = useSound();
  
  useGSAP(() => {
    playUnlock();
    const tl = gsap.timeline();
    // Background fade in
    tl.fromTo('.reward-bg', { opacity: 0 }, { opacity: 1, duration: 0.5 });
    
    // Main content container pop
    tl.fromTo('.reward-card', 
      { scale: 0.5, opacity: 0, y: 50 }, 
      { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.7)' },
      '-=0.2'
    );

    // Emoji burst
    tl.fromTo('.reward-emoji',
      { scale: 0, rotation: -45 },
      { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.5)' },
      '-=0.5'
    );

    // Staggered text elements
    tl.fromTo('.reward-text',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );

    // Rotating light rays
    gsap.to('.reward-rays', {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'linear'
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="fixed inset-0 z-[500] flex items-center justify-center overflow-hidden">
      {/* Dark blur background */}
      <div className="reward-bg absolute inset-0 bg-background/90 backdrop-blur-xl" />
      
      {/* Animated Light Rays */}
      <div className="reward-rays absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none"
           style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${color} 45deg, transparent 90deg, ${color} 135deg, transparent 180deg, ${color} 225deg, transparent 270deg, ${color} 315deg, transparent 360deg)` }} />
      
      <div className="reward-card relative z-10 flex flex-col items-center w-full max-w-sm px-6">
        
        {/* Glow behind emoji */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[60px] opacity-60 mix-blend-screen pointer-events-none" style={{ background: color }} />
        
        {/* Giant Emoji Icon */}
        <div className="reward-emoji text-[120px] leading-none mb-6 relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" style={{ filter: `drop-shadow(0 0 40px ${color})` }}>
          {emoji}
        </div>

        {/* Text Details */}
        <div className="text-center w-full">
          <div className="reward-text inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6" style={{ background: `${color}15`, borderColor: `${color}40`, boxShadow: `0 0 20px ${color}20` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color }}>STATUS: COMPLETED</span>
          </div>
          
          <h2 className="reward-text font-heading text-4xl sm:text-5xl font-black text-white leading-tight mb-2 tracking-tight drop-shadow-md">
            {title}
          </h2>
          
          <div className="reward-text flex items-center justify-center gap-3 mb-10">
            <span className="text-2xl font-bold text-secondary-text">REWARD:</span>
            <span className="text-3xl font-black" style={{ color, textShadow: `0 0 20px ${color}60` }}>{points}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => { playClick(); onContinue(); }}
          className="reward-text w-full py-5 rounded-2xl font-black text-white text-lg sm:text-xl tracking-widest uppercase transition-all duration-300 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group border border-white/20"
          style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`, backdropFilter: 'blur(20px)', boxShadow: `0 10px 40px ${color}40` }}
        >
          {/* Button Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${color}60, transparent 70%)` }} />
          
          <span className="relative z-10 font-heading">CONTINUE JOURNEY</span>
          <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// ─── Rules Modal (Mission Briefing) ────────────────────────────────────────────
const RulesModal = ({ onAccept }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(5, 8, 20, 0.95)', backdropFilter: 'blur(16px)' }}>
    <div className="relative w-full max-w-2xl rounded-[2rem] border border-primary/40 p-8 md:p-12 overflow-hidden" style={{ background: 'linear-gradient(145deg, rgba(15,22,45,0.95), rgba(8,12,25,0.98))', boxShadow: '0 0 80px rgba(31,111,235,0.2)' }}>
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/50 rounded-tl-[2rem]" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/50 rounded-tr-[2rem]" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/50 rounded-bl-[2rem]" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/50 rounded-br-[2rem]" />
      
      {/* Tech indicators */}
      <div className="absolute top-6 right-8 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>

      <div className="text-center mb-8 relative z-10">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary uppercase tracking-widest text-xs font-bold mb-4 font-ui">
          Initialization Sequence
        </div>
        <h2 className="font-heading text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-pink-500 mb-2 uppercase tracking-tight">Mission Briefing</h2>
        <p className="text-secondary-text text-sm sm:text-base uppercase tracking-widest font-ui text-primary/80">Day 1 Core Directives</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10 relative z-10">
        {[
          ['🎯', 'No Skipping', 'Complete all missions in exact order.'],
          ['🤝', 'Real Connection', 'Social tasks require offline family interaction.'],
          ['🎨', 'Real Effort', 'Creator tasks need physical effort, no digital cheats.'],
          ['🏆', 'Honor Code', 'Points are earned, never given. Stay honest!']
        ].map(([icon, label, text]) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-start hover:bg-white/10 hover:border-primary/40 transition-colors">
            <span className="text-2xl mt-1">{icon}</span>
            <div>
              <h4 className="text-text font-bold text-sm uppercase tracking-wide mb-1">{label}</h4>
              <p className="text-secondary-text text-xs leading-relaxed">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAccept}
        className="relative z-10 w-full py-4 sm:py-5 rounded-full font-black text-white text-lg tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 overflow-hidden group"
        style={{ background: 'linear-gradient(135deg, #1f6feb, #7c4dff)', boxShadow: '0 0 40px rgba(124,77,255,0.4)' }}
      >
        <span className="relative z-10">Acknowledge & Start</span>
        <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  </div>
);

// ─── Gamified Mission Card ────────────────────────────────────────────────────────
const MissionCard = ({ icon, title, subtitle, points, status, color, onClick, delay }) => {
  const ref = useRef(null);
  const { playClick } = useSound();
  useGSAP(() => {
    gsap.fromTo(ref.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6, delay: delay * 0.15, ease: 'back.out(1.2)' });
  }, { scope: ref });

  const statusMeta = {
    locked:     { label: 'LOCKED',  icon: '🔒', btn: 'RESTRICTED', style: { background: 'rgba(255,255,255,0.03)', color: '#666', border: '1px solid rgba(255,255,255,0.05)', cursor: 'not-allowed' } },
    available:  { label: 'ACTIVE',  icon: '⚡', btn: 'INITIATE',   style: { background: `linear-gradient(135deg, ${color}, #7c4dff)`, boxShadow: `0 0 25px ${color}60`, color: '#fff', fontWeight: '900', border: 'none' } },
    completed:  { label: 'CLEARED', icon: '✅', btn: 'REVIEW',     style: { background: 'rgba(16,200,100,0.1)', border: '1px solid rgba(16,200,100,0.4)', color: '#4ade80', fontWeight: '600' } },
  };
  const meta = statusMeta[status] || statusMeta.locked;

  return (
    <div
      ref={ref}
      className={`relative rounded-3xl border ${status === 'available' ? 'border-primary/50 bg-primary/5' : 'border-white/10 bg-white/5'} p-5 sm:p-6 overflow-hidden transition-all duration-300 group ${status !== 'locked' ? 'cursor-pointer hover:-translate-y-1' : ''}`}
      style={{
        background: status === 'available' ? 'linear-gradient(145deg, rgba(31,111,235,0.15), rgba(11,18,38,0.95))' : 'linear-gradient(145deg, rgba(15,22,45,0.6), rgba(8,12,25,0.8))',
        boxShadow: status === 'available' ? `0 10px 40px ${color}20 inset, 0 0 30px ${color}30` : 'none',
        backdropFilter: 'blur(10px)',
      }}
      onClick={() => {
        if (status !== 'locked' && onClick) {
          playClick();
          onClick();
        }
      }}
    >
      {/* Glow overlay on hover */}
      {status !== 'locked' && (
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `radial-gradient(ellipse at top left, ${color}20, transparent 70%)` }} />
      )}

      {/* Decorative corner accent */}
      {status === 'available' && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/30 to-transparent rounded-bl-full pointer-events-none" />}

      <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        <div className="flex-shrink-0 relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner relative z-10" style={{ background: `${color}15`, border: `1px solid ${color}40` }}>
            {icon}
          </div>
          {status === 'available' && <div className="absolute inset-0 bg-primary rounded-2xl blur-xl opacity-30 animate-pulse" />}
        </div>
        
        <div className="flex-grow w-full">
          <div className="flex items-center gap-2 mb-1.5 line-clamp-1">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${status === 'completed' ? 'border-green-500/50 text-green-400 bg-green-500/10' : status === 'available' ? 'border-accent/50 text-accent bg-accent/10' : 'border-white/10 text-secondary-text bg-white/5'}`}>
              {meta.icon} {meta.label}
            </span>
            <span className="text-xs font-ui font-black uppercase tracking-widest" style={{ color }}>{points}</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight mb-1">{title}</h3>
          <p className="text-secondary-text text-sm mb-4 sm:mb-0 line-clamp-2 pr-4">{subtitle}</p>
        </div>

        <div className="flex-shrink-0 w-full sm:w-auto">
          <button
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 tracking-widest uppercase`}
            style={meta.style}
          >
            {meta.btn} {status === 'available' && <FaArrowRight />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Gamified Mission 1: Brain Power ───────────────────────────────────────────
const Mission1 = ({ onComplete }) => {
  const [level,     setLevel]    = useState(0);
  const [selected,  setSelected] = useState(null);
  const [feedback,  setFeedback] = useState(null);
  const [score,     setScore]    = useState(0);
  const { playClick, playSuccess, playError } = useSound();

  const current = BRAIN_LEVELS[level];

  const handleAnswer = useCallback((idx) => {
    if (feedback) return;
    playClick();
    setSelected(idx);
    const correct = idx === current.correctIndex;
    setFeedback(correct ? 'correct' : 'wrong');
    
    if (correct) {
      setScore(s => s + 1);
      playSuccess();
    } else {
      playError();
    }

    setTimeout(() => {
      if (level < BRAIN_LEVELS.length - 1) {
        setLevel(l => l + 1);
        setSelected(null);
        setFeedback(null);
      } else {
        onComplete();
      }
    }, 900);
  }, [feedback, current, level, onComplete]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-20">
      {/* Progress */}
      <div className="w-full max-w-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-secondary-text text-xs font-ui">Level {level + 1} of {BRAIN_LEVELS.length}</span>
          <span className="text-primary text-xs font-ui font-semibold">🧠 Brain Power</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" style={{ width: `${((level) / BRAIN_LEVELS.length) * 100}%` }} />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg rounded-3xl border border-white/10 p-6 sm:p-10 text-center" style={{ background: 'linear-gradient(145deg, rgba(15,22,45,0.95), rgba(11,18,38,0.98))', boxShadow: '0 0 80px rgba(31,111,235,0.15)' }}>
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border" style={{ background: 'rgba(31,111,235,0.15)', borderColor: 'rgba(31,111,235,0.4)', color: '#60a5fa' }}>
            {current.title}
          </span>
        </div>
        
        {/* Massive Gamified Question */}
        <h2 className="font-heading text-4xl sm:text-6xl font-black text-white mb-10 leading-snug drop-shadow-lg tracking-widest">{current.question}</h2>

        <div className="grid grid-cols-2 gap-4 min-h-[140px]">
          {current.options.map((opt, i) => {
            const isSelected  = selected === i;
            const isCorrect   = i === current.correctIndex;
            let bColor = 'border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/8';
            let textColor = 'text-secondary-text hover:text-text';
            if (feedback && isSelected && isCorrect)  { bColor = 'border-green-500 bg-green-500/20'; textColor = 'text-green-300'; }
            if (feedback && isSelected && !isCorrect) { bColor = 'border-red-500 bg-red-500/20';   textColor = 'text-red-300'; }
            if (feedback && !isSelected && isCorrect) { bColor = 'border-green-500/50 bg-green-500/10'; textColor = 'text-green-400'; }

            return (
              <button
                key={opt}
                onClick={() => handleAnswer(i)}
                className={`py-6 rounded-[2rem] border-2 font-heading font-black text-3xl sm:text-4xl transition-all duration-200 ${bColor} ${textColor} hover:scale-[1.05] active:scale-95 flex items-center justify-center text-center shadow-lg`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-8 min-h-[48px]">
          {feedback && (
            <div className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-lg font-black tracking-wide animate-in fade-in slide-in-from-bottom-4 ${feedback === 'correct' ? 'bg-green-500/20 border-2 border-green-500/50 text-green-400 shadow-[0_0_30px_rgba(16,200,100,0.3)]' : 'bg-red-500/20 border-2 border-red-500/50 text-red-400 shadow-[0_0_30px_rgba(240,60,60,0.3)]'}`}>
              {feedback === 'correct' ? '🌟 AMAZING! Correct!' : '❌ Oops! Watch the highlights!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Mission 2: Social Explorer ────────────────────────────────────────────────
const Mission2 = ({ onComplete }) => {
  const [task,        setTask]        = useState(0);
  const [familyAnswer,setFamilyAnswer]= useState('');
  const [willTry,     setWillTry]     = useState('');
  const [whoAsked,    setWhoAsked]    = useState('');
  const { playClick, playSuccess } = useSound();

  const canProceedTask1 = familyAnswer.trim().length > 3 && willTry;
  const canProceedTask2 = whoAsked;

  const Task1 = (
    <div className="w-full max-w-lg text-center">
      <div className="rounded-3xl border border-white/10 p-6 sm:p-10 mb-6" style={{ background: 'linear-gradient(145deg, rgba(15,22,45,0.95), rgba(11,18,38,0.98))', boxShadow: '0 0 80px rgba(124,77,255,0.15)' }}>
        <div className="text-[80px] leading-none mb-6 drop-shadow-xl inline-block animate-bounce">🏠</div>
        
        <h2 className="font-heading text-3xl font-black text-white mb-2">Ask someone at home:</h2>
        <div className="bg-accent/10 border-2 border-accent/30 rounded-[2rem] p-6 mb-8 shadow-inner">
          <p className="text-accent text-2xl sm:text-3xl font-heading font-black leading-tight">"What did you love playing when you were my age?"</p>
        </div>

        <textarea
          value={familyAnswer}
          onChange={e => setFamilyAnswer(e.target.value)}
          placeholder="Type their answer here..."
          rows={2}
          className="w-full px-6 py-4 rounded-2xl border-2 border-white/10 bg-white/5 text-text placeholder-secondary-text text-lg focus:outline-none focus:border-accent/80 transition-all duration-200 resize-none mb-8 font-ui font-semibold shadow-inner"
        />

        <p className="text-white text-xl font-heading font-black mb-4">You want to try it?</p>
        <div className="grid grid-cols-2 gap-3">
          {['YES! 😍', 'MAYBE 🤔', 'NOT SURE 😐', 'NO WAY 🙈'].map(opt => (
            <button
              key={opt}
              onClick={() => { playClick(); setWillTry(opt); }}
              className={`py-4 rounded-xl border-2 font-black text-lg sm:text-xl transition-all duration-200 ${willTry === opt ? 'border-accent bg-accent/20 text-white shadow-[0_0_20px_rgba(124,77,255,0.4)] scale-105' : 'border-white/10 bg-white/5 text-secondary-text hover:border-white/30 hover:text-white'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => {
          playSuccess();
          setTask(1);
        }}
        disabled={!canProceedTask1}
        className="w-full py-5 rounded-[2rem] font-black text-white text-xl tracking-widest uppercase transition-all duration-300 disabled:opacity-30 disabled:scale-100 hover:scale-[1.03] shadow-lg border border-white/20"
        style={{ background: 'linear-gradient(135deg, #7c4dff, #ec4899)' }}
      >
        NEXT CHALLENGE ⚡
      </button>
    </div>
  );

  const Task2 = (
    <div className="w-full max-w-lg text-center">
      <div className="rounded-3xl border border-white/10 p-6 sm:p-10 mb-6" style={{ background: 'linear-gradient(145deg, rgba(15,22,45,0.95), rgba(11,18,38,0.98))', boxShadow: '0 0 80px rgba(124,77,255,0.15)' }}>
        <div className="text-[80px] leading-none mb-6 drop-shadow-xl inline-block animate-pulse">🎮</div>
        
        <h2 className="font-heading text-3xl font-black text-white mb-8">Who did you ask?</h2>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Mom / Dad', emoji: '🧑‍🤝‍🧑' },
            { label: 'Sibling', emoji: '👦👧' },
            { label: 'Grandparent', emoji: '👵👴' },
            { label: 'Friend', emoji: '🙋‍♂️🙋‍♀️' }
          ].map(opt => (
            <button
              key={opt.label}
              onClick={() => { playClick(); setWhoAsked(opt.label); }}
              className={`py-6 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all duration-200 ${whoAsked === opt.label ? 'border-accent bg-accent/20 text-white shadow-[0_0_30px_rgba(124,77,255,0.4)] scale-105' : 'border-white/10 bg-white/5 text-secondary-text hover:border-white/30 hover:text-white'}`}
            >
              <span className="text-4xl">{opt.emoji}</span>
              <span className="font-black text-lg uppercase tracking-wide">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => { playSuccess(); onComplete(); }}
        disabled={!canProceedTask2}
        className="w-full py-5 rounded-[2rem] font-black text-white text-xl tracking-widest uppercase transition-all duration-300 disabled:opacity-30 disabled:scale-100 hover:scale-[1.03] shadow-lg border border-white/20"
        style={{ background: 'linear-gradient(135deg, #7c4dff, #ec4899)' }}
      >
        CLAIM REWARD 🏆
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-secondary-text text-xs font-ui">Task {task + 1} of 2</span>
          <span className="text-xs font-ui font-semibold" style={{ color: '#7c4dff' }}>🤝 Social Explorer</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(task / 2) * 100}%`, background: 'linear-gradient(90deg, #7c4dff, #ec4899)' }} />
        </div>
      </div>
      {task === 0 ? Task1 : Task2}
    </div>
  );
};

// ─── Mission 3: Creator Challenge ──────────────────────────────────────────────
const Mission3 = ({ onComplete }) => {
  const { user } = useAuth();
  const [phase,     setPhase]    = useState('instructions'); // 'instructions' | 'upload'
  const [preview,   setPreview]  = useState(null);
  const [uploading, setUploading]= useState(false);
  const fileRef = useRef(null);
  const { playClick, playSuccess } = useSound();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please login to upload your creation!");
      return;
    }

    setUploading(true);
    let publicUrl = null;

    try {
      const file = fileRef.current?.files?.[0];
      if (!file) throw new Error("No file selected");

      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('mission_uploads')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('mission_uploads')
        .getPublicUrl(filePath);

      publicUrl = data.publicUrl;
      onComplete(publicUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Have you created the 'mission_uploads' bucket in Supabase? Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-20">
      {phase === 'instructions' ? (
        <div className="w-full max-w-lg text-center">
          <div className="rounded-3xl border border-white/10 p-6 sm:p-10 mb-6" style={{ background: 'linear-gradient(145deg, rgba(15,22,45,0.95), rgba(11,18,38,0.98))', boxShadow: '0 0 80px rgba(245,158,11,0.15)' }}>
            <div className="text-[80px] leading-none mb-6 drop-shadow-xl inline-block animate-pulse">🎨</div>
            
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white mb-6">Observe & Draw</h2>
            
            <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-[2rem] p-6 mb-8 text-left shadow-inner">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl">👀</span>
                <div>
                  <h3 className="text-yellow-400 font-bold text-lg leading-tight mb-1">1. Find something cool</h3>
                  <p className="text-secondary-text text-sm font-ui">A plant, a shoe, your favorite toy...</p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl">⏱️</span>
                <div>
                  <h3 className="text-yellow-400 font-bold text-lg leading-tight mb-1">2. Look closely</h3>
                  <p className="text-secondary-text text-sm font-ui">Stare at it for 1 minute. Notice everything!</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">✏️</span>
                <div>
                  <h3 className="text-yellow-400 font-bold text-lg leading-tight mb-1">3. Draw it on paper</h3>
                  <p className="text-secondary-text text-sm font-ui">Then take a photo!</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => { playClick(); setPhase('upload'); }}
            className="w-full py-5 rounded-[2rem] font-black text-white text-xl tracking-widest uppercase transition-all duration-300 hover:scale-[1.03] shadow-lg border border-white/20"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
          >
            I'VE DRAWN IT! 📸
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg text-center">
          <div className="rounded-3xl border border-white/10 p-6 sm:p-10 mb-6" style={{ background: 'linear-gradient(145deg, rgba(15,22,45,0.95), rgba(11,18,38,0.98))' }}>
            <div className="text-[60px] leading-none mb-4 drop-shadow-xl inline-block">📸</div>
            <h2 className="font-heading text-3xl font-black text-white mb-8">Upload Photo</h2>

            {/* Upload area */}
            <div
              className="relative rounded-[2rem] border-4 border-dashed border-white/20 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-yellow-500/50 hover:bg-white/5 transition-all duration-300 mb-4"
              onClick={() => { playClick(); fileRef.current?.click(); }}
              style={preview ? { padding: 0, border: 'none' } : {}}
            >
              {preview ? (
                <div className="relative w-full group">
                  <img src={preview} alt="Your drawing" className="w-full rounded-[2rem] object-cover max-h-80 shadow-2xl" />
                  <button
                    onClick={(e) => { e.stopPropagation(); playClick(); setPreview(null); }}
                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/80 flex items-center justify-center text-white text-xl hover:bg-red-500 transition-colors shadow-lg scale-0 group-hover:scale-100 transition-transform"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)', border: '2px solid rgba(245,158,11,0.3)' }}>
                    <FaUpload className="text-yellow-400 text-3xl" />
                  </div>
                  <p className="text-white text-xl font-heading font-black mt-2">Tap to Select Photo</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { playSuccess(); handleFile(e); }} />
          </div>

          <button
            onClick={() => { playSuccess(); handleSubmit(); }}
            disabled={!preview || uploading}
            className="w-full py-5 rounded-[2rem] font-black text-white text-xl tracking-widest uppercase transition-all duration-300 disabled:opacity-30 disabled:scale-100 hover:scale-[1.03] shadow-lg border border-white/20"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 rounded-full border-4 border-white border-t-transparent animate-spin" /> UPLOADING...
              </span>
            ) : 'CLAIM REWARD 🏆'}
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Day 1 Completion Screen ───────────────────────────────────────────────────
const CompletionScreen = ({ scores }) => {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const ref = useRef(null);
  useGSAP(() => {
    gsap.from('.complete-el', { opacity: 0, y: 30, stagger: 0.15, duration: 0.6, ease: 'power3.out' });
  }, { scope: ref });

  return (
    <div ref={ref} className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <Confetti />
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(31,111,235,0.1), transparent 70%)' }} />

      <div className="complete-el text-8xl mb-4">🏆</div>
      <div className="complete-el inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 border border-green-500/30 text-green-400 bg-green-500/10">
        Day 1 Complete!
      </div>
      <h1 className="complete-el font-heading text-3xl sm:text-4xl font-black text-text text-center mb-2">You're a Champion!</h1>
      <p className="complete-el text-secondary-text text-base text-center max-w-xs mb-8">You completed all 3 missions on Day 1. The world better watch out! 🌟</p>

      {/* Points summary */}
      <div className="complete-el w-full max-w-sm rounded-3xl border border-white/10 p-6 mb-6" style={{ background: 'rgba(15,22,45,0.8)' }}>
        <p className="text-secondary-text text-xs font-ui uppercase tracking-widest text-center mb-4">Your Powers Unlocked</p>
        <div className="space-y-3">
          {[
            { emoji: '🧠', label: 'Brain Power',   points: scores.brain,   color: '#1f6feb' },
            { emoji: '🤝', label: 'Social Power',  points: scores.social,  color: '#7c4dff' },
            { emoji: '🎨', label: 'Creator Power', points: scores.creator, color: '#f59e0b' },
          ].map(({ emoji, label, points, color }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-text text-sm">{emoji} {label}</span>
              <span className="font-bold font-ui text-sm" style={{ color }}>+{points} pts</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-3 flex items-center justify-between">
            <span className="text-text font-bold">Total Points</span>
            <span className="font-black text-xl" style={{ background: 'linear-gradient(135deg,#1f6feb,#f59e0b)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{total}</span>
          </div>
        </div>
      </div>

      <p className="complete-el text-secondary-text text-sm">See you tomorrow for Day 2! 👋</p>
    </div>
  );
};

// ─── Main Day1 Page ────────────────────────────────────────────────────────────
const Day1Page = () => {
  const { user } = useAuth();
  const [showRules,   setShowRules]   = useState(() => !localStorage.getItem('chizel_rules_seen'));
  const [view,        setView]        = useState('overview'); // 'overview' | 'm1' | 'm2' | 'm3' | 'done'
  const [reward,      setReward]      = useState(null);
  const [missions,    setMissions]    = useState({ m1: false, m2: false, m3: false });
  const [scores,      setScores]      = useState({ brain: 0, social: 0, creator: 0 });
  const [loading,     setLoading]     = useState(true);

  // Fetch existing progress
  useEffect(() => {
    let isMounted = true;
    const fetchProgress = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const { data, error } = await supabase
          .from('mission_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('day', 1);
        
        if (error) throw error;
        
        if (data && data.length > 0 && isMounted) {
          const completed = { m1: false, m2: false, m3: false };
          const loadedScores = { brain: 0, social: 0, creator: 0 };
          
          data.forEach(m => {
            if (m.mission === 1 && m.completed) { completed.m1 = true; loadedScores.brain = m.points || 0; }
            if (m.mission === 2 && m.completed) { completed.m2 = true; loadedScores.social = m.points || 0; }
            if (m.mission === 3 && m.completed) { completed.m3 = true; loadedScores.creator = m.points || 0; }
          });
          
          setMissions(completed);
          setScores(loadedScores);

          // If all are completed, they should see the done screen immediately
          if (completed.m1 && completed.m2 && completed.m3) {
            setView('done');
          }
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProgress();
    return () => { isMounted = false; };
  }, [user]);

  const acceptRules = () => {
    localStorage.setItem('chizel_rules_seen', '1');
    setShowRules(false);
  };

  const completeMission = useCallback((mission, points, rewardData, metadata = {}) => {
    setMissions(prev => ({ ...prev, [mission]: true }));
    setScores(prev => ({ ...prev, ...points }));
    // Save to Supabase (fire and forget)
    if (user) {
      supabase.from('mission_progress').upsert({
        user_id:      user.id,
        day:          1,
        mission:      parseInt(mission.replace('m', '')),
        completed:    true,
        points:       Object.values(points)[0],
        metadata:     metadata,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,day,mission' });
    }
    setReward({ ...rewardData, onContinue: () => { setReward(null); setView('overview'); } });
  }, [user]);

  // Mission completion handlers
  const onM1Complete = useCallback(() => completeMission('m1', { brain: 40 }, {
    emoji: '🧠', title: 'Brain Power Unlocked!', points: '+40 Brain Points', color: '#1f6feb',
  }), [completeMission]);

  const onM2Complete = useCallback(() => completeMission('m2', { social: 40 }, {
    emoji: '🤝', title: 'Social Power Unlocked!', points: '+40 Social Points', color: '#7c4dff',
  }), [completeMission]);

  const onM3Complete = useCallback((imageUrl) => {
    completeMission('m3', { creator: 50 }, {
      emoji: '🎨', title: 'Creator Power Unlocked!', points: '+50 Creator Points', color: '#f59e0b',
    }, { image_url: imageUrl });
    // After all 3 done, show completion
    setTimeout(() => {
      setReward(null);
      setView('done');
    }, 2200);
  }, [completeMission]);

  // Mission views
  if (view === 'm1') return <><Mission1 onComplete={onM1Complete} />{reward && <RewardBanner {...reward} />}</>;
  if (view === 'm2') return <><Mission2 onComplete={onM2Complete} />{reward && <RewardBanner {...reward} />}</>;
  if (view === 'm3') return <><Mission3 onComplete={onM3Complete} />{reward && <RewardBanner {...reward} />}</>;
  if (view === 'done') return <CompletionScreen scores={scores} />;

  // Mission status logic
  const m1Status  = missions.m1 ? 'completed' : 'available';
  const m2Status  = missions.m1 ? (missions.m2 ? 'completed' : 'available') : 'locked';
  const m3Status  = missions.m2 ? (missions.m3 ? 'completed' : 'available') : 'locked';
  const allDone   = missions.m1 && missions.m2 && missions.m3;
  const totalPts  = scores.brain + scores.social + scores.creator;

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Explorer';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-t-2 border-r-2 border-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(31,111,235,0.08), transparent 60%)' }} />

      {showRules && <RulesModal onAccept={acceptRules} />}
      {reward    && <RewardBanner {...reward} />}

      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/5" style={{ background: 'rgba(11,18,38,0.92)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Chizel" className="w-8 h-8" />
            <div>
              <p className="text-text font-heading font-bold text-sm leading-none">Hey, {displayName}! 👋</p>
              <p className="text-secondary-text text-xs mt-0.5">Day 1 — Start Your Chizel Journey</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span className="font-bold font-ui text-text">{totalPts}</span>
            <span className="text-secondary-text text-xs">pts</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* ── GAMIFIED PLAYER HUD ── */}
        <div className="relative overflow-hidden rounded-[2rem] p-6 lg:p-8 mb-10 border border-primary/20 transition-all duration-500" style={{ background: 'linear-gradient(145deg, rgba(15,22,45,0.9), rgba(8,12,25,0.95))', boxShadow: '0 0 80px rgba(31,111,235,0.15)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Levelling Ring */}
            <div className="relative flex-shrink-0 group">
              <div className="absolute inset-0 rounded-full border-[3px] border-primary/20 border-t-accent animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-[-10px] rounded-full border-[1px] border-dashed border-accent/20 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(31,111,235,0.3)] group-hover:scale-105 transition-transform duration-300">
                <span className="text-4xl text-primary drop-shadow-[0_0_10px_rgba(31,111,235,0.8)]">🚀</span>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border-2 border-[#0B1226] shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                RANK 1
              </div>
            </div>

            {/* Stats & Progress */}
            <div className="flex-grow w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-2">
                <div>
                  <h1 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-1">
                    {displayName}'s <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Journey</span>
                  </h1>
                  <p className="text-primary/80 text-xs font-bold font-ui uppercase tracking-widest">Day 1 • Foundation Phase</p>
                </div>
                <div className="text-right mt-3 md:mt-0">
                  <span className="text-[10px] text-secondary-text font-bold uppercase tracking-widest block mb-0.5">Total XP</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-md">{totalPts}</span>
                </div>
              </div>
              
              {/* XP Bar */}
              <div className="w-full bg-black/50 rounded-full h-4 border border-white/10 overflow-hidden relative shadow-inner mt-4">
                <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-primary via-accent to-pink-500 transition-all duration-1000 origin-left" style={{ width: `${Math.max(5, (totalPts / 130) * 100)}%` }}>
                  <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem', animation: 'progressStripes 1s linear infinite' }} />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-[10px] text-primary font-black uppercase tracking-widest">Progress: {Math.round((totalPts/130)*100)}%</span>
                <span className="text-[10px] text-secondary-text font-bold uppercase tracking-widest">Next Rank: 130 XP</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes progressStripes { 0% { background-position: 1rem 0; } 100% { background-position: 0 0; } }
        `}</style>

        {/* ── MISSIONS HEADER ── */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="h-6 w-1.5 bg-gradient-to-b from-primary to-accent rounded-full" />
          <h2 className="font-heading text-xl md:text-2xl font-black uppercase tracking-widest text-text">Mission Logs</h2>
          <div className="h-px bg-white/10 flex-grow ml-2" />
        </div>

        {/* Mission cards */}
        <div className="space-y-4">
          <MissionCard
            icon="🧠"
            title="Mission 1: Brain Power"
            subtitle="Complete 5 quick brain challenges"
            points="+40 Brain Points"
            status={m1Status}
            color="#1f6feb"
            onClick={() => setView('m1')}
            delay={0}
          />
          <MissionCard
            icon="🤝"
            title="Mission 2: Social Explorer"
            subtitle="Connect with someone at home"
            points="+40 Social Points"
            status={m2Status}
            color="#7c4dff"
            onClick={() => setView('m2')}
            delay={1}
          />
          <MissionCard
            icon="🎨"
            title="Mission 3: Creator Challenge"
            subtitle="Observe, draw, and upload your creation"
            points="+50 Creator Points"
            status={m3Status}
            color="#f59e0b"
            onClick={() => setView('m3')}
            delay={2}
          />
        </div>

        {allDone && (
          <button
            onClick={() => setView('done')}
            className="w-full mt-6 py-4 rounded-full font-bold text-white text-base transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #10b981, #1f6feb)', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}
          >
            🏆 See Day 1 Results!
          </button>
        )}
      </div>
    </div>
  );
};

export default Day1Page;
