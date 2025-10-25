// src/pages/home/index.jsx

import { lazy, Suspense, useEffect } from "react"; // Import useEffect
import { useLocation } from 'react-router-dom'; // Import useLocation

// Lazy load all the section components (keep existing imports)
const HeroSection = lazy(() => import("@/pages/home/sections/HeroSection"));
const AboutSection = lazy(() => import("@/pages/home/sections/AboutSection"));
const ChizelAppSection = lazy(() => import("@/pages/home/sections/ChizelAppSection"));
const ContactSection = lazy(() => import("@/pages/home/sections/ContactSection"));
const ProblemStatementSection = lazy(() => import("@/pages/home/sections/ProblemStatementSection"));
const SolutionSection = lazy(() => import("@/pages/home/sections/SolutionSection"));
const ChizelverseCardsSection = lazy(() => import("@/pages/home/sections/ChizelverseCardsSection"));
const ChizelverseOutroSection = lazy(() => import("@/pages/home/sections/ChizelverseOutroSection"));
const GsapAnimationSection = lazy(() => import("@/pages/home/sections/GsapAnimationSection"));
const ChizelEcosystemSection = lazy(() => import("@/pages/home/sections/ChizelEcosystemSection"));

const HomePage = () => {
  const location = useLocation();

  // Add this useEffect hook
  useEffect(() => {
    // Scroll to the top whenever the route is '/chizel-core'
    if (location.pathname === '/chizel-core') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]); // Dependency ensures this runs when the pathname changes

  return (
    <>
      <Suspense fallback={<div style={{ height: '100vh' }}></div>}>
        <HeroSection /> {/* This will be at the top */}
        <ProblemStatementSection />
        {/* <SolutionSection /> */}
        <ChizelverseCardsSection />
        <ChizelverseOutroSection />
        <GsapAnimationSection />
        <AboutSection />
        <ChizelEcosystemSection />
        <ChizelAppSection />
        <ContactSection />
      </Suspense>
    </>
  );
};

export default HomePage;