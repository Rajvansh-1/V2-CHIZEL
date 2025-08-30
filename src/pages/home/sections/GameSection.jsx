// src/pages/home/sections/GameSection.jsx

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { featuresData } from "@utils/constants"; // We reuse this data for our games
import { TiPuzzle, TiChartLine, TiLightbulb } from "react-icons/ti";

const gameIcons = {
  "Word Warriors": <TiChartLine />,
  "Logic League": <TiPuzzle />,
  "Chizel Club": <TiLightbulb />,
};

const GameSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const orreryRef = useRef(null);

  // This timeline will be controlled by the click handler
  const tl = useRef();

  const handlePlanetSelect = (index) => {
    if (activeIndex === index) return;

    // Use a timeline to smoothly transition the orrery and content
    tl.current = gsap.timeline({
      onStart: () => setActiveIndex(index), // Set state at the beginning of the animation
    });

    // Animate out the old content
    tl.current.to(".transmission-panel > *", {
        opacity: 0,
        y: 10,
        stagger: 0.1,
        duration: 0.3,
        ease: "power2.in",
    });

    // Rotate the orrery to the new planet
    const rotation = -120 * index; // 3 planets, 120 degrees each
    tl.current.to(orreryRef.current, {
        rotation: rotation,
        duration: 1,
        ease: "power3.inOut",
    });
    
    // Animate in the new content
    tl.current.fromTo(".transmission-panel > *",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }
    );
  };

  useGSAP(() => {
    // Entrance animation for the whole section
    gsap.from(containerRef.current, {
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
    });

    // Gentle continuous rotation of the planets themselves
    gsap.to(".planet-icon", {
        rotation: 360,
        repeat: -1,
        duration: 20,
        ease: "none"
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="games" className="bg-background py-20 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        {/* ============== SECTION HEADER ============== */}
        <div className="text-center flex flex-col items-center mb-16 space-y-4 md:space-y-6">
          <p className="font-ui text-lg text-primary uppercase tracking-wider">
            Explore Our Worlds
          </p>
          <h1 className="font-heading text-5xl md:text-6xl text-text">
            The Galaxy of Games
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[60vh]">
            {/* Left Side: The Interactive Orrery */}
            <div className="w-full h-96 flex-center">
                <div ref={orreryRef} className="relative w-80 h-80 md:w-96 md:h-96">
                    {/* The Sun */}
                    <div className="absolute-center w-24 h-24 bg-primary/30 rounded-full shadow-2xl shadow-primary/50 flex-center">
                        <div className="w-16 h-16 bg-primary/50 rounded-full animate-pulse" />
                    </div>

                    {/* Orbital Paths */}
                    <div className="absolute-center w-full h-full border border-primary/20 rounded-full" />
                    
                    {/* The Planets (Games) */}
                    {featuresData.map((game, index) => {
                        const angle = index * 120; // 3 planets, 120 degrees apart
                        return (
                            <div 
                                key={game.title}
                                className="planet-container absolute top-0 left-1/2 w-0 h-full"
                                style={{ transform: `rotate(${angle}deg)`}}
                            >
                                <div 
                                    onClick={() => handlePlanetSelect(index)}
                                    className={`absolute top-[-24px] left-[-24px] w-12 h-12 md:w-16 md:h-16 rounded-full flex-center text-3xl md:text-4xl cursor-pointer transition-all duration-500
                                    ${activeIndex === index ? 'bg-primary shadow-lg shadow-primary/50 text-white' : 'bg-card text-primary/70 hover:bg-primary/50'}`}
                                >
                                   <div className="planet-icon" style={{transform: `rotate(${-angle}deg)`}}>
                                     {gameIcons[game.title]}
                                   </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Right Side: Transmission Panel */}
            <div className="relative h-96">
                <div className="transmission-panel absolute inset-0 bg-card/50 border border-white/10 rounded-2xl p-8 flex flex-col justify-center">
                    <h3 className="font-heading text-4xl text-text mb-2">{featuresData[activeIndex].title}</h3>
                    <p className="font-body text-secondary-text mb-4">{featuresData[activeIndex].description}</p>
                    <cite className="font-body text-text/70 italic">"{featuresData[activeIndex].quote}"</cite>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default GameSection;