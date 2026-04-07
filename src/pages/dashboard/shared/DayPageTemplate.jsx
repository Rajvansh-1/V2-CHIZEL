import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useUI } from '@/context/UIContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSound } from '@/hooks/useSound';
import { FaArrowRight, FaStar, FaSignOutAlt, FaChevronDown, FaEye } from 'react-icons/fa';

import { RewardBanner } from '../day1/RewardBanner';
import { ShieldProgressBar, ComeBackTomorrow } from '../day1/ComeBackTomorrow';

// ── User Avatar Widget ────────────────────────────────────────────────────────
const AvatarWidget = ({ user, totalPts, onLogout }) => {
  const [open, setOpen] = useState(false);
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'Explorer';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative z-[999]">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 bg-black/40 border-2 p-1.5 pr-5 rounded-full hover:bg-black/60 transition-all ${open ? 'border-primary shadow-[0_0_20px_rgba(31,111,235,0.4)]' : 'border-white/10'}`}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-heading font-black text-2xl text-white shadow-inner border-2 border-white/20"
             style={{ background: 'linear-gradient(135deg, #1f6feb, #7c4dff)' }}>
          {initial}
        </div>
        <div className="text-left hidden sm:flex flex-col justify-center">
          <p className="font-heading font-bold text-base leading-none text-white tracking-wide">{displayName}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <FaStar className="text-yellow-400 text-xs drop-shadow-md" />
            <span className="text-sm font-black text-yellow-500 drop-shadow-md">{totalPts} XP</span>
          </div>
        </div>
        <FaChevronDown className={`text-white/50 text-sm transition-transform ${open ? 'rotate-180 text-white' : ''} ml-2`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] w-64 rounded-3xl border-2 border-primary/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-4 z-[999]"
             style={{ background: 'linear-gradient(145deg, rgba(20,28,58,0.98), rgba(11,18,38,0.98))', backdropFilter: 'blur(20px)' }}>

          <div className="p-6 border-b border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none" />
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center font-heading font-black text-3xl text-white shadow-inner border-4 border-white/20 mb-3"
                 style={{ background: 'linear-gradient(135deg, #1f6feb, #7c4dff)' }}>
              {initial}
            </div>
            <p className="font-heading font-bold text-xl text-white truncate">{displayName}</p>
            <div className="flex items-center justify-center gap-2 mt-2 bg-black/30 w-fit mx-auto px-4 py-1.5 rounded-full border border-white/5">
              <FaStar className="text-yellow-400 text-sm" />
              <p className="text-yellow-400 font-black text-base">{totalPts} XP</p>
            </div>
          </div>

          <div className="p-3">
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-red-400 border-2 border-transparent hover:border-red-500/30 hover:bg-red-500/10 transition-all font-black tracking-widest uppercase text-sm group">
              <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── XP Float Animation ─────────────────────────────────────────────────────
const XPToast = ({ pts, color }) => (
  <div
    className="fixed top-24 right-6 z-[200] pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300"
    style={{ animation: 'xpFloat 2.5s ease-out forwards' }}
  >
    <div className="px-5 py-3 rounded-full font-heading font-black text-2xl text-white shadow-2xl border border-white/20"
         style={{ background: `linear-gradient(135deg, ${color}, #f59e0b)`, boxShadow: `0 10px 30px ${color}60` }}>
      +{pts} XP ⚡
    </div>
    <style>{`@keyframes xpFloat { 0%{opacity:0;transform:translateY(20px) scale(0.8)} 20%{opacity:1;transform:translateY(0) scale(1.1)} 70%{opacity:1;transform:translateY(-20px) scale(1)} 100%{opacity:0;transform:translateY(-50px) scale(0.9)} }`}</style>
  </div>
);

// ── Points Progress Bar ────────────────────────────────────────────────────
const PointsBar = ({ label, value, max = 150, color }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-secondary-text text-xs font-black uppercase tracking-wider w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
             style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)`, boxShadow: `0 0 8px ${color}60` }} />
      </div>
      <span className="text-white text-xs font-black w-10 text-right">{value}</span>
    </div>
  );
};

// ── Gamified Mission Card ─────────────────────────────────────────────────────
const MissionCard = ({ icon, title, subtitle, points, status, color, onClick, delay, onReview }) => {
  const ref = useRef(null);
  const { playClick, playError } = useSound();
  useGSAP(() => {
    gsap.fromTo(ref.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6, delay: delay * 0.15, ease: 'back.out(1.2)' });
  }, { scope: ref });

  const isLocked = status === 'locked';
  const isAvailable = status === 'available';
  const isCompleted = status === 'completed';

  return (
    <div
      ref={ref}
      className={`relative rounded-[2rem] p-6 lg:p-8 overflow-hidden transition-all duration-300 group ${isLocked ? '' : 'cursor-pointer hover:scale-[1.02]'}`}
      style={{
        background: isAvailable ? `linear-gradient(145deg, ${color}20, rgba(11,18,38,0.95))` : 'linear-gradient(145deg, rgba(15,22,45,0.6), rgba(8,12,25,0.8))',
        border: `2px solid ${isAvailable ? color : isCompleted ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.05)'}`,
        boxShadow: isAvailable ? `0 10px 40px ${color}30 inset, 0 0 30px ${color}20` : isCompleted ? '0 0 20px rgba(74,222,128,0.1)' : 'none',
      }}
      onClick={() => {
        if (isLocked) { playError(); }
        else if (isCompleted && onReview) { playClick(); onReview(); }
        else if (onClick) { playClick(); onClick(); }
      }}
    >
      <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center">

        <div className="flex-shrink-0 relative">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl shadow-inner relative z-10 transition-transform group-hover:scale-110"
               style={{ background: `${color}15`, border: `2px solid ${color}40`, filter: isLocked ? 'grayscale(1) brightness(0.5)' : 'none' }}>
            {isLocked ? '🔒' : isCompleted ? '✅' : icon}
          </div>
          {isAvailable && <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40 animate-pulse" style={{ background: color }} />}
        </div>

        <div className="flex-grow w-full text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{
                    borderColor: isCompleted ? '#4ade80' : isAvailable ? color : 'rgba(255,255,255,0.2)',
                    color: isCompleted ? '#4ade80' : isAvailable ? color : 'rgba(255,255,255,0.5)',
                    background: isCompleted ? 'rgba(74,222,128,0.1)' : isAvailable ? `${color}15` : 'rgba(255,255,255,0.05)'
                  }}>
              {isCompleted ? 'CLEARED ✓' : isAvailable ? 'ACTIVE' : 'LOCKED'}
            </span>
            <span className="text-sm font-ui font-black uppercase tracking-widest" style={{ color: isLocked ? '#666' : color }}>{points}</span>
          </div>
          <h3 className={`font-heading text-3xl font-black tracking-tight mb-2 ${isLocked ? 'text-white/40' : 'text-white'}`}>{title}</h3>
          <p className="text-secondary-text text-sm sm:text-base pr-0 sm:pr-8">{subtitle}</p>
        </div>

        <div className="flex-shrink-0 w-full sm:w-auto flex gap-2">
          {isCompleted && onReview && (
            <button
              onClick={(e) => { e.stopPropagation(); playClick(); onReview(); }}
              className="px-5 py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all flex items-center gap-2 border border-white/10 hover:border-white/30 text-white/50 hover:text-white"
            >
              <FaEye /> REVIEW
            </button>
          )}
          <button
            className="flex-1 sm:flex-none px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3"
            style={{
              background: isAvailable ? color : 'transparent',
              color: isAvailable ? '#fff' : isCompleted ? '#4ade80' : '#666',
              border: isCompleted ? '2px solid rgba(74,222,128,0.3)' : isLocked ? '2px solid rgba(255,255,255,0.1)' : 'none',
              boxShadow: isAvailable ? `0 10px 20px ${color}60` : 'none'
            }}
          >
            {isAvailable ? 'PLAY NOW' : isCompleted ? 'DONE' : 'RESTRICTED'}
            {isAvailable && <FaArrowRight className="text-lg group-hover:translate-x-2 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Template ─────────────────────────────────────────────────────────────
export function DayPageTemplate({ dayNumber, themeColor, title, subtitle, missionsConfig, M1Component, M2Component, M3Component }) {
  const { user, signOut } = useAuth();
  const { setHideNavbar } = useUI();
  const [view,        setView]       = useState('overview'); // 'overview'|'m1'|'m2'|'m3'|'review_m1'|'review_m2'|'review_m3'|'done'
  const [reward,      setReward]     = useState(null);
  const [missions,    setMissions]   = useState({ m1: false, m2: false, m3: false });
  const [scores,      setScores]     = useState({ brain: 0, social: 0, creator: 0 });
  const [savedMeta,   setSavedMeta]  = useState({ m1: null, m2: null, m3: null });
  const [allTimeXP,   setAllTimeXP]  = useState(0);
  const [loading,     setLoading]    = useState(true);
  const [xpToast,     setXpToast]   = useState(null);

  useEffect(() => {
    setHideNavbar(view !== 'overview');
    return () => setHideNavbar(false);
  }, [setHideNavbar, view]);

  useEffect(() => {
    try {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch (_) { window.scrollTo(0, 0); }
  }, [view]);

  // Fetch this day's progress + all-time XP
  useEffect(() => {
    let isMounted = true;
    const fetchProgress = async () => {
      if (!user) { setLoading(false); return; }
      try {
        // This day's missions
        const { data: dayData, error } = await supabase
          .from('mission_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('day', dayNumber);
        if (error) throw error;

        if (dayData && dayData.length > 0 && isMounted) {
          const completed = { m1: false, m2: false, m3: false };
          const loadedScores = { brain: 0, social: 0, creator: 0 };
          const meta = { m1: null, m2: null, m3: null };

          dayData.forEach(m => {
            if (m.mission === 1 && m.completed) { completed.m1 = true; loadedScores.brain = m.points || 0; meta.m1 = m.metadata; }
            if (m.mission === 2 && m.completed) { completed.m2 = true; loadedScores.social = m.points || 0; meta.m2 = m.metadata; }
            if (m.mission === 3 && m.completed) { completed.m3 = true; loadedScores.creator = m.points || 0; meta.m3 = m.metadata; }
          });

          setMissions(completed);
          setScores(loadedScores);
          setSavedMeta(meta);

          if (completed.m1 && completed.m2 && completed.m3) setView('done');
        }

        // All-time XP (all days)
        const { data: allData } = await supabase
          .from('mission_progress')
          .select('points')
          .eq('user_id', user.id)
          .eq('completed', true);

        if (allData && isMounted) {
          setAllTimeXP(allData.reduce((sum, r) => sum + (r.points || 0), 0));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProgress();
    return () => { isMounted = false; };
  }, [user, dayNumber]);

  const showXPToast = useCallback((pts, color) => {
    setXpToast({ pts, color });
    setTimeout(() => setXpToast(null), 2500);
  }, []);

  const completeMission = useCallback((mission, points, rewardData, metadata = {}) => {
    const pts = Object.values(points)[0];
    setMissions(prev => ({ ...prev, [mission]: true }));
    setScores(prev => ({ ...prev, ...points }));
    setAllTimeXP(prev => prev + pts);
    setSavedMeta(prev => ({ ...prev, [mission]: metadata }));
    showXPToast(pts, rewardData.color || themeColor);

    if (user) {
      supabase.from('mission_progress').upsert({
        user_id:      user.id,
        day:          dayNumber,
        mission:      parseInt(mission.replace('m', '')),
        completed:    true,
        points:       pts,
        metadata:     metadata,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,day,mission' });
    }

    setReward({ ...rewardData, onContinue: () => { setReward(null); setView('overview'); } });
  }, [user, dayNumber, themeColor, showXPToast]);

  const onM1Complete = useCallback(() =>
    completeMission('m1', { brain: 50 }, missionsConfig.m1.reward),
  [completeMission, missionsConfig]);

  const onM2Complete = useCallback((payload) =>
    completeMission('m2', { social: 50 }, missionsConfig.m2.reward,
      typeof payload === 'object' ? payload : {}),
  [completeMission, missionsConfig]);

  const onM3Complete = useCallback((urlOrMetadata) => {
    completeMission('m3', { creator: 50 }, missionsConfig.m3.reward,
      typeof urlOrMetadata === 'string' ? { image_url: urlOrMetadata } : (urlOrMetadata || {}));
    setTimeout(() => { setReward(null); setView('done'); }, 4000);
  }, [completeMission, missionsConfig]);

  const totalPts = scores.brain + scores.social + scores.creator;

  // ── Views ─────────────────────────────────────────────────────────────────
  if (view === 'm1') return <><M1Component onComplete={onM1Complete} />{reward && <RewardBanner {...reward} />}</>;
  if (view === 'm2') return <><M2Component onComplete={onM2Complete} />{reward && <RewardBanner {...reward} />}</>;
  if (view === 'm3') return <><M3Component onComplete={onM3Complete} />{reward && <RewardBanner {...reward} />}</>;
  if (view === 'done') return <ComeBackTomorrow scores={scores} completedDays={dayNumber} />;

  // ── Review views ──────────────────────────────────────────────────────────
  if (view === 'review_m2') return (
    <M2Component
      onComplete={() => {}}
      savedMeta={savedMeta.m2}
      onBack={() => setView('overview')}
    />
  );
  if (view === 'review_m1' || view === 'review_m3') {
    const which = view === 'review_m1' ? 'm1' : 'm3';
    const meta  = savedMeta[which];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
           style={{ background: `radial-gradient(100% 100% at 50% 0%, ${themeColor}20 0%, #050814 100%)` }}>
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">📊</div>
            <h2 className="font-heading text-4xl font-black text-white uppercase tracking-widest mb-2">Mission Summary</h2>
            <p className="text-secondary-text font-ui">You already completed this mission!</p>
          </div>
          <div className="space-y-4 mb-8">
            <div className="p-5 rounded-2xl border border-green-500/30 bg-green-500/10 text-center">
              <p className="text-5xl mb-2">✅</p>
              <p className="font-heading font-black text-2xl text-white">Mission Cleared!</p>
              <p className="text-green-400 font-black">+{which === 'm1' ? scores.brain : scores.creator} XP Earned</p>
            </div>
            {meta?.image_url && (
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <img src={meta.image_url} alt="Your upload" className="w-full object-cover max-h-64" />
              </div>
            )}
          </div>
          <button
            onClick={() => setView('overview')}
            className="w-full py-5 rounded-full font-heading font-black text-white text-xl tracking-widest uppercase hover:scale-[1.02] transition-all border border-white/20"
            style={{ background: `linear-gradient(135deg, ${themeColor}, #ec4899)` }}
          >
            ← BACK TO MISSIONS
          </button>
        </div>
      </div>
    );
  }

  const m1Status = missions.m1 ? 'completed' : 'available';
  const m2Status = missions.m1 ? (missions.m2 ? 'completed' : 'available') : 'locked';
  const m3Status = missions.m2 ? (missions.m3 ? 'completed' : 'available') : 'locked';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
             style={{ borderColor: themeColor, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden selection:bg-white/10">
      <div className="fixed inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse 100% 100% at 50% -20%, ${themeColor}20 0%, transparent 80%)` }} />
      <div className="fixed top-20 left-10 w-2 h-2 rounded-full bg-white opacity-20 animate-pulse pointer-events-none" />
      <div className="fixed top-40 right-20 w-3 h-3 rounded-full bg-white opacity-10 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-40 left-1/4 w-1.5 h-1.5 rounded-full opacity-30 animate-pulse pointer-events-none" style={{ backgroundColor: themeColor, animationDelay: '0.5s' }} />

      {/* XP Toast */}
      {xpToast && <XPToast pts={xpToast.pts} color={xpToast.color} />}
      {reward && <RewardBanner {...reward} />}

      <header className="sticky top-0 z-[100] border-b border-white/5 bg-background/80 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo.png" alt="Chizel" className="w-10 h-10 hover:scale-110 transition-transform" />
            <div className="hidden sm:block">
              <h1 className="font-heading font-black text-xl tracking-tight text-white leading-none">CHIZEL</h1>
              <span className="text-secondary-text text-[10px] font-black uppercase tracking-widest">Adventure Mode</span>
            </div>
          </div>
          <AvatarWidget user={user} totalPts={allTimeXP} onLogout={signOut} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mb-20">
        <section className="py-12 sm:py-20 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h1 className="font-heading text-6xl sm:text-8xl font-black text-white tracking-tight drop-shadow-2xl mb-4">
            DAY {dayNumber} <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${themeColor}, #ec4899)` }}>{title}</span>
          </h1>
          <p className="text-secondary-text text-lg sm:text-xl max-w-2xl mx-auto font-ui">{subtitle}</p>

          {/* Points breakdown */}
          {(scores.brain > 0 || scores.social > 0 || scores.creator > 0) && (
            <div className="mt-8 max-w-sm mx-auto p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-left">
              <p className="text-center text-xs font-black uppercase tracking-widest text-secondary-text mb-4">Today's Progress</p>
              <PointsBar label="Brain" value={scores.brain} color={themeColor} />
              <PointsBar label="Social" value={scores.social} color="#6366f1" />
              <PointsBar label="Creator" value={scores.creator} color="#10b981" />
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-white/50 text-xs font-black uppercase tracking-wider">Day Total</span>
                <span className="font-heading font-black text-yellow-400 text-lg">{totalPts} / 150 XP</span>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <MissionCard {...missionsConfig.m1} status={m1Status} onClick={() => setView('m1')} onReview={() => setView('review_m1')} delay={0} />
          <MissionCard {...missionsConfig.m2} status={m2Status} onClick={() => setView('m2')} onReview={() => setView('review_m2')} delay={1} />
          <MissionCard {...missionsConfig.m3} status={m3Status} onClick={() => setView('m3')} onReview={() => setView('review_m3')} delay={2} />
        </section>
      </main>
    </div>
  );
}
