import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Loader = ({ setIsLoading }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const counter = { value: 0 };
    const loaderText = containerRef.current.querySelector(".loader-percentage");
    const progressBar = containerRef.current.querySelector(".progress-bar-inner");

    const tl = gsap.timeline({
      onComplete: () => setIsLoading(false),
    });

    // Animate the entrance of the logo and welcome text
    tl.fromTo(
      ".loader-logo, .loader-welcome-text",
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.5,
      }
    )
    // Animate the progress bar and percentage counter into view
    .fromTo(
      ".progress-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.5"
    )
    // Animate the percentage counter from 0 to 100 and the progress bar width
    .to(
      counter,
      {
        value: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          loaderText.textContent = `${Math.round(counter.value)}%`;
        },
      },
      ">-0.2"
    )
    .to(
      progressBar,
      {
        width: "100%",
        duration: 2,
        ease: "power2.inOut",
      },
      "<" // Run this animation at the same time as the counter
    )
    // Animate everything out
    .to(
      ".loader-content > *", // Target all children of the content div
      {
        opacity: 0,
        y: -30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.in",
        delay: 0.5, // Pause briefly at 100%
      }
    )
    // Fade out the entire loader container
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
    });

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-white overflow-hidden"
    >
      {/* Lightweight Starfield */}
      <div className="absolute inset-0">
        {Array.from({ length: 75 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2.5 + Math.random() * 4}s infinite alternate`,
              animationDelay: `${Math.random()}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="loader-content relative flex flex-col items-center justify-center text-center px-4">
        {/* Pulsing Orb Effect */}
        <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Logo */}
        <div className="loader-logo">
          <img src="/images/logo.png" alt="Chizel Logo" className="w-28 h-28 md:w-32 md:h-32 object-contain mb-4" />
        </div>

        {/* Welcome Text */}
        <h1 className="loader-welcome-text font-heading text-3xl md:text-4xl font-bold text-text mb-6">
          Welcome To Chizel
        </h1>
        
        {/* Progress Container */}
        <div className="progress-container w-48">
          <p className="loader-percentage font-ui text-secondary-text mb-2 text-sm">0%</p>
          <div className="progress-bar-outer w-full h-1 bg-card rounded-full overflow-hidden">
            <div className="progress-bar-inner h-full bg-primary rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes twinkle { 
          0% { opacity: 0.2; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Loader;