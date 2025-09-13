// src/router/index.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@components/layout/MainLayout";
import { trackPageview } from "@/utils/analytics";

// Lazy load the page components
const HomePage = lazy(() => import("@/pages/home"));
const ChizelWebPage = lazy(() => import("@/pages/chizel-web"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
// v-- THIS IS THE CORRECTED LINE --v
const AboutUsPage = lazy(() => import("@/pages/AboutUs"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
       {
        index: true,
        element: (
          <Suspense fallback={<div style={{ height: '100vh' }}></div>}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "chizel-web",
        element: (
          <Suspense fallback={<div style={{ height: '100vh' }}></div>}>
            <ChizelWebPage />
          </Suspense>
        ),
      },
      {
        path: "privacy-policy",
        element: (
          <Suspense fallback={<div style={{ height: '100vh' }}></div>}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: "terms-of-service",
        element: (
          <Suspense fallback={<div style={{ height: '100vh' }}></div>}>
            <TermsOfService />
          </Suspense>
        ),
      },
      {
        path: "about-us", // This path stays the same
        element: (
          <Suspense fallback={<div style={{ height: '100vh' }}></div>}>
            <AboutUsPage />
          </Suspense>
        ),
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;