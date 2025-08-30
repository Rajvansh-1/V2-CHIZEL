// src/pages/home/sections/HeroSection.jsx

import { useRef } from "react"; // CORRECTED: Added useRef import
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FaChevronDown } from "react-icons/fa";

const HeroSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    // Animate the content materializing from stardust
    tl.from(".hero-element", {
      opacity: 0,
      filter: "blur(10px)",
      scale: 1.2,
      y: 30,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Animate the scroll prompt
    tl.fromTo(
      ".scroll-prompt",
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" },
      ">-0.5" // Start this animation slightly before the main timeline finishes
    );
    
    // Parallax effect on mouse move
    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { offsetWidth: width, offsetHeight: height } = containerRef.current;
        
        // Calculate percentages from center
        const xPercent = (clientX / width - 0.5);
        const yPercent = (clientY / height - 0.5);
        
        // Apply parallax transforms
        gsap.to(".parallax-bg", { x: -xPercent * 20, y: -yPercent * 20, duration: 0.8, ease: "power2.out" });
        gsap.to(".parallax-mid", { x: -xPercent * 50, y: -yPercent * 50, duration: 0.8, ease: "power2.out" });
        gsap.to(".parallax-fore", { x: -xPercent * 80, y: -yPercent * 80, duration: 0.8, ease: "power2.out" });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
    }

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="home" className="relative h-screen w-screen overflow-hidden bg-background">
      
      {/* Layer 1: Background Stars (Moves the least) */}
      <div className="parallax-bg absolute inset-[-10%] bg-[url('/images/vision-image.webp')] bg-cover bg-center opacity-40" />

      {/* Layer 2: Midground Planets & Nebulae (Moves moderately) */}
      {/* VFX Artist's Note: These divs would contain larger, more prominent celestial bodies.
          We are using the ecosystem image as a stand-in for this layer. */}
      <div className="parallax-mid absolute inset-[-10%]">
          <img src="/images/ecosystem-image.webp" alt="Chizel Planets" className="absolute w-1/3 top-[15%] right-[5%] opacity-70" />
          <img src="/images/ecosystem-image.webp" alt="Chizel Planets" className="absolute w-1/4 bottom-[20%] left-[10%] opacity-50 scale-x-[-1]" />
      </div>

      {/* Layer 3: Foreground Characters (Moves the most) */}
      <div className="parallax-fore absolute inset-[-10%] flex-center">
          <img src="/images/about-image.webp" alt="Chizel Characters" className="w-1/2 max-w-2xl" />
      </div>
      
      {/* Darkening Overlay for Text Contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-transparent to-transparent" />


      {/* ============== CENTERED CONTENT ============== */}
      <div className="relative z-20 flex h-full flex-col justify-end items-center text-center pb-24 md:pb-32">
        <div className="max-w-4xl px-4">
          <h1 className="hero-element text-5xl font-bold uppercase text-text sm:text-6xl md:text-7xl drop-shadow-[0_0_25px_rgba(31,111,235,0.45)]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Turning Screen Time Into <span className="bg-gradient-to-r from-primary via-accent to-badge-bg bg-clip-text text-transparent">Skill Time</span>
          </h1>
          <p className="hero-element mx-auto mt-4 max-w-2xl font-body text-base text-secondary-text md:text-xl">
            Chizel transforms passive screen time into an active, playful learning experience — set among the stars. Every scroll unlocks a new galaxy of growth.
          </p>
        </div>
      </div>

      {/* ============== SCROLL PROMPT ============== */}
      <div className="scroll-prompt absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
        <div className="flex flex-col items-center gap-1 font-ui text-sm text-secondary-text">
          <span>Begin Exploration</span>
          <FaChevronDown />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;