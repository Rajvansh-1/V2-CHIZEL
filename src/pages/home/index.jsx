// src/pages/home/index.jsx

import { useState } from "react";
import Loader from "@components/ui/Loader";
import HeroSection from "@/pages/home/sections/HeroSection";
import AboutSection from "@/pages/home/sections/AboutSection";
import ChizelAppSection from "@/pages/home/sections/ChizelAppSection";
import ContactSection from "@/pages/home/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FeedbackFloatingAlert from "@/components/features/feedback/FeedbackFloatingAlert";

// Import our new and refined sections
import ProblemStatementSection from "@/pages/home/sections/ProblemStatementSection";
import SolutionSection from "@/pages/home/sections/SolutionSection";
import NebulaSection from "@/pages/home/sections/NebulaSection"; // Our new cinematic journey
import ParentsNebulaSection from "@/pages/home/sections/ParentsNebulaSection";


const HomePage = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  if (isPageLoading) {
    return <Loader setIsLoading={setIsPageLoading} />;
  }

  return (
    <>
      <Navbar />
      
      {/* The Story Begins */}
      <HeroSection />
      <ProblemStatementSection />
      <SolutionSection />
      
      {/* The Cinematic Core Experience */}
      <NebulaSection />
      
      {/* Supporting Sections */}
      <ParentsNebulaSection />
      <AboutSection />
      <ChizelAppSection />
      <ContactSection />
      
      <Footer />
      <FeedbackFloatingAlert />
    </>
  );
};

export default HomePage;