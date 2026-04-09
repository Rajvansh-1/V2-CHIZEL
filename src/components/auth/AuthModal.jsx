// src/components/auth/AuthModal.jsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, SUPABASE_CONFIGURED, getSupabaseConfigErrorMessage } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

/* ─── Detect mobile once at module load ─────────────────────────────────── */
const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(
  typeof navigator !== 'undefined' ? navigator.userAgent : ''
);

/* ─── SHA-256 nonce pair ─────────────────────────────────────────────────── */
async function makeNonce() {
  const raw = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hashed = Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  return { raw, hashed };
}

/* ─── Official Google G SVG ──────────────────────────────────────────────── */
const GoogleG = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ─── Mini spinner ───────────────────────────────────────────────────────── */
const Spinner = ({ size = 17, color = '#fff' }) => (
  <span style={{
    display: 'inline-block', width: size, height: size, borderRadius: '50%',
    border: `2.5px solid ${color}40`, borderTopColor: color,
    animation: 'chzl-spin 0.65s linear infinite', flexShrink: 0,
  }} />
);

/* ─── Shared input style ─────────────────────────────────────────────────── */
const INPUT = {
  width: '100%', boxSizing: 'border-box',
  padding: '13px 14px 13px 42px', borderRadius: 12,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.09)',
  color: '#fff', fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
  fontFamily: 'inherit',
  // Prevent iOS zoom on focus (requires font-size >= 16px to avoid, but we keep 0.9rem
  // and instead set touchAction so it doesn't feel janky)
  WebkitAppearance: 'none',
};

