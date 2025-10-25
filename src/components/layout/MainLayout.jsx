// src/components/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import CustomCursor from "@components/layout/CustomCursor";
import useLenisScroll from "@hooks/useLenisScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeedbackFloatingAlert from "@/components/features/feedback/FeedbackFloatingAlert";

const MainLayout = () => {
  // Initialize smooth scrolling
  useLenisScroll();

  return (
    // Flex container to manage vertical layout and ensure minimum screen height
    <div className="flex flex-col min-h-screen bg-background"> {/* Added bg-background here for safety */}
      <CustomCursor />
      <Navbar />

      {/* Main content area that grows to fill space */}
      <main className="relative w-full flex-grow"> {/* flex-grow is key */}
        <Outlet /> {/* Renders the current route's component (e.g., ProfessionalLandingPage) */}
      </main>

      {/* Footer is placed last in the flex container */}
      <Footer />

      {/* Floating elements remain fixed */}
      <FeedbackFloatingAlert />
    </div>
  );
};

export default MainLayout;