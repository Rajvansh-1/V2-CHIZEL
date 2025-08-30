// src/components/ui/Loader.jsx

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Loader = ({ setIsLoading }) => {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef(null);
  const logoPathRef = useRef(null);
  const coreRef = useRef(null);
  const progressTextRef = useRef(null);

  // Simulate loading progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = Math.random() * 5 + 1; // More controlled increments
        return Math.min(prev + increment, 100);
      });
    }, 100);
    return () => clearInterval(progressInterval);
  }, []);

  useGSAP(() => {
    // Animate based on progress
    gsap.to(progressTextRef.current, {
        textContent: Math.round(progress),
        duration: 0.5,
        ease: "power2.out",
        snap: { textContent: 1 },
    });

    // Animate the logo being "etched"
    if (logoPathRef.current) {
        const pathLength = logoPathRef.current.getTotalLength();
        gsap.to(logoPathRef.current, {
            strokeDashoffset: pathLength - (progress / 100) * pathLength,
            duration: 0.5,
            ease: "power2.out"
        });
    }
    
    // Make the core glow brighter with progress
    gsap.to(coreRef.current, {
        scale: 1 + (progress / 100) * 0.5,
        opacity: 0.5 + (progress / 100) * 0.5,
        boxShadow: `0 0 ${progress * 0.5}px #1f6feb`,
        duration: 0.5,
        ease: "power2.out"
    });

    // Final animation sequence when loading is complete
    if (progress >= 100) {
      const exitTl = gsap.timeline({
        delay: 0.5,
        onComplete: () => setIsLoading(false),
      });
      exitTl
        .to([coreRef.current, progressTextRef.current], {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        })
        .to(".logo-container", {
            scale: 2,
            filter: "drop-shadow(0 0 30px #5d3fd3)",
            duration: 0.4,
            ease: "power2.out"
        })
        .to(".logo-container", {
            scale: 1,
            filter: "drop-shadow(0 0 15px #1f6feb)",
            duration: 0.4,
            ease: "power2.in"
        })
        .to(loaderRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
        }, "-=0.2");
    }
  }, { dependencies: [progress, setIsLoading], scope: loaderRef });

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex-center flex-col bg-background text-text overflow-hidden"
    >
        {/* VFX Artist's Note: Particles would be added here, flowing towards the center.
            Their speed and density would be tied to the `progress` state. */}
        
        <div className="relative flex-center flex-col">
            <div ref={coreRef} className="absolute w-48 h-48 bg-primary rounded-full blur-2xl opacity-50" />
            
            <div className="logo-container relative w-48 h-48">
                {/* SVG for the Chizel Logo - Crown and Wordmark */}
                <svg className="absolute-center w-full h-full" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#5d3fd3" />
                            <stop offset="100%" stopColor="#1f6feb" />
                        </linearGradient>
                    </defs>
                    <path
                        ref={logoPathRef}
                        d="M20,40 Q50,10 80,40 M25,40 L25,60 Q50,75 75,60 L75,40 M35,60 Q50,50 65,60"
                        stroke="url(#logo-gradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="250"
                        strokeDashoffset="250"
                    />
                </svg>
            </div>
            
            <div className="absolute bottom-[-4rem] text-center">
                <p className="font-ui text-4xl text-text">
                    <span ref={progressTextRef}>0</span>%
                </p>
                <p className="font-body text-secondary-text mt-1">Forging Universe...</p>
            </div>
        </div>
    </div>
  );
};

export default Loader;