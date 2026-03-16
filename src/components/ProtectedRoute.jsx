// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Wraps a route that requires authentication.
 * - Not logged in → redirect to home (landing page handles showing auth modal)
 * - Logged in but onboarding not done → redirect to /onboarding
 *   (unless we're already on /onboarding)
 */
const ProtectedRoute = ({ children, requiresOnboarding = true }) => {
  const { user, loading, onboardingDone } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ openAuth: true, from: location }} replace />;
  }

  const isOnboardingRoute = location.pathname === '/onboarding';
  if (requiresOnboarding && !onboardingDone && !isOnboardingRoute) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
