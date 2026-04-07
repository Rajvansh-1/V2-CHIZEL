import { useState, useRef, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { FaUpload, FaTimes, FaTree, FaStar, FaLeaf } from 'react-icons/fa';

// ── Confetti ──────────────────────────────────────────────────────────────────
const Confetti = ({ count = 60, colors = ['#1f6feb','#7c4dff','#f59e0b','#10b981','#ec4899','#f43f5e'] }) => (
  <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="absolute w-3 h-3 rounded-sm"
        style={{
          left: `${Math.random() * 100}%`,
          top: '-20px',
          background: colors[i % colors.length],
          animation: `confettiFall ${1.5 + Math.random() * 2}s ${Math.random() * 1.5}s ease-in forwards`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }}
      />
    ))}
    <style>{`@keyframes confettiFall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`}</style>
  </div>
);

// ── Shield Progress Bar ───────────────────────────────────────────────────────
export const ShieldProgressBar = ({ completedDays = 0, mini = false }) => {
  const ref       = useRef(null);
  const TOTAL_DAYS = 5;
  const pct        = mini ? 1 : Math.min(completedDays / TOTAL_DAYS, 1);
  const isComplete = completedDays >= TOTAL_DAYS;
  const clipTop    = Math.round((1 - pct) * 100);
  const clipPath   = pct === 0
    ? 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
    : `polygon(0% ${clipTop}%, 100% ${clipTop}%, 100% 100%, 0% 100%)`;

  useGSAP(() => {
    if (pct <= 0) {
      gsap.to(ref.current.querySelector('.shield-float'), { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo(
      ref.current.querySelector('.shield-reveal-layer'),
      { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
      { clipPath, duration: 2.2, ease: 'power3.out', delay: 0.4 }
    );
    tl.fromTo(
      ref.current.querySelector('.shield-glow'),
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'back.out(1.4)', delay: 0 },
      '-=1.8'
    );

    // Day 5 FULL UNLOCK sequence
    if (isComplete && !mini) {
      tl.to(ref.current.querySelector('.shield-reveal-layer'), {
        filter: 'drop-shadow(0 0 30px rgba(250, 204, 21, 0.9)) drop-shadow(0 0 60px rgba(251,146,60,0.6))',
        duration: 0.6, ease: 'power2.inOut'
      }, '+=0.2');
      tl.to(ref.current.querySelector('.shield-unlock-burst'), {
        opacity: 1, scale: 3, duration: 0.5, ease: 'power4.out'
      }, '-=0.3');
      tl.to(ref.current.querySelector('.shield-unlock-burst'), {
        opacity: 0, scale: 4, duration: 0.4, ease: 'power2.in'
      }, '+=0.1');
      tl.fromTo(ref.current.querySelector('.shield-complete-text'), {
        opacity: 0, y: 20, scale: 0.7
      }, {
        opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(2)'
      }, '-=0.2');
      // Ring burst
      tl.fromTo(
        ref.current.querySelectorAll('.unlock-ring'),
        { scale: 0, opacity: 0.8 },
        { scale: 3, opacity: 0, duration: 1.2, ease: 'power2.out', stagger: 0.2 },
        '-=0.6'
      );
    }

    gsap.to(ref.current.querySelector('.shield-float'), { y: -10, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }, { scope: ref, dependencies: [pct, isComplete, mini] });

  const shieldSize = mini ? 100 : 200;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="shield-float relative mb-4" style={{ width: shieldSize * 0.9, height: shieldSize }}>

        {/* Glow */}
        <div className="shield-glow absolute inset-0 rounded-full blur-[40px] opacity-0 pointer-events-none"
          style={{
            background: isComplete
              ? 'radial-gradient(ellipse, rgba(250,204,21,0.8), rgba(251,146,60,0.5), transparent 70%)'
              : 'radial-gradient(ellipse, rgba(124,77,255,0.7), rgba(31,111,235,0.4), transparent 70%)'
          }} />

        {/* Unlock rings (Day 5) */}
        {isComplete && !mini && ['#fcd34d', '#f97316', '#7c4dff'].map((c, i) => (
          <div key={i} className="unlock-ring absolute inset-0 rounded-full border-2 pointer-events-none opacity-0"
            style={{ borderColor: c, margin: '-20%', width: '140%', height: '140%' }} />
        ))}

        {/* White burst overlay */}
        {isComplete && !mini && (
          <div className="shield-unlock-burst absolute inset-0 rounded-full opacity-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.9), transparent 70%)', margin: '-40%', width: '180%', height: '180%' }} />
        )}

        {/* Dark base shield */}
        {!mini && (
          <img src="/images/shield.png" alt="Shield base"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ filter: 'grayscale(1) brightness(0.2)', userSelect: 'none', pointerEvents: 'none' }} />
        )}

        {/* Colored shield (filling up) */}
        <img src="/images/shield.png" alt="Shield revealed"
          className="shield-reveal-layer absolute inset-0 w-full h-full object-contain"
          style={{
            clipPath: pct > 0 ? clipPath : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            filter: isComplete
              ? 'drop-shadow(0 0 20px rgba(250,204,21,0.8)) saturate(1.5) brightness(1.2)'
              : 'drop-shadow(0 0 30px rgba(124,77,255,0.9))',
            userSelect: 'none', pointerEvents: 'none'
          }} />

        {/* Shimmer sweep */}
        {pct > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ clipPath }}>
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'shieldShimmer 2.5s ease-in-out infinite',
            }} />
          </div>
        )}
      </div>

      {/* Day dots — 5 days */}
      {!mini && (
        <div className="flex items-center gap-3 mb-4">
          {Array.from({ length: TOTAL_DAYS }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="rounded-full border-2 transition-all duration-700 ease-out" style={{
                width: i < completedDays ? 16 : 10,
                height: i < completedDays ? 16 : 10,
                background: i < completedDays
                  ? (isComplete ? 'linear-gradient(135deg, #fcd34d, #f97316)' : 'linear-gradient(135deg, #7c4dff, #1f6feb)')
                  : 'transparent',
                borderColor: i < completedDays
                  ? (isComplete ? '#fbbf24' : '#7c4dff')
                  : 'rgba(255,255,255,0.15)',
                boxShadow: i < completedDays
                  ? (isComplete ? '0 0 12px rgba(251,191,36,0.9)' : '0 0 10px rgba(124,77,255,0.8)')
                  : 'none',
                transform: i < completedDays ? 'scale(1)' : 'scale(0.8)',
              }} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{
                color: i < completedDays ? (isComplete ? '#fbbf24' : '#7c4dff') : 'rgba(255,255,255,0.2)'
              }}>D{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* SHIELD COMPLETE text */}
      {isComplete && !mini && (
        <div className="shield-complete-text opacity-0 text-center">
          <p className="font-heading font-black text-2xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
            🏆 SHIELD COMPLETE!
          </p>
        </div>
      )}

      <style>{`@keyframes shieldShimmer { 0%,100%{background-position:200% 0} 50%{background-position:-200% 0} }`}</style>
    </div>
  );
};

// ── Bonus Mission — Chizel Tree ───────────────────────────────────────────────
const BonusMission = ({ user }) => {
  const [phase, setPhase] = useState('reveal'); // reveal | instructions | upload | success
  const [preview, setPreview] = useState(null);
  const [treeName, setTreeName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const fileRef = useRef(null);
  const revealRef = useRef(null);

  // Check if already submitted
  useEffect(() => {
    if (!user) return;
    supabase.from('bonus_missions').select('id').eq('user_id', user.id).limit(1).then(({ data }) => {
      if (data && data.length > 0) setAlreadyDone(true);
    });
  }, [user]);

  // Animate reveal phase
  useGSAP(() => {
    if (phase !== 'reveal' || !revealRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo('.bonus-seed', { scale: 0.3, opacity: 0, rotation: -180 }, { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'back.out(2)' });
    tl.fromTo('.bonus-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' }, '-=0.4');
    tl.fromTo('.bonus-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
    tl.fromTo('.bonus-rings', { scale: 0, opacity: 0.6 }, { scale: 2.5, opacity: 0, duration: 1.5, ease: 'power2.out', stagger: 0.2 }, '-=0.8');
    tl.fromTo('.bonus-cta', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, '-=0.5');
    // Continuous pulse on seed
    gsap.to('.bonus-seed', { scale: 1.08, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.5 });
  }, { scope: revealRef, dependencies: [phase] });

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!user) { alert('Please login!'); return; }
    const file = fileRef.current?.files?.[0];
    if (!file) { alert('Please pick a photo first!'); return; }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/tree_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('mission_uploads')
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('mission_uploads').getPublicUrl(path);
      await supabase.from('bonus_missions').upsert({
        user_id:    user.id,
        tree_name:  treeName || 'My Chizel Tree',
        image_url:  data.publicUrl,
        planted_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      setPhase('success');
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (alreadyDone && phase !== 'success') {
    return (
      <div className="p-6 rounded-2xl border-2 border-green-500/40 bg-green-500/10 text-center">
        <p className="text-5xl mb-3">🌳</p>
        <p className="font-heading font-black text-2xl text-green-400 mb-1">Your Tree is in the Forest!</p>
        <p className="text-secondary-text font-ui text-sm">You've already planted your Chizel Tree. Amazing Explorer! 🏆</p>
      </div>
    );
  }

  if (phase === 'success') return (
    <div className="p-6 rounded-2xl border-2 border-green-500/40 bg-gradient-to-br from-green-500/20 to-emerald-600/10 text-center animate-in zoom-in-95 duration-500">
      <div className="text-[80px] mb-4 animate-bounce">🌳</div>
      <h2 className="font-heading font-black text-3xl text-white mb-2">Your Tree is Planted!</h2>
      <p className="text-green-400 font-ui mb-4">
        <strong>"{treeName || 'My Chizel Tree'}"</strong> is now officially in the Chizel Forest 🌍
      </p>
      <div className="p-4 rounded-xl bg-black/30 border border-green-500/20 text-sm text-white/60 font-ui">
        We'll feature your tree on our website soon. Thank you for making the world greener! 💚
      </div>
    </div>
  );

  if (phase === 'reveal') return (
    <div ref={revealRef} className="relative overflow-hidden rounded-[2rem] p-8 text-center"
      style={{ background: 'linear-gradient(145deg, rgba(34,197,94,0.25), rgba(5,46,22,0.8))', border: '2px solid rgba(34,197,94,0.5)', boxShadow: '0 0 60px rgba(34,197,94,0.2)' }}>

      {/* Animated rings */}
      {['#22c55e','#4ade80','#86efac'].map((c, i) => (
        <div key={i} className="bonus-rings absolute rounded-full border-2 pointer-events-none opacity-0"
          style={{ borderColor: c, inset: '-40%', width: '180%', height: '180%' }} />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="absolute w-2 h-2 rounded-full animate-pulse pointer-events-none"
          style={{
            background: '#4ade80',
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 20}%`,
            opacity: 0.4,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${2 + i * 0.2}s`
          }} />
      ))}

      <div className="relative z-10">
        <div className="bonus-seed text-[100px] leading-none mb-4 inline-block drop-shadow-2xl opacity-0">🌱</div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/40 mb-4">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-black uppercase tracking-widest">Bonus Mission Unlocked!</span>
        </div>
        <h2 className="bonus-title font-heading text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3 opacity-0">
          Plant a Chizel Tree 🌳
        </h2>
        <p className="bonus-subtitle text-white/60 font-ui text-lg mb-8 opacity-0">
          You completed all 5 days! Now do something real — plant a tree with someone you love and name it your <strong className="text-green-400">Chizel Tree</strong>. We'll feature it on our website! 🌍
        </p>
        <button
          onClick={() => setPhase('instructions')}
          className="bonus-cta w-full py-5 rounded-full font-heading font-black text-white text-xl tracking-widest uppercase opacity-0 relative overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 20px 40px rgba(34,197,94,0.4)' }}
        >
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10 flex items-center justify-center gap-3">
            <FaLeaf className="text-green-200" /> START THE MISSION <FaLeaf className="text-green-200" />
          </span>
        </button>
      </div>
    </div>
  );

  if (phase === 'instructions') return (
    <div className="rounded-[2rem] overflow-hidden animate-in slide-in-from-right-8 duration-400"
      style={{ background: 'linear-gradient(145deg, rgba(34,197,94,0.15), rgba(5,46,22,0.6))', border: '2px solid rgba(34,197,94,0.4)' }}>
      <div className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="text-[70px] leading-none mb-3">🪴</div>
          <h2 className="font-heading font-black text-3xl text-white mb-2">How to Plant</h2>
          <p className="text-secondary-text text-sm font-ui">Follow these steps with someone at home!</p>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { n: '1', emoji: '🏪', title: 'Get a sapling', desc: 'Visit a plant nursery or use a seed from home.' },
            { n: '2', emoji: '🌍', title: 'Find a spot', desc: 'Plant it in the ground or in a pot with soil.' },
            { n: '3', emoji: '🏷️', title: 'Name your tree', desc: 'Give it a name — like "Riya\'s Chizel Tree"!' },
            { n: '4', emoji: '📸', title: 'Take a photo!', desc: 'Stand next to it and snap a family photo.' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-black/30 border border-green-500/15 hover:border-green-500/30 transition-colors">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-black text-lg shrink-0"
                   style={{ background: 'rgba(34,197,94,0.2)', border: '2px solid rgba(34,197,94,0.4)', color: '#4ade80' }}>
                {s.n}
              </div>
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div>
                <p className="text-white font-black font-heading">{s.title}</p>
                <p className="text-white/50 text-sm font-ui">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPhase('upload')}
          className="w-full py-5 rounded-full font-heading font-black text-white text-xl tracking-widest uppercase relative overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 15px 30px rgba(34,197,94,0.35)' }}
        >
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">MY TREE IS READY! 📸</span>
        </button>
      </div>
    </div>
  );

  if (phase === 'upload') return (
    <div className="rounded-[2rem] overflow-hidden animate-in slide-in-from-right-8 duration-400"
      style={{ background: 'linear-gradient(145deg, rgba(34,197,94,0.15), rgba(5,46,22,0.6))', border: '2px solid rgba(34,197,94,0.4)' }}>
      <div className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="text-[60px] mb-2">📸</div>
          <h2 className="font-heading font-black text-3xl text-white mb-1">Upload Your Tree</h2>
          <p className="text-secondary-text text-sm font-ui">Take a photo next to your planted tree!</p>
        </div>

        {/* Photo upload */}
        <div
          onClick={() => { if (!preview) fileRef.current?.click(); }}
          className={`w-full bg-white p-4 pb-12 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -rotate-1 mb-6 transition-all relative ${!preview ? 'cursor-pointer hover:rotate-0 hover:scale-[1.01]' : ''}`}
        >
          <div className="w-full aspect-video bg-[#ececec] overflow-hidden relative flex flex-col items-center justify-center">
            {preview ? (
              <>
                <img src={preview} alt="Your tree" className="w-full h-full object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 border-2 border-white z-10"
                >
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-4xl mb-3 border-2 border-green-500/20 border-dashed">
                  <FaTree />
                </div>
                <p className="font-heading font-black text-lg text-gray-400 uppercase tracking-widest">Tap to Add Photo</p>
              </>
            )}
          </div>
          <p className="absolute bottom-4 left-0 right-0 text-center font-heading text-xl text-gray-500 opacity-50 transform rotate-1">My Chizel Tree!</p>
        </div>

        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

        {/* Tree name */}
        <input
          type="text"
          value={treeName}
          onChange={e => setTreeName(e.target.value)}
          placeholder="Name your tree (e.g. Riya's Chizel Tree)"
          className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-lg font-bold focus:outline-none focus:border-green-500/50 mb-6 transition-all"
        />

        <button
          onClick={handleUpload}
          disabled={!preview || uploading}
          className="w-full py-5 rounded-full font-heading font-black text-white text-xl tracking-widest uppercase disabled:opacity-30 relative overflow-hidden group transition-all hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 15px 30px rgba(34,197,94,0.4)' }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {uploading
              ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> UPLOADING...</>
              : <><FaLeaf /> PLANT MY TREE IN CHIZEL FOREST! 🌍</>
            }
          </span>
        </button>
      </div>
    </div>
  );

  return null;
};

// ── Real XP Counter ───────────────────────────────────────────────────────────
const AnimatedXP = ({ target }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(interval); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(interval);
  }, [target]);
  return <>{display}</>;
};

