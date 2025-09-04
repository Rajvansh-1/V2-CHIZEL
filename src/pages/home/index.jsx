// src/pages/home/index.jsx

import { useState, lazy, Suspense } from "react";
import Loader from "@components/ui/Loader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeedbackFloatingAlert from "@/components/features/feedback/FeedbackFloatingAlert";

// Lazy load all the section components
const HeroSection = lazy(() => import("@/pages/home/sections/HeroSection"));
const AboutSection = lazy(() => import("@/pages/home/sections/AboutSection"));
const ChizelAppSection = lazy(() => import("@/pages/home/sections/ChizelAppSection"));
const ContactSection = lazy(() => import("@/pages/home/sections/ContactSection"));
const ProblemStatementSection = lazy(() => import("@/pages/home/sections/ProblemStatementSection"));
const SolutionSection = lazy(() => import("@/pages/home/sections/SolutionSection"));
const ChizelverseIntroSection = lazy(() => import("@/pages/home/sections/ChizelverseIntroSection"));
const ChizelverseCardsSection = lazy(() => import("@/pages/home/sections/ChizelverseCardsSection"));
const ChizelverseOutroSection = lazy(() => import("@/pages/home/sections/ChizelverseOutroSection"));
const GsapAnimationSection = lazy(() => import("@/pages/home/sections/GsapAnimationSection"));
const ChizelEcosystemSection = lazy(() => import("@/pages/home/sections/ChizelEcosystemSection"));

const HomePage = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  if (isPageLoading) {
    return <Loader setIsLoading={setIsPageLoading} />;
  }

  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ height: '100vh' }}></div>}>
        <HeroSection />
        <ProblemStatementSection />
        <SolutionSection />
        <ChizelverseIntroSection />
        <ChizelverseCardsSection />
        <ChizelverseOutroSection />
        <GsapAnimationSection />
        <AboutSection />
        <ChizelEcosystemSection />
        <ChizelAppSection />
        <ContactSection />
      </Suspense>
      <Footer />
      <FeedbackFloatingAlert />
    </>
  );
};

export default HomePage;