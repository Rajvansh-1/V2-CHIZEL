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
    const sectionTrigger = {
      trigger: containerRef.current,
      start: "top 70%",
      toggleActions: "play none none reverse",
    };

    gsap.from(".animated-gradient-heading", {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 1,
      ease: "power3.out",
      scrollTrigger: sectionTrigger,
    });

    // --- Logo Reveal and 3D Flipper Animation ---
    const logoContainer = ".logo-container";
    gsap.from(logoContainer, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 1.2,
        ease: "power3.out",
        scrollTrigger: sectionTrigger,
    });
    
    // Animate the 'logo-flipper' div instead of the image itself
    gsap.to(".logo-flipper", {
        rotationY: 360,
        repeat: -1,
        duration: 8,
        ease: "none",
    });

    gsap.from(".solution-image", {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 1.4,
      ease: "power3.out",
      scrollTrigger: sectionTrigger,
    });

    gsap.from(".solution-card", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      delay: 1.6,
      ease: "power3.out",
      scrollTrigger: sectionTrigger,
    });

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
          <div className="logo-flipper relative w-28 h-28 md:w-36 md:h-36" style={{ transformStyle: 'preserve-3d' }}>
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
            <img
              src="/images/about-image.webp"
              alt="Chizel Smart Solution"
              className="solution-image w-full max-w-md lg:max-w-full rounded-3xl shadow-2xl shadow-primary/20"
            />
          </div>
          <div className="flex flex-col gap-6">
            {solutionCards.map((card, index) => (
              <div
                key={index}
                className="solution-card p-6 rounded-3xl bg-card border border-white/10"
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