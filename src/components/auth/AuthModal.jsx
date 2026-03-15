// src/components/auth/AuthModal.jsx
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { FaGoogle, FaTimes, FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

const AuthModal = ({ isOpen, onClose }) => {
  const { user, onboardingDone } = useAuth();
  const navigate = useNavigate();
  const [tab,      setTab]      = useState('signin');   // 'signin' | 'signup'
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  // Auto-redirect after successful login
  useEffect(() => {
    if (user && isOpen) {
      onClose();
      navigate(onboardingDone ? '/day/1' : '/onboarding');
    }
  }, [user, isOpen, onboardingDone, onClose, navigate]);

  const reset = useCallback(() => {
    setEmail(''); setPassword(''); setName('');
    setError(''); setSuccess(''); setLoading(false); setShowPw(false);
  }, []);

  const switchTab = (t) => { setTab(t); reset(); };

  const handleEmail = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (tab === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { display_name: name } },
        });
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm, then sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // AuthContext will catch the session change and trigger re-render
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true); setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(15,22,45,0.97), rgba(11,18,38,0.99))',
          boxShadow: '0 0 80px rgba(31,111,235,0.2), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-secondary-text hover:text-text transition-all duration-200"
        >
          <FaTimes size="0.85em" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <img src="/images/logo.png" alt="Chizel" className="w-12 h-12 mx-auto mb-3 drop-shadow-[0_0_16px_rgba(31,111,235,0.7)]" />
            <h2 className="font-heading text-2xl font-bold text-text">
              {tab === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-secondary-text text-sm mt-1">
              {tab === 'signin' ? "Chizel your tomorrow, starting today." : "Start your Chizel journey for free."}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6 gap-1">
            {['signin', 'signup'].map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-2 text-sm font-ui font-medium rounded-lg transition-all duration-200 ${
                  tab === t
                    ? 'bg-primary text-white shadow-[0_0_16px_rgba(31,111,235,0.4)]'
                    : 'text-secondary-text hover:text-text'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-text font-medium transition-all duration-200 mb-4 group"
          >
            <FaGoogle className="text-red-400 group-hover:scale-110 transition-transform duration-200" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-secondary-text text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmail} className="space-y-3">
            {tab === 'signup' && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-white/5 border border-white/10 text-text placeholder-secondary-text text-sm focus:outline-none focus:border-primary/60 focus:bg-white/8 transition-all duration-200"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text text-sm">👤</span>
              </div>
            )}

            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-10 rounded-xl bg-white/5 border border-white/10 text-text placeholder-secondary-text text-sm focus:outline-none focus:border-primary/60 focus:bg-white/8 transition-all duration-200"
              />
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text text-sm" />
            </div>

            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 pl-10 pr-10 rounded-xl bg-white/5 border border-white/10 text-text placeholder-secondary-text text-sm focus:outline-none focus:border-primary/60 focus:bg-white/8 transition-all duration-200"
              />
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text text-sm" />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-text transition-colors"
              >
                {showPw ? <FaEyeSlash size="0.9em" /> : <FaEye size="0.9em" />}
              </button>
            </div>

            {error   && <p className="text-red-400 text-xs px-1">{error}</p>}
            {success && <p className="text-green-400 text-xs px-1">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #1f6feb, #7c4dff)',
                boxShadow: '0 0 24px rgba(31,111,235,0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  {tab === 'signup' ? 'Creating...' : 'Signing in...'}
                </span>
              ) : (
                tab === 'signup' ? 'Create Account 🚀' : 'Sign In →'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
