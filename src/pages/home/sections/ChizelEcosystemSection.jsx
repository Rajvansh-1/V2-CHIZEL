// src/pages/home/sections/ChizelEcosystemSection.jsx

import { useRef, memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaLightbulb, FaGamepad, FaRocket, FaUsers } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// Data for the four planets
const planets = [
  { id: "learn", icon: <FaLightbulb />, label: "Learn", size: "w-20 h-20 md:w-24 md:h-24", position: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  { id: "play", icon: <FaGamepad />, label: "Play", size: "w-16 h-16 md:w-20 md:h-20", position: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2" },
  { id: "grow", icon: <FaRocket />, label: "Grow", size: "w-20 h-20 md:w-24 md:h-24", position: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" },
  { id: "connect", icon: <FaUsers />, label: "Connect", size: "w-16 h-16 md:w-20 md:h-20", position: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2" },
];

// Reusable Planet component
const Planet = memo(({ planet }) => (
  <div className={`planet absolute ${planet.position} ${planet.size} flex-center cursor-pointer z-10`}>
    <div className="relative w-full h-full rounded-full bg-card/70 backdrop-blur-sm border border-primary/30 flex-center transition-colors duration-300">
      <div className="planet-icon-inner text-2xl md:text-3xl text-text">
        {planet.icon}
      </div>
    </div>
    <span
      className="planet-label absolute mt-2 top-full font-heading text-base md:text-lg opacity-0 transition-opacity duration-300"
      style={{ transform: "translateY(10px)" }}
    >
      {planet.label}
    </span>
  </div>
));
Planet.displayName = 'Planet';


const ChizelEcosystemSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // --- DESKTOP ANIMATIONS (Interactive & Complex) ---
    mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%",
                toggleActions: "play none none reverse",
            }
        });

        tl.from(".vision-title-container > *, .planet", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
        })
        .from(".orbital-sun", {
            scale: 0.5,
            opacity: 0,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
        }, 0);

        gsap.to(".orbital-sun", {
            boxShadow: "0 0 50px 10px var(--color-primary-alpha)",
            repeat: -1,
            yoyo: true,
            duration: 3,
            ease: "sine.inOut"
        });

        const mainOrbitAnim = gsap.to("#main-orbit", {
            rotation: 360,
            repeat: -1,
            duration: 40,
            ease: "none",
        });

        gsap.to(".planet-icon-inner", {
            rotation: -360,
            repeat: -1,
            duration: 40,
            ease: "none",
        });

        gsap.utils.toArray(".planet").forEach((planetEl) => {
            const planetLabel = planetEl.querySelector(".planet-label");
            
            planetEl.addEventListener("mouseenter", () => {
                gsap.to(planetEl, { 
                    scale: 1.25, zIndex: 20, duration: 0.3, ease: "power2.out",
                    boxShadow: "0 0 30px 5px var(--color-primary-alpha)"
                });
                gsap.to(planetLabel, { opacity: 1, y: 0, duration: 0.3 });
                mainOrbitAnim.pause();
            });

            planetEl.addEventListener("mouseleave", () => {
                gsap.to(planetEl, { 
                    scale: 1, zIndex: 10, duration: 0.3, ease: "power2.out",
                    boxShadow: "0 0 0px 0px var(--color-primary-alpha)"
                });
                gsap.to(planetLabel, { opacity: 0, y: 10, duration: 0.3 });
                mainOrbitAnim.play();
            });
        });

        gsap.to(".star-parallax", {
            y: (i) => (i % 2 === 0 ? 100 : -100) * (gsap.utils.random(0.5, 1.5)),
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom", end: "bottom top", scrub: 1.5,
            },
        });
    });

    // --- MOBILE ANIMATIONS (Simplified & Performant) ---
    mm.add("(max-width: 767px)", () => {
        gsap.from(".vision-title-container > *, .planet, .orbital-sun", {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
        });

        // Simple rotation, no hover effects or complex interactions
        gsap.to("#main-orbit", {
            rotation: 360,
            repeat: -1,
            duration: 60, // Slower rotation on mobile
            ease: "none",
        });

        gsap.to(".planet-icon-inner", {
            rotation: -360,
            repeat: -1,
            duration: 60,
            ease: "none",
        });
    });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="chizel-ecosystem"
      className="relative w-full min-h-screen py-20 md:py-24 flex flex-col items-center bg-background text-text overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-[#0c102a] to-background" />
      <div className="absolute inset-0 opacity-40 z-0 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className="star-parallax absolute w-px h-px bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 4 + 2}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="vision-title-container relative z-10 text-center w-full max-w-4xl mx-auto px-4 mb-12 md:mb-16">
        <p className="font-ui text-base md:text-lg uppercase text-secondary-text tracking-wider mb-4">Our Vision</p>
        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white inline-block mb-2">
          BUILDING THE CHIZEL ECOSYSTEM
        </h2>
        <p className="font-body text-secondary-text text-base md:text-lg lg:text-xl max-w-3xl mx-auto mt-6 leading-relaxed">
          We are building a comprehensive App + Web experience where learning, play, and growth come together in a single, engaging journey.
        </p>
      </div>

      <div className="relative flex-grow flex-center w-full h-[60vh] md:h-[70vh] px-4">
        <div className="relative w-full h-full max-w-sm md:max-w-xl aspect-square">
          {/* Sun with glowing effect */}
          <div className="orbital-sun absolute-center w-32 h-32 md:w-48 md:h-48 z-[5] rounded-full">
            <img src="/images/logo.png" alt="Chizel Ecosystem Core" className="w-full h-full object-contain rounded-full" />
          </div>

          {/* SINGLE ROTATING ORBIT */}
          <div id="main-orbit" className="absolute-center w-full h-full">
            <div className="orbit-path absolute-center w-full h-full rounded-full border border-dashed border-primary/20" />
            
            {planets.map(planet => <Planet key={planet.id} planet={planet} />)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.2; }
          to { opacity: 0.8; }
        }
        /* Aligns the planet label correctly below the planet */
        .planet-label {
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
        }
      `}</style>
    </section>
  );
};

export default memo(ChizelEcosystemSection);