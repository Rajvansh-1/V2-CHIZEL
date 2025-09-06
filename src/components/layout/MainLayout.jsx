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
    <>
      <CustomCursor />
      <Navbar />
      <main className="relative w-full min-h-screen bg-background">
        <Outlet />
      </main>
      <Footer />
      <FeedbackFloatingAlert />
    </>
  );
};

export default MainLayout;