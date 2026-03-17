// src/components/layout/MainLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import CustomCursor from "@components/layout/CustomCursor";
import useLenisScroll from "@hooks/useLenisScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChiziAI from "@/components/common/ChiziAI";
import { useUI } from "@/context/UIContext";

const MainLayout = () => {
  // Initialize smooth scrolling
  useLenisScroll();
  const location = useLocation();
  const { hideNavbar } = useUI();

  const hideNavbarForRoute =
    location.pathname === '/onboarding' ||
    location.pathname === '/intro' ||
    location.pathname.startsWith('/day/');

  // Also hide footer on the same routes – game pages are full-screen
  const hideFooterForRoute = hideNavbarForRoute;

  return (
    // Flex container to manage vertical layout and ensure minimum screen height
    <div className="flex flex-col min-h-screen bg-background"> {/* Added bg-background here for safety */}
      <CustomCursor />
      {!(hideNavbar || hideNavbarForRoute) && <Navbar />}

      {/* Main content area that grows to fill space */}
      <main className="relative w-full flex-grow"> {/* flex-grow is key */}
        <Outlet /> {/* Renders the current route's component (e.g., ProfessionalLandingPage) */}
      </main>

      {/* Footer is placed last in the flex container */}
      {!hideFooterForRoute && <Footer />}

      {/* Floating elements remain fixed */}
      <ChiziAI />
    </div>
  );
};

export default MainLayout;