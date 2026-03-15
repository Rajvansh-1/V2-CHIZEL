// src/pages/dashboard/IntroVideoPage.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const IntroVideoPage = () => {
  const navigate = useNavigate();
  const [canSkip,    setCanSkip]    = useState(true); // Allow skipping instantly
  const [countdown,  setCountdown]  = useState(3);
  const [hasVideo] = useState(false); // Set to true when adding video
  const timerRef = useRef(null);

  useEffect(() => {
    // Auto-skip or countdown
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          if (!hasVideo) navigate('/day/1'); // Auto skip if no video
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [hasVideo, navigate]);

  const goToDay1 = () => navigate('/day/1');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(31,111,235,0.12), transparent 70%)' }} />

      {/* Skip button (instantly active) */}
      <button
        onClick={goToDay1}
        className="absolute top-6 right-6 px-5 py-2 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 z-50 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      >
        Skip ⏭
      </button>

      <div className="flex flex-col items-center text-center px-6 max-w-xl">
        {hasVideo ? (
          <video
            src="/videos/intro.mp4"
            autoPlay
            onEnded={goToDay1}
            className="w-full rounded-2xl border border-white/10 shadow-2xl mb-6"
            style={{ boxShadow: '0 0 60px rgba(31,111,235,0.2)' }}
          />
        ) : (
          /* ── Gamified Initialization Sequence ── */
          <div className="relative mb-10 w-full max-w-[280px] aspect-square flex items-center justify-center">
            {/* Core rotating rings */}
            <div className="absolute inset-0 rounded-full border-[3px] border-t-primary border-r-transparent border-b-accent border-l-transparent animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 rounded-full border-[2px] border-l-primary/50 border-r-accent/50 border-t-transparent border-b-transparent animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            
            {/* Center Logo Glow */}
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center relative z-10 bg-background/50 backdrop-blur-md border border-white/10"
              style={{ boxShadow: '0 0 80px rgba(31,111,235,0.4)', animation: 'pulse 2s ease-in-out infinite' }}
            >
              <img src="/images/logo.png" alt="Chizel" className="w-16 h-16 object-contain" />
            </div>
            
            {/* Status text floating below */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-ui uppercase tracking-widest font-bold">
              Sequence Initiating... {countdown}
            </div>
          </div>
        )}

        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-ui font-semibold mb-4 border"
          style={{ background: 'rgba(31,111,235,0.1)', borderColor: 'rgba(31,111,235,0.3)', color: '#60a5fa' }}
        >
          🚀 Your Journey Begins
        </span>

        <h1 className="font-heading text-3xl sm:text-4xl font-black text-text mb-3 leading-tight">
          Welcome to <span style={{ background: 'linear-gradient(135deg, #1f6feb, #7c4dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chizel</span>
        </h1>

        <p className="text-secondary-text text-base max-w-sm leading-relaxed mb-8">
          Get ready for an epic journey. Today you start Day 1 — your first 3 missions await! Complete them to unlock your powers. 💥
        </p>

        {canSkip && (
          <button
            onClick={goToDay1}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-base transition-all duration-200 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #1f6feb, #7c4dff)', boxShadow: '0 0 30px rgba(31,111,235,0.4)' }}
          >
            Start Day 1 <FaArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default IntroVideoPage;
