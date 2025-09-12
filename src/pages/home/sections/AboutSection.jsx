// src/pages/home/sections/AboutSection.jsx

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { holoDecks } from "@utils/constants";
import { FaUsers, FaChild, FaChartLine } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  kids: <FaChild className="text-5xl text-accent drop-shadow-lg" />,
  parents: <FaUsers className="text-5xl text-accent drop-shadow-lg" />,
  investors: <FaChartLine className="text-5xl text-accent drop-shadow-lg" />,
};

const AboutSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(".about-heading, .about-subheading", {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out",
    }).from(".about-panel-v2", {
      opacity: 0,
      y: 50,
      scale: 0.95,
      stagger: 0, // Reveal delay removed for instant animation
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.5");

    // Magnetic glow effect on cards
    gsap.utils.toArray(".about-panel-v2").forEach((panel) => {
      panel.addEventListener("mousemove", (e) => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gsap.to(panel, {
          "--glow-x": `${x}px`,
          "--glow-y": `${y}px`,
          "--glow-opacity": 1,
          duration: 0.4,
        });
      });
      panel.addEventListener("mouseleave", () => {
        gsap.to(panel, {
          "--glow-opacity": 0,
          duration: 0.5,
        });
      });
    });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="about-us"
      className="relative overflow-hidden bg-background py-24"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-accent/10 via-transparent to-transparent blur-3xl" />
        
        {/* Dynamic Starfield */}
        <div className="absolute inset-0 opacity-50">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Heading */}
      <div className="relative text-center mb-20 px-6 z-10">
        <h2 className="about-heading font-heading text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          What We Offer
        </h2>
        <p className="about-subheading mt-4 text-lg text-secondary-text max-w-2xl mx-auto">
          Chizel connects learning with experience — built for kids, parents,
          and investors with a futuristic vision.
        </p>
      </div>

      {/* Panels */}
      <div className="relative z-10 flex flex-col md:flex-row md:flex-wrap gap-12 justify-center max-w-6xl mx-auto px-6">
        {holoDecks.map((deck) => (
          <div
            key={deck.id}
            className="about-panel-v2 group relative flex-1 min-w-[280px] max-w-sm p-8 rounded-2xl bg-card/80 backdrop-blur-xl border border-white/10 shadow-lg"
          >
            <div className="magnetic-glow" />
            <div className="relative z-10">
              <div className="flex justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                {iconMap[deck.id]}
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300 drop-shadow-md">
                {deck.title}
              </h3>
              <p className="uppercase text-sm md:text-base font-semibold tracking-widest text-accent mb-4 drop-shadow-md">
                {deck.subtitle}
              </p>
              <p className="text-secondary-text leading-relaxed">
                {deck.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .about-panel-v2 {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-opacity: 0;
        }
        .magnetic-glow {
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: radial-gradient(300px circle at var(--glow-x) var(--glow-y), var(--color-primary-alpha), transparent);
          opacity: var(--glow-opacity);
          transition: opacity 0.3s ease-out;
        }
        @keyframes twinkle {
          from { opacity: 0.2; }
          to { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;