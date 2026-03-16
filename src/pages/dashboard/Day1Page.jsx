import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSound } from '@/hooks/useSound';
import { FaArrowRight, FaStar, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

import { Mission1 } from './day1/Mission1';
import { Mission2 } from './day1/Mission2';
import { Mission3 } from './day1/Mission3';
import { RewardBanner } from './day1/RewardBanner';
import { ShieldProgressBar, ComeBackTomorrow } from './day1/ComeBackTomorrow';

// ── User Avatar Widget ────────────────────────────────────────────────────────
const AvatarWidget = ({ user, totalPts, onLogout }) => {
  const [open, setOpen] = useState(false);
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Explorer';
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

// ── Rules Modal with Shield Teaser ──────────────────────────────────────────────
const RulesModal = ({ onAccept }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl">
    <div className="relative w-full max-w-lg rounded-[2.5rem] border border-primary/40 p-8 sm:p-10 overflow-hidden animate-in zoom-in-95" 
         style={{ background: 'linear-gradient(145deg, rgba(15,22,45,0.95), rgba(8,12,25,0.98))', boxShadow: '0 0 100px rgba(31,111,235,0.3)' }}>
      
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary uppercase tracking-widest text-xs font-bold mb-4 font-ui">
          Initialization
        </div>
        <h2 className="font-heading text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-pink-500 mb-2 uppercase tracking-tight">Mission Briefing</h2>
        <p className="text-secondary-text text-sm">Follow the rules to forge your shield!</p>
      </div>

      {/* Shield Teaser */}
      <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/10 flex flex-col items-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-4">You are building this:</p>
        <ShieldProgressBar completedDays={1} mini={true} />
        <p className="text-xs text-secondary-text mt-4 text-center">Complete today's missions to lock in Day 1 progress!</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          ['🎯', 'No Skipping'],
          ['🤝', 'Real Connection'],
          ['🎨', 'Real Effort'],
          ['🏆', 'Honor Code']
        ].map(([icon, label]) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 text-center">
            <span className="text-2xl">{icon}</span>
            <span className="text-white font-bold text-[11px] uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onAccept}
        className="w-full py-5 rounded-full font-heading font-black text-white text-xl tracking-widest uppercase transition-all hover:scale-[1.02] shadow-[0_15px_30px_rgba(31,111,235,0.4)]"
        style={{ background: 'linear-gradient(135deg, #1f6feb, #7c4dff)' }}
      >
        START JOURNEY 🚀
      </button>
    </div>
  </div>
);

// ── Gamified Mission Card ────────────────────────────────────────────────────────
const MissionCard = ({ icon, title, subtitle, points, status, color, onClick, delay }) => {
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
        border: `2px solid ${isAvailable ? color : 'rgba(255,255,255,0.05)'}`,
        boxShadow: isAvailable ? `0 10px 40px ${color}30 inset, 0 0 30px ${color}20` : 'none',
      }}
      onClick={() => {
        if (isLocked) {
          playError();
        } else if (onClick) {
          playClick();
          onClick();
        }
      }}
    >
      <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center">
        
        {/* Giant Game Icon */}
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
              {isCompleted ? 'CLEARED' : isAvailable ? 'ACTIVE' : 'LOCKED'}
            </span>
            <span className="text-sm font-ui font-black uppercase tracking-widest" style={{ color: isLocked ? '#666' : color }}>{points}</span>
          </div>
          <h3 className={`font-heading text-3xl font-black tracking-tight mb-2 ${isLocked ? 'text-white/40' : 'text-white'}`}>{title}</h3>
          <p className="text-secondary-text text-sm sm:text-base pr-0 sm:pr-8">{subtitle}</p>
        </div>

        <div className="flex-shrink-0 w-full sm:w-auto">
          <button
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3`}
            style={{
              background: isAvailable ? color : 'transparent',
              color: isAvailable ? '#fff' : isCompleted ? '#4ade80' : '#666',
              border: isCompleted ? '2px solid rgba(74,222,128,0.3)' : isLocked ? '2px solid rgba(255,255,255,0.1)' : 'none',
              boxShadow: isAvailable ? `0 10px 20px ${color}60` : 'none'
            }}
          >
            {isAvailable ? 'PLAY NOW' : isCompleted ? 'REVIEW' : 'RESTRICTED'}
            {isAvailable && <FaArrowRight className="text-lg group-hover:translate-x-2 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Day1 Page ────────────────────────────────────────────────────────────
export default function Day1Page() {
  const { user, signOut } = useAuth();
  const [showRules,   setShowRules]   = useState(() => !localStorage.getItem('chizel_rules_seen_vx'));
  const [view,        setView]        = useState('overview'); // 'overview' | 'm1' | 'm2' | 'm3' | 'done'
  const [reward,      setReward]      = useState(null);
  const [missions,    setMissions]    = useState({ m1: false, m2: false, m3: false });
  const [scores,      setScores]      = useState({ brain: 0, social: 0, creator: 0 });
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProgress = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const { data, error } = await supabase.from('mission_progress').select('*').eq('user_id', user.id).eq('day', 1);
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

          if (completed.m1 && completed.m2 && completed.m3) {
            setView('done');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProgress();
    return () => { isMounted = false; };
  }, [user]);

  const acceptRules = () => {
    localStorage.setItem('chizel_rules_seen_vx', '1');
    setShowRules(false);
  };

  const completeMission = useCallback((mission, points, rewardData, metadata = {}) => {
    setMissions(prev => ({ ...prev, [mission]: true }));
    setScores(prev => ({ ...prev, ...points }));
    
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

  const onM1Complete = useCallback(() => completeMission('m1', { brain: 50 }, {
    emoji: '🧠', title: 'Brain Power Unlocked!', points: '+50 Brain Points', color: '#3b82f6',
  }), [completeMission]);

  const onM2Complete = useCallback(() => completeMission('m2', { social: 50 }, {
    emoji: '🤝', title: 'Social Power Unlocked!', points: '+50 Social Points', color: '#7c4dff',
  }), [completeMission]);

  const onM3Complete = useCallback((imageUrl) => {
    completeMission('m3', { creator: 50 }, {
      emoji: '🎨', title: 'Creator Power Unlocked!', points: '+50 Creator Points', color: '#f59e0b',
    }, { image_url: imageUrl });
    
    // Auto-transition to done screen
    setTimeout(() => {
      setReward(null);
      setView('done');
    }, 4000); // give them plenty of time to enjoy the reward before cutting to tomorrow
  }, [completeMission]);

  if (view === 'm1') return <><Mission1 onComplete={onM1Complete} />{reward && <RewardBanner {...reward} />}</>;
  if (view === 'm2') return <><Mission2 onComplete={onM2Complete} />{reward && <RewardBanner {...reward} />}</>;
  if (view === 'm3') return <><Mission3 onComplete={onM3Complete} />{reward && <RewardBanner {...reward} />}</>;
  if (view === 'done') return <ComeBackTomorrow scores={scores} completedDays={1} />;

  const m1Status  = missions.m1 ? 'completed' : 'available';
  const m2Status  = missions.m1 ? (missions.m2 ? 'completed' : 'available') : 'locked';
  const m3Status  = missions.m2 ? (missions.m3 ? 'completed' : 'available') : 'locked';
  const totalPts  = scores.brain + scores.social + scores.creator;

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden selection:bg-primary/30">
      
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 100% 100% at 50% -20%, rgba(31,111,235,0.15) 0%, transparent 80%)' }} />
      {/* Background stars/particles */}
      <div className="fixed top-20 left-10 w-2 h-2 rounded-full bg-white opacity-20 animate-pulse pointer-events-none" />
      <div className="fixed top-40 right-20 w-3 h-3 rounded-full bg-white opacity-10 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-40 left-1/4 w-1.5 h-1.5 rounded-full bg-blue-500 opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }} />

      {showRules && <RulesModal onAccept={acceptRules} />}
      {reward    && <RewardBanner {...reward} />}

      {/* Modern Header */}
      <header className="sticky top-0 z-[100] border-b border-white/5 bg-background/80 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo.png" alt="Chizel" className="w-10 h-10 hover:scale-110 transition-transform" />
            <div className="hidden sm:block">
              <h1 className="font-heading font-black text-xl tracking-tight text-white leading-none">CHIZEL</h1>
              <span className="text-secondary-text text-[10px] font-black uppercase tracking-widest">Adventure Mode</span>
            </div>
          </div>
          <AvatarWidget user={user} totalPts={totalPts} onLogout={signOut} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mb-20">
        
        {/* Giant Hero Section */}
        <section className="py-12 sm:py-20 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h1 className="font-heading text-6xl sm:text-8xl font-black text-white tracking-tight drop-shadow-2xl mb-4">
            DAY 1 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">ADVENTURE</span> 🗺️
          </h1>
          <p className="text-secondary-text text-lg sm:text-xl max-w-2xl mx-auto font-ui">Complete today's 3 epic challenges to forge the very first piece of your Chizel Shield.</p>
        </section>

        {/* Level List */}
        <section className="space-y-6">
          <MissionCard
            icon="🧠"
            title="Brain Blaster"
            subtitle="Fire up your neurons with 5 lightning-fast logic challenges"
            points="+50 XP"
            status={m1Status}
            color="#3b82f6"
            onClick={() => setView('m1')}
            delay={0}
          />
          <MissionCard
            icon="🤝"
            title="Family Quest"
            subtitle="Discover an awesome secret from someone at home"
            points="+50 XP"
            status={m2Status}
            color="#7c4dff"
            onClick={() => setView('m2')}
            delay={1}
          />
          <MissionCard
            icon="🎨"
            title="Creator Studio"
            subtitle="Unleash your art skills and capture a masterpiece"
            points="+50 XP"
            status={m3Status}
            color="#f59e0b"
            onClick={() => setView('m3')}
            delay={2}
          />
        </section>

      </main>
    </div>
  );
}
