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
import ChizelverseIntroSection from "@/pages/home/sections/ChizelverseIntroSection";
import ChizelverseCardsSection from "@/pages/home/sections/ChizelverseCardsSection";
import ChizelverseOutroSection from "@/pages/home/sections/ChizelverseOutroSection";
import GsapAnimationSection from "@/pages/home/sections/GsapAnimationSection";
import OfferSection from "@/pages/home/sections/OfferSection";
import ChizelEcosystemSection from "@/pages/home/sections/ChizelEcosystemSection";
import ChizelWebSection from "@/pages/home/sections/ChizelWebSection";


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
      <ChizelverseIntroSection />
      <ChizelverseCardsSection />
      <ChizelverseOutroSection />
      
      {/* Supporting Sections */}
      <GsapAnimationSection />
      <OfferSection />
      <AboutSection />
      <ChizelEcosystemSection />
      <ChizelWebSection />
      <ChizelAppSection />
      <ContactSection />
      
      <Footer />
      <FeedbackFloatingAlert />
    </>
  );
};

export default HomePage;