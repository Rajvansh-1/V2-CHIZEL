import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaLightbulb, FaGamepad, FaRocket, FaUsers } from "react-icons/fa";
import AnimatedTitle from "@/components/common/AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

// Data for the orbiting planets
const ecosystemPlanets = [
  { id: "learn", icon: <FaLightbulb />, label: "Learn", size: "w-20 h-20 md:w-24 md:h-24", orbitDuration: 20 },
  { id: "play", icon: <FaGamepad />, label: "Play", size: "w-16 h-16 md:w-20 md:h-20", orbitDuration: 15 },
  { id: "grow", icon: <FaRocket />, label: "Grow", size: "w-20 h-20 md:w-24 md:h-24", orbitDuration: 25 },
  { id: "connect", icon: <FaUsers />, label: "Connect", size: "w-16 h-16 md:w-20 md:h-20", orbitDuration: 30 },
];

const ChizelEcosystemSection = () => {
  const containerRef = useRef(null);
  const orbits = useRef([]);

  useGSAP(() => {
    // Entrance animation for the whole section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(".vision-title-container > *", { opacity: 1, y: 0, duration: 0, ease: "power3.out" })
      .fromTo(".orbital-sun",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" },
        "-=0.5"
      )
      .from(".orbit-path", { scale: 0, stagger: 0.2, duration: 1, ease: "power2.out" }, "-=1")
      .from(".planet", { scale: 0, opacity: 0, stagger: 0.2, duration: 1, ease: "back.out(1.7)" }, "-=0.8");

    // Continuous orbital animations
    orbits.current = ecosystemPlanets.map((planet, index) =>
      gsap.to(`#orbit-${planet.id}`, {
        rotation: 360,
        repeat: -1,
        duration: planet.orbitDuration,
        ease: "none",
      })
    );

    // Hover interactions
    const planetElements = gsap.utils.toArray(".planet");
    planetElements.forEach((planetEl, index) => {
      const orbitAnim = orbits.current[index];
      const planetLabel = planetEl.querySelector(".planet-label");

      planetEl.addEventListener("mouseenter", () => {
        gsap.to(planetEl, { scale: 1.2, zIndex: 10, duration: 0.3 });
        gsap.to(planetLabel, { opacity: 1, y: 0, duration: 0.3 });
        orbitAnim.pause();
      });

      planetEl.addEventListener("mouseleave", () => {
        gsap.to(planetEl, { scale: 1, zIndex: 1, duration: 0.3 });
        gsap.to(planetLabel, { opacity: 0, y: 10, duration: 0.3 });
        orbitAnim.play();
      });
    });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="chizel-ecosystem"
      className="relative w-full min-h-screen py-20 flex flex-col items-center bg-background text-text overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-[#0c102a] to-background" />
      <div className="absolute inset-0 opacity-20 z-0 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
        {Array.from({ length: 150 }).map((_, i) => (
          <div key={i} className="absolute w-px h-px bg-white rounded-full" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate` }} />
        ))}
      </div>

      {/* Top Content */}
      <div className="vision-title-container relative z-10 text-center w-full max-w-4xl mx-auto px-4 mb-8">
        <p className="font-ui text-lg uppercase text-secondary-text tracking-wider mb-4">Our Vision</p>
        <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white inline-block mb-2">
          BUILDING CHIZEL ECOSYSTEM
        </h2>
        <p className="font-body text-secondary-text text-lg sm:text-xl max-w-2xl mx-auto mt-6">
          We are building a comprehensive App + Web experience for your child — where learning, play, and growth come together in a single, engaging journey
        </p>
      </div>

      {/* Orbital System */}
      <div className="relative flex-grow flex-center w-full h-[500px] md:h-[600px]">
        <div className="absolute-center w-full max-w-full md:max-w-3xl h-full">
          {/* Sun */}
          <div className="orbital-sun absolute-center w-40 h-40 md:w-48 md:h-48">
            <img src="public/images/logo.png" alt="Chizel Ecosystem Core" className="w-full h-full object-contain rounded-full shadow-2xl shadow-primary/40" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse"></div>
          </div>

          {/* Orbits and Planets */}
          {ecosystemPlanets.map((planet, index) => {
            const orbitSize = `${(index + 1) * 25}% + 140px`;
            return (
              <div key={planet.id} id={`orbit-${planet.id}`} className="absolute-center w-full h-full">
                <div className="orbit-path absolute-center rounded-full border border-primary/10" style={{ width: `calc(${orbitSize})`, height: `calc(${orbitSize})` }}></div>
                <div className={`planet absolute-center ${planet.size} flex-center cursor-pointer`} style={{ top: `calc(50% - ${(planet.size.includes("24") ? 12 : 10)}rem - ${(index + 1) * 2}vw)` }}>
                  <div className="relative w-full h-full rounded-full bg-card/70 backdrop-blur-sm border border-primary/30 flex-center">
                    <span className="text-2xl md:text-3xl text-text">{planet.icon}</span>
                  </div>
                  <span className="planet-label absolute -bottom-8 font-heading text-lg opacity-0 transition-opacity duration-300" style={{ transform: "translateY(10px)" }}>
                    {planet.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{` @keyframes twinkle { from { opacity: 0.1; } to { opacity: 0.7; } } `}</style>
    </section>
  );
};

export default ChizelEcosystemSection;