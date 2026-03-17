// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, SUPABASE_CONFIGURED } from '@/lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,            setUser]            = useState(null);
  const [session,         setSession]         = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [onboardingDone,  setOnboardingDone]  = useState(false);

  // Fetch profile to check onboarding status
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('onboarding_done, display_name, avatar_type')
        .eq('user_id', userId)
        .single();
      
      if (data) {
        setOnboardingDone(!!data.onboarding_done);
        // Cache to localStorage for offline robustness
        localStorage.setItem(`chz_profile_${userId}`, JSON.stringify(data));
      }
    } catch {
      // Fallback to cache if network fails
      const cached = localStorage.getItem(`chz_profile_${userId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setOnboardingDone(!!parsed.onboarding_done);
          return;
        } catch (_) {}
      }
      // profile not created yet, or complete failure
      setOnboardingDone(false);
    }
  }, []);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) {
      setSession(null);
      setUser(null);
      setOnboardingDone(false);
      setLoading(false);
      return;
    }

    // Get initial session with an 8-second timeout fallback
    const fetchSession = supabase.auth.getSession();
    const timeout = new Promise((resolve) => setTimeout(() => resolve({ error: 'timeout' }), 8000));
    
    Promise.race([fetchSession, timeout]).then(async (result) => {
      let currentSession = null;
      
      if (result.error === 'timeout' || result.error) {
        // Fallback: try to pull standard supabase local session
        const localStr = localStorage.getItem(`sb-${new URL(import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co').hostname.split('.')[0]}-auth-token`);
        if (localStr) {
          try {
            const parsed = JSON.parse(localStr);
            currentSession = parsed;
          } catch (_) {}
        }
      } else {
        currentSession = result.data?.session;
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id).finally(() => setLoading(false));
        } else {
          setOnboardingDone(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    if (!SUPABASE_CONFIGURED) return;
    await supabase.auth.signOut();
    setOnboardingDone(false);
  }, []);

  const markOnboardingDone = useCallback(() => setOnboardingDone(true), []);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      onboardingDone,
      signOut,
      markOnboardingDone,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
