import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
    {Array.from({ length: 60 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-3 h-3 rounded-sm"
        style={{
          left: `${Math.random() * 100}%`,
          top: '-20px',
          background: ['#1f6feb','#7c4dff','#f59e0b','#10b981','#ec4899'][i % 5],
          animation: `confettiFall ${1.5 + Math.random() * 2}s ${Math.random() * 1}s ease-in forwards infinite`,
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

export const ShieldProgressBar = ({ completedDays = 0, mini = false }) => {
  const ref = useRef(null);
  const TOTAL_DAYS = 7;
  // In mini mode (e.g. rules popup), always show a fully colored shield for stronger visual impact
  const getVisualPct = (days) => {
    if (days <= 0) return 0;
    if (days === 1) return 0.5; // 50% requested for day 1
    return 0.5 + ((days - 1) / (TOTAL_DAYS - 1)) * 0.5;
  };
  const pct = mini ? 1 : Math.min(getVisualPct(completedDays), 1);
  const clipTop = Math.round((1 - pct) * 100);
  const clipPath = pct === 0
    ? 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
    : `polygon(0% ${clipTop}%, 100% ${clipTop}%, 100% 100%, 0% 100%)`;

  useGSAP(() => {
    if (pct > 0) {
      gsap.fromTo(ref.current.querySelector('.shield-reveal-layer'), { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }, { clipPath, duration: 2, ease: 'power3.out', delay: 0.5 });
      gsap.fromTo(ref.current.querySelector('.shield-glow'), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.5, ease: 'back.out(1.4)', delay: 0.7 });
    }
    gsap.to(ref.current.querySelector('.shield-float'), { y: -10, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }, { scope: ref });

  const shieldSize = mini ? 100 : 200;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="shield-float relative mb-4" style={{ width: shieldSize * 0.9, height: shieldSize }}>
        <div className="shield-glow absolute inset-0 rounded-full blur-[40px] opacity-0 pointer-events-none"
          style={{ background: pct > 0 ? 'radial-gradient(ellipse, rgba(124,77,255,0.7), rgba(31,111,235,0.4), transparent 70%)' : 'transparent' }} />

        {!mini && (
          <img
            src="/images/shield.png"
            alt="Shield"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ filter: 'grayscale(1) brightness(0.2)', userSelect: 'none', pointerEvents: 'none' }}
          />
        )}

        <img
          src="/images/shield.png"
          alt="Shield revealed"
          className="shield-reveal-layer absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_30px_rgba(124,77,255,0.9)]"
          style={{ clipPath: pct > 0 ? clipPath : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', userSelect: 'none', pointerEvents: 'none' }}
        />

        {pct > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full" style={{ clipPath }}>
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'shieldShimmer 2.5s ease-in-out infinite',
            }} />
          </div>
        )}
      </div>

      {!mini && (
        <div className="flex items-center gap-2 mb-3">
          {Array.from({ length: TOTAL_DAYS }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="rounded-full border-2 transition-all duration-500"
                style={{
                  width: i < completedDays ? 14 : 10,
                  height: i < completedDays ? 14 : 10,
                  background: i < completedDays ? 'linear-gradient(135deg, #7c4dff, #1f6feb)' : 'transparent',
                  borderColor: i < completedDays ? '#7c4dff' : 'rgba(255,255,255,0.15)',
                  boxShadow: i < completedDays ? '0 0 10px rgba(124,77,255,0.8)' : 'none',
                }}
              />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: i < completedDays ? '#7c4dff' : 'rgba(255,255,255,0.2)' }}>D{i + 1}</span>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes shieldShimmer { 0%,100%{background-position:200% 0} 50%{background-position:-200% 0} }`}</style>
    </div>
  );
};

export const ComeBackTomorrow = ({ scores, completedDays }) => {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.cbt-card', { opacity: 0, scale: 0.85, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'elastic.out(1, 0.75)' });
    tl.fromTo('.cbt-el', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power3.out' }, '-=0.5');
    gsap.to('.cbt-lock-ring', { rotation: 360, duration: 25, repeat: -1, ease: 'linear' });
    gsap.to('.cbt-trophy', { rotationY: 360, duration: 4, repeat: -1, ease: 'linear' });
  }, { scope: ref });

  // Simple countdown to midnight
  const [timeLeft] = useState('00:00:00'); // for demo
  
  return (
    <div ref={ref} className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(124,77,255,0.15), transparent 60%), linear-gradient(180deg, #050814, #080c20)' }}>
      <Confetti />

      <div className="fixed inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="cbt-lock-ring absolute w-[500px] h-[500px] rounded-full border-[2px] border-dashed border-primary/20" />
        <div className="cbt-lock-ring absolute w-[700px] h-[700px] rounded-full border-[1px] border-dashed border-accent/10" style={{ animationDelay: '-6s' }} />
      </div>

      <div className="cbt-card w-full max-w-lg mt-10">
        <div className="cbt-el flex justify-center mb-6">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border-2 border-green-500/40 bg-green-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
            <span className="text-green-400 text-sm font-black uppercase tracking-[0.2em]">DAY {completedDays} CLEARED! ✅</span>
          </div>
        </div>

        <div className="cbt-el flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-accent/20 blur-[80px] rounded-full mix-blend-screen" />
          <ShieldProgressBar completedDays={completedDays} />
        </div>

        <div className="cbt-el text-center mb-10">
          <h1 className="font-heading text-5xl sm:text-6xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-xl">
            See You <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-pink-500">Tomorrow!</span>
          </h1>
          <p className="text-secondary-text text-lg sm:text-xl font-ui">Your shield is forging. Tomorrow's mission is locked until morning! ☀️</p>
        </div>

        <div className="cbt-el rounded-[2rem] border-2 border-white/10 p-6 mb-6 relative overflow-hidden group"
          style={{ background: 'linear-gradient(145deg, rgba(31,111,235,0.15), rgba(124,77,255,0.1))', backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="flex items-center gap-5 justify-center">
            <div className="text-5xl cbt-trophy drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">🏆</div>
            <div>
              <p className="text-secondary-text text-xs font-black uppercase tracking-widest mb-1 text-center">Total XP Earned</p>
              <p className="text-5xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-tight">{total} PTS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
