// src/pages/home/sections/SolutionSection.jsx

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { solutionCards } from "@utils/constants";

gsap.registerPlugin(ScrollTrigger);

const SolutionSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // --- Helper function for creating common scroll-triggered animations ---
    const animateFrom = (elem, vars) => {
      gsap.from(elem, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        ...vars,
        scrollTrigger: {
          trigger: elem,
          start: "top 85%", // Start animation when element is 85% from the top
          toggleActions: "play none none reverse",
        },
      });
    };

    // --- Animate each element group individually for a smoother reveal ---
    animateFrom(".animated-gradient-heading");
    animateFrom(".logo-container", { delay: 0.2 });
    animateFrom(".solution-image", { delay: 0.2 });
    animateFrom(".solution-card", { delay: 0.3 });

    // --- Continuous 3D Logo Rotation ---
    const rotation = gsap.to(".logo-flipper", {
      rotationY: 360,
      repeat: -1,
      duration: 10, // Slowed down for a more graceful effect
      ease: "none",
    });

    // --- Interactive Hover Effect for the Logo ---
    const flipper = containerRef.current.querySelector(".logo-flipper");

    flipper.addEventListener("mouseenter", () => {
      gsap.to(flipper, { scale: 1.15, duration: 0.3, ease: "power2.out" });
      rotation.pause();
    });

    flipper.addEventListener("mouseleave", () => {
      gsap.to(flipper, { scale: 1, duration: 0.3, ease: "power2.out" });
      rotation.play();
    });

    // Cleanup event listeners
    return () => {
      flipper.removeEventListener("mouseenter", () => {});
      flipper.removeEventListener("mouseleave", () => {});
    };

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="solution" className="py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="animated-gradient-heading font-heading text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-primary via-accent to-badge-bg bg-clip-text">
            The Revolutionary Solution
          </h2>
        </div>

        {/* This container adds the 3D perspective */}
        <div className="logo-container flex justify-center my-12 md:my-16" style={{ perspective: '1000px' }}>
          {/* This is the flipper element that gets rotated by GSAP */}
          <div className="logo-flipper relative w-28 h-28 md:w-36 md:h-36 cursor-pointer" style={{ transformStyle: 'preserve-3d' }}>
            {/* Front Logo */}
            <img
              src="/images/logo.png"
              alt="Chizel Logo"
              className="absolute w-full h-full object-contain"
              style={{ backfaceVisibility: 'hidden' }}
            />
            {/* Back Logo (pre-rotated) */}
            <img
              src="/images/logo.png"
              alt="Chizel Logo"
              className="absolute w-full h-full object-contain"
              style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
            />
          </div>
        </div>

        <div className="solution-content grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex items-center justify-center lg:order-last">
            {/* ✨ HOVER & CLICK EFFECTS ADDED HERE ✨ */}
            <img
              src="/images/about-image.webp"
              alt="Chizel Smart Solution"
              className="solution-image w-full max-w-md lg:max-w-full rounded-3xl shadow-2xl shadow-primary/20 
                         transition-all duration-300 ease-in-out cursor-pointer
                         hover:scale-105 hover:shadow-primary/40 active:scale-100"
            />
          </div>
          <div className="flex flex-col gap-6">
            {solutionCards.map((card, index) => (
              // ✨ HOVER & CLICK EFFECTS ADDED HERE ✨
              <div
                key={index}
                className="solution-card p-6 rounded-3xl bg-card border border-white/10 
                           transition-all duration-300 ease-in-out cursor-pointer
                           hover:scale-103 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 active:scale-98"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl pt-1">{card.emoji}</div>
                  <div>
                    <h3 className="font-heading text-xl text-text mb-2">{card.title}</h3>
                    <p className="font-body text-secondary-text text-sm">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;