// src/router/index.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@components/layout/MainLayout";
// import { trackPageview } from "@/utils/analytics"; // Can uncomment if needed

// Lazy load the page components
const ProfessionalLandingPage = lazy(() => import("@/pages/ProfessionalLandingPage")); // New Landing Page
const HomePage = lazy(() => import("@/pages/home")); // Original Home Page
const ChizelWebPage = lazy(() => import("@/pages/chizel-web"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const AboutUsPage = lazy(() => import("@/pages/AboutUs"));
const BrainrotCurePage = lazy(() => import("@/pages/BrainrotCurePage")); // <--- NEW IMPORT

// Helper for Suspense Fallback
const LoadingFallback = () => <div style={{ height: '100vh', background: 'var(--color-background)' }}></div>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
       {
        index: true, // Make ProfessionalLandingPage the default route
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProfessionalLandingPage />
          </Suspense>
        ),
      },
      {
        path: "chizel-core", // New path for the original HomePage
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "chizel-web",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ChizelWebPage />
          </Suspense>
        ),
      },
      {
        path: "privacy-policy",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: "terms-of-service",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TermsOfService />
          </Suspense>
        ),
      },
      {
        path: "about-us",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AboutUsPage />
          </Suspense>
        ),
      },
      {
        path: "brainrot-cure", // <--- NEW ROUTE DEFINITION
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BrainrotCurePage />
          </Suspense>
        ),
      },
    ],
  },
]);

const AppRouter = () => {
  // useEffect(() => { // Can uncomment if page tracking is needed
  //   const handleRouteChange = () => {
  //     trackPageview(window.location.pathname + window.location.search);
  //   };
  //   // Listen to history changes if using older react-router versions,
  //   // or integrate with router state changes in v6+ if needed more granularly.
  //   // For now, this basic setup might suffice or use a useEffect in MainLayout.
  //   handleRouteChange(); // Track initial page load
  // }, []);

  return <RouterProvider router={router} />;
};

export default AppRouter;