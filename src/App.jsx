// src/App.jsx
import { useState, useEffect } from "react";
import AppRouter from "@/router";
import Loader from "@components/ui/Loader";

const App = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Callback function for the Loader to signal completion
  const handleLoaderComplete = () => {
    setIsPageLoading(false);
  };

  // Keep track if the initial load effect has run
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Only run this effect once
    if (initialLoadComplete) return;

    // Simulate a minimum load time OR wait for specific assets if needed
    // Using a simple timeout for demonstration
    const minLoadTimer = setTimeout(() => {
        // Now allow the Loader's animation to finish
        // The Loader component itself should trigger handleLoaderComplete on its animation end
        setInitialLoadComplete(true); // Mark that initial load logic is done
        // If the Loader component doesn't call back, force it after a delay:
        // setTimeout(handleLoaderComplete, 3500); // Adjust timeout based on Loader animation duration
    }, 1500); // Minimum time loader is visible (e.g., 1.5 seconds)

    return () => {
      clearTimeout(minLoadTimer);
    };
  }, [initialLoadComplete]); // Depend on initialLoadComplete

  return (
    <>
      {/* Conditionally render Loader based on isPageLoading state */}
      {isPageLoading && <Loader setIsLoading={handleLoaderComplete} />}
      {/* AppRouter is implicitly rendered when Loader is not present */}
      {!isPageLoading && <AppRouter />}
    </>
  );
};

export default App;