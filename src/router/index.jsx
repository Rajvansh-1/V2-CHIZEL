import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { trackPageview } from "@/utils/analytics";

import MainLayout from "@components/layout/MainLayout";
import HomePage from "@/pages/home";
import ChizelWebPage from "@/pages/chizel-web";

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "chizel-web", element: <ChizelWebPage /> },
    ],
  },
]);

// Router wrapper with Google Analytics
const AppRouter = () => {
  useEffect(() => {
    // Subscribe to route changes
    const unsubscribe = router.subscribe(({ location }) => {
      trackPageview(location.pathname + location.search);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <RouterProvider router={router} />;
};

export default AppRouter;
