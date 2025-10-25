// src/components/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import CustomCursor from "@components/layout/CustomCursor";
import useLenisScroll from "@hooks/useLenisScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeedbackFloatingAlert from "@/components/features/feedback/FeedbackFloatingAlert";

const MainLayout = () => {
  useLenisScroll();

  return (
    // Use Flexbox: container takes full height, main content grows
    <div className="flex flex-col min-h-screen">
      <CustomCursor />
      <Navbar />
      <main className="relative w-full flex-grow bg-background">
        <Outlet /> {/* ProfessionalLandingPage renders here */}
      </main>
      <Footer /> {/* Footer is placed after the growing main content */}
      <FeedbackFloatingAlert />
    </div>
  );
};

export default MainLayout;