


// src/router/index.jsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@components/layout/MainLayout";
import Loader from "@components/ui/Loader";
import { trackPageview } from "@/utils/analytics";

// Lazy load the page components for faster initial load
const HomePage = lazy(() => import("@/pages/home"));
const ChizelWebPage = lazy(() => import("@/pages/chizel-web"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader setIsLoading={() => {}} />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "chizel-web",
        element: (
          <Suspense fallback={<Loader setIsLoading={() => {}} />}>
            <ChizelWebPage />
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