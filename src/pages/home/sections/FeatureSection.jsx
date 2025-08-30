// src/pages/home/sections/FeatureSection.jsx

import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaQuoteLeft } from "react-icons/fa";
import { featuresData } from "@utils/constants";

gsap.registerPlugin(ScrollTrigger);

const FeatureSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const starfieldRef = useRef(null);

  // Generate a dynamic starfield on component mount
  useEffect(() => {
    const starfield = starfieldRef.current;
    if (starfield) {
      for (let i = 0; i < 150; i++) {
        const star = document.createElement("div");
        const size = Math.random() * 2 + 1;
        star.className = "star-particle absolute rounded-full bg-white";
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.opacity = `${Math.random() * 0.5 + 0.2}`;
        starfield.appendChild(star);
      }
      gsap.to(".star-particle", {
          opacity: () => Math.random() * 0.5 + 0.2,
          duration: () => Math.random() * 1 + 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
      })
    }
  }, []);

  const handleFeatureSelect = (index) => {
    if (activeIndex === index) return;

    // Animate out the old content with a glitch effect
    gsap.to(contentRef.current, {
        opacity: 0,
        filter: "blur(5px)",
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            setActiveIndex(index);
            // Animate in the new content with a materialization effect
            gsap.fromTo(contentRef.current,
                { opacity: 0, filter: "blur(5px)", y: 20 },
                { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.5, ease: "power2.out" }
            );
        }
    });
  };

  useGSAP(() => {
    gsap.from(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative w-full bg-background py-20 sm:py-24 overflow-hidden"
    >
        {/* Dynamic Starfield Background */}
        <div ref={starfieldRef} className="absolute inset-0 opacity-40 pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        {/* HEADER */}
        <div
          className="text-center flex flex-col items-center space-y-4 md:space-y-6"
        >
          <p className="font-ui text-sm text-secondary-text uppercase tracking-wider">
            Discover Our Features
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-5xl text-text leading-tight">
            The Constellation of Growth
          </h1>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start mt-12 md:mt-16">
          {/* LEFT COLUMN: Holographic Display */}
          <div className="order-2 md:order-1 flex flex-col space-y-8 sticky top-24">
            <div className="relative w-full rounded-xl shadow-2xl shadow-primary/20 h-[350px] md:h-[550px] bg-card/50 border border-primary/30 p-2">
                 {/* Holographic Frame Effect */}
                <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-primary/50 to-accent/50 blur opacity-70" />
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-background">
                     <img
                        src={featuresData[activeIndex].gifSrc}
                        alt={`${featuresData[activeIndex].title} feature in action`}
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                </div>
            </div>

            <div ref={contentRef}>
                <p className="font-body text-secondary-text">
                    {featuresData[activeIndex].description}
                </p>
                <div className="relative border-l-2 border-primary/30 pl-4 pt-4 mt-4">
                    <FaQuoteLeft className="absolute -top-1 -left-1.5 text-xl text-primary/30" />
                    <blockquote className="font-body text-text/80 italic">
                    "{featuresData[activeIndex].quote}"
                    </blockquote>
                    <cite className="block text-xs not-italic text-secondary-text mt-2">
                    — {featuresData[activeIndex].author}
                    </cite>
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Starmap Navigator */}
          <div className="order-1 md:order-2 flex flex-col justify-start md:h-[150vh]">
            <ul className="space-y-16 md:space-y-24 text-center md:text-right sticky top-1/3">
              {featuresData.map((feature, index) => (
                <li
                  key={index}
                  onMouseEnter={() => handleFeatureSelect(index)}
                  onClick={() => handleFeatureSelect(index)}
                  className="cursor-pointer group"
                >
                  <h2
                    className={`font-heading text-3xl sm:text-4xl lg:text-7xl uppercase transition-all duration-300 ${
                      activeIndex === index
                        ? "text-text opacity-100"
                        : "text-secondary-text opacity-30 group-hover:opacity-60"
                    }`}
                  >
                    {feature.title}
                  </h2>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;