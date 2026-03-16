// src/pages/auth/AuthCallbackPage.jsx
// Handles the OAuth redirect from Supabase Google login
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { onboardingDone } = useAuth();

  useEffect(() => {
    // Supabase automatically handles the token from the URL hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(onboardingDone ? '/day/1' : '/onboarding', { replace: true });
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
