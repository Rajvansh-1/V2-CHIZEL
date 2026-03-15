// src/router/index.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@components/layout/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy load page components
const ProfessionalLandingPage = lazy(() => import("@/pages/ProfessionalLandingPage"));
const HomePage                 = lazy(() => import("@/pages/home"));
const ChizelWebPage            = lazy(() => import("@/pages/chizel-web"));
const PrivacyPolicy            = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService           = lazy(() => import("@/pages/TermsOfService"));
const AboutUsPage              = lazy(() => import("@/pages/AboutUs"));
const BrainrotCurePage         = lazy(() => import("@/pages/BrainrotCurePage"));
const AuthCallbackPage         = lazy(() => import("@/pages/auth/AuthCallbackPage"));
const OnboardingPage           = lazy(() => import("@/pages/onboarding/OnboardingPage"));
const IntroVideoPage           = lazy(() => import("@/pages/dashboard/IntroVideoPage"));
const Day1Page                 = lazy(() => import("@/pages/dashboard/Day1Page"));

// Loading fallback — keeps bg color consistent, no flash
const LoadingFallback = () => (
  <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(31,111,235,0.3)', borderTopColor: '#1f6feb', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // ── Public routes ─────────────────────────────────────────
      { index: true,           element: withSuspense(ProfessionalLandingPage) },
      { path: "chizel-core",   element: withSuspense(HomePage) },
      { path: "chizel-web",    element: withSuspense(ChizelWebPage) },
      { path: "privacy-policy",element: withSuspense(PrivacyPolicy) },
      { path: "terms-of-service", element: withSuspense(TermsOfService) },
      { path: "about-us",      element: withSuspense(AboutUsPage) },
      { path: "brainrot-cure", element: withSuspense(BrainrotCurePage) },

      // ── OAuth callback (public but short-lived) ───────────────
      { path: "auth/callback", element: withSuspense(AuthCallbackPage) },

      // ── Protected: auth required ──────────────────────────────
      {
        path: "onboarding",
        element: (
          <ProtectedRoute requiresOnboarding={false}>
            <Suspense fallback={<LoadingFallback />}>
              <OnboardingPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "intro",
        element: (
          <ProtectedRoute requiresOnboarding={true}>
            <Suspense fallback={<LoadingFallback />}>
              <IntroVideoPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "day/1",
        element: (
          <ProtectedRoute requiresOnboarding={true}>
            <Suspense fallback={<LoadingFallback />}>
              <Day1Page />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;