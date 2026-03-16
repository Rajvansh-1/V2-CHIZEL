import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSound } from '@/hooks/useSound';
import { FaArrowRight } from 'react-icons/fa';

export const RewardBanner = ({ emoji, title, points, color, onContinue }) => {
  const ref = useRef(null);
  const { playTada } = useSound();
  
  useGSAP(() => {
    playTada();
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

    // Staggered text
    tl.fromTo('.reward-text',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.4'
    );

    // XP count up
    const ptsElement = document.querySelector('.reward-pts');
    if (ptsElement) {
      const targetPts = parseInt(points.replace(/\D/g, ''), 10) || 0;
      gsap.to({ val: 0 }, {
        val: targetPts,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: function() {
          ptsElement.innerText = `+${Math.round(this.targets()[0].val)} PTS`;
        }
      });
    }

    gsap.to('.reward-rays', { rotation: 360, duration: 20, repeat: -1, ease: 'linear' });
  }, { scope: ref });

  return (
    <div ref={ref} className="fixed inset-0 z-[500] flex items-center justify-center overflow-hidden">
      <div className="reward-bg absolute inset-0 bg-background/95 backdrop-blur-2xl" />
      
      {/* Light Rays */}
      <div className="reward-rays absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 pointer-events-none"
           style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${color} 45deg, transparent 90deg, ${color} 135deg, transparent 180deg, ${color} 225deg, transparent 270deg, ${color} 315deg, transparent 360deg)` }} />
      
      {/* Star Particles */}
      {Array.from({length: 12}).map((_, i) => (
        <div key={i} className="absolute w-2 h-2 rounded-full" style={{
          background: color,
          boxShadow: `0 0 10px ${color}`,
          top: '50%', left: '50%',
          transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-200px)`,
          animation: `pulse 2s infinite ${i * 0.1}s`
        }} />
      ))}

      <div className="reward-card relative z-10 flex flex-col items-center w-full max-w-sm px-6">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[80px] opacity-60 mix-blend-screen pointer-events-none" style={{ background: color }} />
        
        <div className="reward-emoji text-[140px] leading-none mb-6 relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" style={{ filter: `drop-shadow(0 0 50px ${color})` }}>
          {emoji}
        </div>

        <div className="text-center w-full">
          <div className="reward-text inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-6" style={{ background: `${color}15`, borderColor: `${color}40`, boxShadow: `0 0 20px ${color}20` }}>
            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: color, boxShadow: `0 0 15px ${color}` }} />
            <span className="text-xs font-black uppercase tracking-[0.25em]" style={{ color }}>MISSION CLEARED</span>
          </div>
          
          <h2 className="reward-text font-heading text-4xl sm:text-5xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-md">
            {title}
          </h2>
          
          <div className="reward-text flex items-center justify-center gap-3 mb-12 bg-white/5 py-4 rounded-3xl border border-white/10">
            <span className="text-3xl font-black reward-pts" style={{ color, textShadow: `0 0 25px ${color}60` }}>0 PTS</span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="reward-text w-full py-5 rounded-[2rem] font-black text-white text-xl tracking-widest uppercase transition-all duration-300 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
          style={{ background: color, border: `2px solid ${color}` }}
        >
          <span className="relative z-10 font-heading">CONTINUE JOURNEY</span>
          <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform text-2xl" />
        </button>
      </div>
    </div>
  );
};
