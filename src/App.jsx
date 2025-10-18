// src/App.jsx
import { useState, useEffect } from "react"; // Added useEffect
import AppRouter from "@/router";
import Loader from "@components/ui/Loader";

const App = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Optional: Add a minimum display time for the loader
  useEffect(() => {
    const timer = setTimeout(() => {
      // setIsPageLoading(false); // Removed direct setting here
    }, 1500); // Ensure loader shows for at least 1.5 seconds

    // Simulate content loading completion
    const handleLoad = () => {
       // Only set loading false *after* the minimum time AND window load
       clearTimeout(timer); // Clear the minimum timer if load finishes early
       // Add a small delay after load to prevent visual glitches
       setTimeout(() => setIsPageLoading(false), 200);
    };

    window.addEventListener('load', handleLoad);


    return () => {
        clearTimeout(timer);
        window.removeEventListener('load', handleLoad);
    };
  }, []); // Run only once on mount


  return (
    // No bg-black needed here if ProfessionalLandingPage handles its background
    <>
      {isPageLoading && <Loader setIsLoading={() => {}} />} {/* Pass dummy setter or manage state differently if needed inside Loader */}
      {!isPageLoading && <AppRouter />}
    </>
  );
};

export default App;