// ── ComeBackTomorrow ──────────────────────────────────────────────────────────
export const ComeBackTomorrow = ({ scores, completedDays }) => {
  const { user } = useAuth();
  const dayTotal  = Object.values(scores).reduce((a, b) => a + b, 0);
  const ref       = useRef(null);
  const isDay5    = completedDays === 5;
  const [realXP,  setRealXP]  = useState(dayTotal);
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [showBonus, setShowBonus] = useState(false);

  // Fetch all-time XP
  useEffect(() => {
    if (!user) return;
    supabase
      .from('mission_progress')
      .select('points')
      .eq('user_id', user.id)
      .eq('completed', true)
      .then(({ data }) => {
        if (data) setRealXP(data.reduce((s, r) => s + (r.points || 0), 0));
      });
  }, [user]);

  // Countdown to midnight
  useEffect(() => {
    const update = () => {
      const now  = new Date();
      const tmrw = new Date(now);
      tmrw.setHours(24, 0, 0, 0);
      const diff = tmrw - now;
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setTimeLeft(`${h}:${m}:${s}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Day 5: show bonus after shield anim completes
  useEffect(() => {
    if (isDay5) {
      const t = setTimeout(() => setShowBonus(true), 4000);
      return () => clearTimeout(t);
    }
  }, [isDay5]);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.cbt-card', { opacity: 0, scale: 0.85, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'elastic.out(1, 0.75)' });
    tl.fromTo('.cbt-el', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power3.out' }, '-=0.5');
    gsap.to('.cbt-lock-ring', { rotation: 360, duration: 25, repeat: -1, ease: 'linear' });
    gsap.to('.cbt-trophy', { rotationY: 360, duration: 4, repeat: -1, ease: 'linear' });
  }, { scope: ref });

  return (
    <div ref={ref} className="min-h-screen flex flex-col items-center justify-start px-4 py-10 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(124,77,255,0.15), transparent 60%), linear-gradient(180deg, #050814, #080c20)' }}>

      {(isDay5) && <Confetti count={100} />}

      {/* BG rings */}
      <div className="fixed inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="cbt-lock-ring absolute w-[500px] h-[500px] rounded-full border-[2px] border-dashed border-primary/20" />
        <div className="cbt-lock-ring absolute w-[700px] h-[700px] rounded-full border-[1px] border-dashed border-accent/10" style={{ animationDelay: '-6s' }} />
      </div>

      <div className="cbt-card w-full max-w-lg mt-4">

        {/* Day cleared badge */}
        <div className="cbt-el flex justify-center mb-6">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border-2"
            style={{
              borderColor: isDay5 ? 'rgba(250,204,21,0.5)' : 'rgba(16,185,129,0.4)',
              background:  isDay5 ? 'rgba(250,204,21,0.1)' : 'rgba(16,185,129,0.1)',
              boxShadow:   isDay5 ? '0 0 25px rgba(250,204,21,0.3)' : '0 0 20px rgba(16,185,129,0.3)'
            }}>
            <span className="w-3 h-3 rounded-full animate-pulse" style={{ background: isDay5 ? '#fbbf24' : '#4ade80', boxShadow: isDay5 ? '0 0 10px #fbbf24' : '0 0 10px #4ade80' }} />
            <span className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: isDay5 ? '#fbbf24' : '#4ade80' }}>
              {isDay5 ? '🏆 ALL 5 DAYS COMPLETE!' : `DAY ${completedDays} CLEARED! ✅`}
            </span>
          </div>
        </div>

        {/* Shield */}
        <div className="cbt-el flex justify-center mb-8 relative">
          <div className="absolute inset-0 blur-[80px] rounded-full mix-blend-screen pointer-events-none"
            style={{ background: isDay5 ? 'rgba(250,204,21,0.2)' : 'rgba(124,77,255,0.2)' }} />
          <ShieldProgressBar completedDays={completedDays} />
        </div>

        {/* Title */}
        <div className="cbt-el text-center mb-8">
          {isDay5 ? (
            <>
              <h1 className="font-heading text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 leading-tight tracking-tight mb-4 drop-shadow-xl">
                YOU DID IT! 🎉
              </h1>
              <p className="text-secondary-text text-lg sm:text-xl font-ui">Your shield is complete. You are an official <strong className="text-white">Chizel Explorer!</strong></p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-5xl sm:text-6xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-xl">
                See You Again In<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-pink-500">{timeLeft}</span>
              </h1>
              <p className="text-secondary-text text-lg font-ui">Your shield is forging. Tomorrow's mission unlocks at midnight! ☀️</p>
            </>
          )}
        </div>

        {/* XP Card */}
        <div className="cbt-el rounded-[2rem] border-2 border-white/10 p-6 mb-6 relative overflow-hidden group"
          style={{ background: 'linear-gradient(145deg, rgba(31,111,235,0.15), rgba(124,77,255,0.1))', backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="flex items-center gap-5 justify-center mb-5">
            <div className="text-5xl cbt-trophy drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">🏆</div>
            <div>
              <p className="text-secondary-text text-xs font-black uppercase tracking-widest mb-1">Total XP Earned</p>
              <p className="text-5xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-tight">
                <AnimatedXP target={realXP} /> PTS
              </p>
            </div>
          </div>

          {/* Per-category breakdown */}
          <div className="space-y-2.5 border-t border-white/10 pt-4">
            {[
              { label: '🧠 Brain', value: scores.brain, color: '#7c4dff' },
              { label: '💬 Social', value: scores.social, color: '#6366f1' },
              { label: '🎨 Creator', value: scores.creator, color: '#10b981' },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="text-secondary-text text-xs font-bold w-20 shrink-0">{c.label}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((c.value / 50) * 100, 100)}%`, background: c.color, boxShadow: `0 0 6px ${c.color}` }} />
                </div>
                <span className="text-white text-xs font-black w-8 text-right">{c.value}</span>
              </div>
            ))}
          </div>

          {/* All 5 days total bar */}
          <div className="mt-4 p-3 rounded-xl bg-black/30 border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-secondary-text text-xs font-black uppercase tracking-wider">Overall Journey</span>
              <span className="text-yellow-400 font-heading font-black"><AnimatedXP target={realXP} /> / 750 XP</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1500"
                style={{
                  width: `${Math.min((realXP / 750) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #7c4dff, #1f6feb, #10b981, #fbbf24)',
                  boxShadow: '0 0 10px rgba(124,77,255,0.5)'
                }} />
            </div>
          </div>
        </div>

        {/* Demo jump button (only for non-day5) */}
        {!isDay5 && (
          <div className="cbt-el text-center mt-4">
            <button
              onClick={() => { window.location.href = `/day/${completedDays + 1}`; }}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-ui font-bold transition-all text-sm uppercase tracking-widest shadow-lg"
            >
              [Demo] Jump To Day {completedDays + 1} ⏭️
            </button>
          </div>
        )}

        {/* Bonus Mission — Only Day 5, animated in */}
        {isDay5 && (
          <div
            className="cbt-el mt-6"
            style={{
              opacity: showBonus ? 1 : 0,
              transform: showBonus ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: showBonus ? 'auto' : 'none',
            }}
          >
            {showBonus && <BonusMission user={user} />}
          </div>
        )}

      </div>
    </div>
  );
};
