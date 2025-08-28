import { useState } from "react";
import Loader from "@components/ui/Loader";
import HeroSection from "@/pages/home/sections/HeroSection";
import AboutSection from "@/pages/home/sections/AboutSection";
import FeatureSection from "@/pages/home/sections/FeatureSection";
import GameSection from "@/pages/home/sections/GameSection";
import ChizelAppSection from "@/pages/home/sections/ChizelAppSection";
import ContactSection from "@/pages/home/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ChizelEcosystemSection from "@pages/home/sections/ChizelEcosystemSection";
import FeedbackFloatingAlert from "@/components/features/feedback/FeedbackFloatingAlert";

// Imports for all the new sections
import ProblemStatementSection from "@/pages/home/sections/ProblemStatementSection";
import SolutionSection from "@/pages/home/sections/SolutionSection";
import ChizelverseIntroSection from "@/pages/home/sections/ChizelverseIntroSection";
import ChizelverseCardsSection from "@/pages/home/sections/ChizelverseCardsSection";
import ChizelverseOutroSection from "@/pages/home/sections/ChizelverseOutroSection";
import GsapAnimationSection from "@/pages/home/sections/GsapAnimationSection";

const HomePage = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  if (isPageLoading) {
    return <Loader setIsLoading={setIsPageLoading} />;
  }

  return (
    <>
      <Navbar />
      
      {/* Main screen */}
      <HeroSection />
      
      {/* Problem Statement */}
      <ProblemStatementSection />
      
      {/* Solution Cards */}
      <SolutionSection />
      
      {/* Chizelverse Journey Start */}
      <ChizelverseIntroSection />
      <ChizelverseCardsSection />
      <ChizelverseOutroSection />
      <GsapAnimationSection />
      {/* Chizelverse Journey End */}

      {/* Original Sections */}
      <FeatureSection />
      <AboutSection />
      <GameSection />
      <ChizelEcosystemSection />
      <ChizelAppSection />
      <ContactSection />
      
      <Footer />
      <FeedbackFloatingAlert />
    </>
  );
};

export default HomePage;