/* ══════════════════════════════════════════════════════════════════════════ */
const AuthModal = ({ isOpen, onClose }) => {
  const { user, onboardingDone } = useAuth();
  const navigate = useNavigate();

  const [tab,      setTab]      = useState('signin');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);  // email/pw spinner
  const [gLoad,    setGLoad]    = useState(false);   // Google spinner
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [visible,  setVisible]  = useState(false);   // spring trigger

  const nonceRawRef = useRef('');
  const gisReadyRef  = useRef(false);
  const gLoadRef     = useRef(false);  // mirror of gLoad without stale closure

  /* ── Spring entrance / exit ───────────────────────────────────────────── */
  useEffect(() => {
    if (isOpen) {
      // double-rAF gives CSS transition a "from" frame
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      gisReadyRef.current = false; // force fresh pre-warm on next open
    }
  }, [isOpen]);

  /* ── Navigate after auth ─────────────────────────────────────────────── */
  useEffect(() => {
    if (user && isOpen) {
      onClose();
      navigate(onboardingDone ? '/day/1' : '/onboarding');
    }
  }, [user, isOpen, onboardingDone, onClose, navigate]);

  /* ── Keep gLoadRef in sync ───────────────────────────────────────────── */
  useEffect(() => { gLoadRef.current = gLoad; }, [gLoad]);

  /* ── Mobile safety net: visibilitychange + 90s timeout ──────────────── */
  /*
   * On mobile, Google may open a new tab for sign-in. When that tab closes
   * and the user returns, window.opener.postMessage often fails (iOS/Android
   * security), so the GIS callback never fires → gLoad stuck forever.
   *
   * Fix: listen for the tab becoming visible again. If gLoad is true, poll
   * Supabase directly — if a session exists the user signed in successfully.
   * A 90s timeout acts as a final safety net so the spinner never freezes.
   */
  useEffect(() => {
    if (!isOpen) return;

    const onVisible = async () => {
      if (document.visibilityState !== 'visible' || !gLoadRef.current) return;
      // Give the session a moment to propagate
      await new Promise(r => setTimeout(r, 600));
      if (!gLoadRef.current) return; // already resolved
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Sign-in succeeded in the other tab — AuthContext will pick it up
        setGLoad(false);
      } else {
        // User came back without signing in (cancelled)
        setGLoad(false);
        setError('Google Sign-In was cancelled or timed out. Please try again.');
      }
    };

    document.addEventListener('visibilitychange', onVisible);

    // 90-second hard timeout — user is never permanently stuck
    const timer = setTimeout(() => {
      if (gLoadRef.current) {
        setGLoad(false);
        setError('Google Sign-In timed out. Please try again.');
      }
    }, 90_000);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      clearTimeout(timer);
    };
  }, [isOpen, gLoad]); // re-register when gLoad flips so we always have latest state

  /* ── Pre-warm GIS + pre-render button when modal opens ──────────────── */
  /*
   * WHY: On iOS Safari, popups must be triggered synchronously inside a
   * user-gesture handler. If we do any async work (nonce, initialize) INSIDE
   * the click handler, iOS blocks the popup. Solution: do ALL async prep HERE
   * (at modal-open time), so the click handler is 100% synchronous.
   */
  useEffect(() => {
    if (!isOpen || !SUPABASE_CONFIGURED) return;
    let cancelled = false;

    const setup = async () => {
      const { raw, hashed } = await makeNonce();
      if (cancelled) return;

      nonceRawRef.current = raw;

      const trySetup = () => {
        if (!window.google?.accounts?.id) return false;

        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          nonce: hashed,            // GIS embeds hashedNonce in the id_token
          callback: async ({ credential }) => {
            try {
              const { error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: credential,
                nonce: nonceRawRef.current,  // Supabase hashes this to verify
              });
              if (error) throw error;
              // AuthContext.onAuthStateChange → redirect handled by above useEffect
            } catch (err) {
              setError(err.message);
              setGLoad(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Pre-render the real Google button. Doing this NOW (not on click)
        // means the DOM element exists and .click() is synchronous — iOS allows it.
        const el = document.getElementById('gsi-hidden');
        if (el) {
          el.innerHTML = '';
          window.google.accounts.id.renderButton(el, {
            type: 'standard', theme: 'filled_black', size: 'large', width: 400,
          });
        }

        gisReadyRef.current = true;
        return true;
      };

      if (!trySetup()) {
        // Script still loading — poll every 100ms (max 6s)
        const iv = setInterval(() => {
          if (cancelled || trySetup()) clearInterval(iv);
        }, 100);
        setTimeout(() => clearInterval(iv), 6000);
      }
    };

    setup();
    return () => { cancelled = true; };
  }, [isOpen]);

  /* ── Reset helpers ───────────────────────────────────────────────────── */
  const reset = useCallback(() => {
    setEmail(''); setPassword(''); setName('');
    setError(''); setSuccess(''); setLoading(false); setShowPw(false);
  }, []);
  const switchTab = t => { setTab(t); reset(); };

  /* ── Google click — fully synchronous on the hot path ───────────────── */
  const handleGoogle = useCallback(() => {
    if (!SUPABASE_CONFIGURED) { setError(getSupabaseConfigErrorMessage()); return; }
    if (!window.google?.accounts?.id) {
      setError('Google Sign-In is loading — please try again in a moment.');
      return;
    }

    setGLoad(true);
    setError('');

    // Synchronously click the pre-rendered hidden button.
    // This is the ONLY way to reliably open a popup on iOS Safari.
    const clickHidden = () => {
      const btn = document.querySelector('#gsi-hidden div[role=button]');
      if (btn) { btn.click(); return true; }
      return false;
    };

    if (IS_MOBILE) {
      // Mobile: skip One Tap (suppressed by iOS ITP) → straight to button click
      if (!clickHidden()) {
        setError('Still loading Google Sign-In — please try again in a moment.');
        setGLoad(false);
      }
      return;
    }

    // Desktop: One Tap overlay (nicer for already-signed-in users)
    // Falls back to hidden button if suppressed
    window.google.accounts.id.prompt(n => {
      if (n.isDismissedMoment())                      setGLoad(false);
      if (n.isNotDisplayed() || n.isSkippedMoment()) {
        if (!clickHidden()) {
          setError('Popup blocked. Allow popups for this site and try again.');
          setGLoad(false);
        }
      }
    });
  }, []);

  /* ── Email / password submit ─────────────────────────────────────────── */
  const handleEmail = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (!SUPABASE_CONFIGURED) throw new Error(getSupabaseConfigErrorMessage());
      if (tab === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password, options: { data: { display_name: name } },
        });
        if (error) throw error;
        setSuccess('Check your email to confirm, then sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onFocus = e => {
    e.target.style.borderColor = 'rgba(31,111,235,0.65)';
    e.target.style.background  = 'rgba(255,255,255,0.08)';
  };
  const onBlur = e => {
    e.target.style.borderColor = 'rgba(255,255,255,0.09)';
    e.target.style.background  = 'rgba(255,255,255,0.05)';
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes chzl-spin    { to { transform: rotate(360deg); } }
        @keyframes chzl-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes chzl-pulse   { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.12)} }
        @keyframes chzl-blob    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(22px,-14px) scale(1.08)} }
        @keyframes chzl-slideup { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        /* Prevent iOS input zoom */
        #chzl-auth-modal input { font-size: 16px !important; }
      `}</style>

      {/* Backdrop */}
      <div
        id="chzl-auth-modal"
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
          background: 'rgba(4,8,24,0.84)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.22s ease',
        }}
      >
        {/* Ambient glow blobs */}
        <div aria-hidden style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'15%', left:'25%', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle, rgba(31,111,235,0.13) 0%, transparent 65%)', animation:'chzl-blob 10s ease-in-out infinite' }} />
          <div style={{ position:'absolute', bottom:'10%', right:'20%', width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,77,255,0.10) 0%, transparent 65%)', animation:'chzl-blob 7s ease-in-out infinite alternate-reverse' }} />
        </div>

        {/* Modal card */}
        <div style={{
          position: 'relative', width: '100%', maxWidth: 420, borderRadius: 28,
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'linear-gradient(155deg, rgba(14,21,52,0.98) 0%, rgba(8,13,34,0.99) 100%)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.55), 0 0 140px rgba(31,111,235,0.10)',
          overflow: 'hidden',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(18px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.38s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
        }}>

          {/* Animated rainbow top bar */}
          <div style={{ height:3, background:'linear-gradient(90deg, #1f6feb, #7c4dff, #06b6d4, #1f6feb)', backgroundSize:'300% auto', animation:'chzl-shimmer 3.5s linear infinite' }} />

          {/* Close button */}
          <button
            onClick={onClose} aria-label="Close sign in dialog"
            style={{ position:'absolute', top:14, right:14, zIndex:10, width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.45)', cursor:'pointer', transition:'all 0.2s ease' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.12)'; e.currentTarget.style.color='#fff'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='rgba(255,255,255,0.45)'; }}
          ><FaTimes size="0.75em" /></button>

          <div style={{ padding:'30px 28px 28px' }}>

            {/* Header */}
            <div style={{ textAlign:'center', marginBottom:24 }}>
              <div style={{ position:'relative', display:'inline-block', marginBottom:14 }}>
                <div aria-hidden style={{ position:'absolute', inset:-10, borderRadius:'50%', background:'radial-gradient(circle, rgba(31,111,235,0.45) 0%, transparent 70%)', animation:'chzl-pulse 2.8s ease-in-out infinite' }} />
                <img src="/images/logo.png" alt="Chizel" style={{ width:56, height:56, position:'relative', borderRadius:'50%', display:'block' }} />
              </div>
              <h2 style={{ margin:'0 0 5px', fontSize:'1.5rem', fontWeight:800, color:'#fff', letterSpacing:'-0.025em', fontFamily:'inherit' }}>
                {tab === 'signin' ? 'Welcome back 👋' : 'Join Chizel 🚀'}
              </h2>
              <p style={{ margin:0, fontSize:'0.82rem', color:'rgba(255,255,255,0.42)' }}>
                {tab === 'signin' ? 'Chizel your tomorrow, starting today.' : 'Your skill journey starts here — free.'}
              </p>
            </div>

            {/* ── Google button (hero) ── */}
            <button
              id="google-signin-btn"
              onClick={handleGoogle}
              disabled={gLoad}
              aria-label="Continue with Google"
              style={{
                width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:12,
                padding: IS_MOBILE ? '16px 20px' : '14px 20px',
                borderRadius:16, marginBottom:20,
                cursor: gLoad ? 'default' : 'pointer',
                background: gLoad ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)',
                border:'1px solid rgba(255,255,255,0.13)',
                color:'#fff', fontSize:'1rem', fontWeight:600,
                transition:'all 0.2s ease', fontFamily:'inherit',
                WebkitTapHighlightColor: 'transparent',
              }}
              onMouseEnter={e=>{ if(!gLoad){e.currentTarget.style.background='rgba(255,255,255,0.12)';e.currentTarget.style.borderColor='rgba(255,255,255,0.22)';e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.28)';}}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.borderColor='rgba(255,255,255,0.13)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}
              onMouseDown={e=>{if(!gLoad)e.currentTarget.style.transform='scale(0.98)';}}
              onMouseUp={e=>{if(!gLoad)e.currentTarget.style.transform='translateY(-1px)';}}
            >
              {gLoad
                ? <><Spinner size={IS_MOBILE ? 20 : 17}/><span>Signing you in…</span></>
                : <><GoogleG size={IS_MOBILE ? 22 : 20}/><span>Continue with Google</span></>
              }
            </button>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize:'0.72rem', fontWeight:500, color:'rgba(255,255,255,0.28)', letterSpacing:'0.05em', textTransform:'uppercase' }}>or email</span>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Tab toggle */}
            <div style={{ display:'flex', background:'rgba(255,255,255,0.04)', borderRadius:12, padding:4, gap:4, marginBottom:14 }}>
              {['signin','signup'].map(t => (
                <button key={t} onClick={()=>switchTab(t)} style={{
                  flex:1, padding: IS_MOBILE ? '10px 0' : '8px 0',
                  borderRadius:9, border:'none',
                  fontSize:'0.83rem', fontWeight:600, cursor:'pointer',
                  transition:'all 0.22s ease', fontFamily:'inherit',
                  background: tab===t ? 'linear-gradient(135deg, #1f6feb, #7c4dff)' : 'transparent',
                  color: tab===t ? '#fff' : 'rgba(255,255,255,0.38)',
                  boxShadow: tab===t ? '0 2px 18px rgba(31,111,235,0.38)' : 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}>{t==='signin' ? 'Sign In' : 'Sign Up'}</button>
              ))}
            </div>

            {/* Email / password form */}
            <form onSubmit={handleEmail} style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {tab === 'signup' && (
                <div style={{ position:'relative', animation:'chzl-slideup 0.2s ease' }}>
                  <span aria-hidden style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:'0.9rem' }}>👤</span>
                  <input type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required style={INPUT} onFocus={onFocus} onBlur={onBlur} autoComplete="name" />
                </div>
              )}

              <div style={{ position:'relative' }}>
                <span aria-hidden style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', fontSize:'0.85rem' }}>✉</span>
                <input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required style={INPUT} onFocus={onFocus} onBlur={onBlur} autoComplete="email" inputMode="email" />
              </div>

              <div style={{ position:'relative' }}>
                <span aria-hidden style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', fontSize:'0.85rem' }}>🔒</span>
                <input type={showPw?'text':'password'} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} style={{...INPUT, paddingRight:46}} onFocus={onFocus} onBlur={onBlur} autoComplete={tab==='signup'?'new-password':'current-password'} />
                <button type="button" onClick={()=>setShowPw(p=>!p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.32)', cursor:'pointer', padding:6, lineHeight:0, transition:'color 0.15s', WebkitTapHighlightColor:'transparent' }}
                  onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.32)'}
                >{showPw ? <FaEyeSlash size="0.9em"/> : <FaEye size="0.9em"/>}</button>
              </div>

              {error   && <p style={{ margin:'0 0 0 2px', color:'#f87171', fontSize:'0.78rem', animation:'chzl-slideup 0.18s ease' }}>{error}</p>}
              {success && <p style={{ margin:'0 0 0 2px', color:'#4ade80', fontSize:'0.78rem', animation:'chzl-slideup 0.18s ease' }}>{success}</p>}

              <button type="submit" disabled={loading} style={{
                width:'100%', padding: IS_MOBILE ? '15px' : '13px',
                borderRadius:14, border:'none', marginTop:2,
                fontWeight:700, fontSize:'0.92rem', color:'#fff', fontFamily:'inherit',
                cursor: loading?'default':'pointer', opacity: loading?0.72:1,
                background:'linear-gradient(135deg, #1f6feb 0%, #7c4dff 100%)',
                boxShadow:'0 4px 28px rgba(31,111,235,0.38)', transition:'all 0.2s ease',
                WebkitTapHighlightColor: 'transparent',
              }}
                onMouseEnter={e=>{if(!loading){e.currentTarget.style.boxShadow='0 6px 36px rgba(31,111,235,0.55)';e.currentTarget.style.transform='translateY(-1px)';}}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 4px 28px rgba(31,111,235,0.38)';e.currentTarget.style.transform='translateY(0)';}}
                onMouseDown={e=>{if(!loading)e.currentTarget.style.transform='scale(0.985)';}}
                onMouseUp={e=>{if(!loading)e.currentTarget.style.transform='translateY(-1px)';}}
              >
                {loading
                  ? <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><Spinner size={15}/>{tab==='signup'?'Creating…':'Signing in…'}</span>
                  : tab==='signup' ? 'Create Account 🚀' : 'Sign In →'
                }
              </button>
            </form>
          </div>

          {/*
            Hidden GIS button container.
            - Pre-rendered at modal-open time (not on click) so it exists synchronously.
            - 1×1px with overflow hidden: invisible but real DOM node.
            - pointer-events:none stops accidental taps; JS .click() still works.
            - This is the key to iOS Safari popup permission.
          */}
          <div
            id="gsi-hidden"
            aria-hidden="true"
            style={{ position:'absolute', bottom:0, left:0, width:'1px', height:'1px', overflow:'hidden', opacity:0, pointerEvents:'none' }}
          />
        </div>
      </div>
    </>
  );
};

export default AuthModal;
