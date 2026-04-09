// src/pages/auth/AuthCallbackPage.jsx
// Handles Supabase auth redirects (e.g. email magic links / confirmation).
// NOTE: Google Sign-In no longer redirects here — it uses the frontend GIS flow
// (signInWithIdToken) so the Google popup shows chizel.in, not supabase.co.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, SUPABASE_CONFIGURED } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { onboardingDone } = useAuth();

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) {
      navigate('/', { replace: true });
      return;
    }

    // Supabase automatically handles the token from the URL hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(onboardingDone ? '/dashboard' : '/onboarding', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    });
  }, [navigate, onboardingDone]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <p className="text-secondary-text font-ui text-sm">Signing you in...</p>
    </div>
  );
};

export default AuthCallbackPage;
