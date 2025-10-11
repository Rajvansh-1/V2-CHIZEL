// src/components/layout/MainLayout.jsx
import { Outlet, useLocation } from "react-router-dom"; // Import useLocation
import CustomCursor from "@components/layout/CustomCursor";
import useLenisScroll from "@hooks/useLenisScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeedbackFloatingAlert from "@/components/features/feedback/FeedbackFloatingAlert";

const MainLayout = () => {
  // Call the hook directly. It manages its own effects.
  useLenisScroll();
  const location = useLocation();
  
  // Conditionally render the Navbar based on the route
  const showNavbar = location.pathname !== '/';

  return (
    <>
      <CustomCursor />
      {showNavbar && <Navbar />} {/* This is the corrected conditional rendering */}
      <main className="relative w-full min-h-screen bg-background">
        <Outlet />
      </main>
      <Footer />
      <FeedbackFloatingAlert />
    </>
  );
};


export default MainLayout;