// src/pages/home/sections/NebulaSection.jsx

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuresData } from "@utils/constants";

gsap.registerPlugin(ScrollTrigger);

// Keywords for each planet
const keywords = [
  ["Confidence", "Leadership", "Communication"],
  ["Creativity", "Focus", "Problem-Solving"],
  ["Friendship", "Collaboration", "Community"],
];

const NebulaSection = () => {
  const containerRef = useRef(null);
  const pinRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinRef.current,
        pin: true,
        scrub: 1.5,
        start: "top top",
        end: "+=4000", // This determines the scroll distance for the entire animation
      },
    });

    // Initial state: Fade in the entire scene
    tl.from(".nebula-content", { opacity: 0, scale: 0.5, duration: 1 });

    // 1. Approach the Orrery
    tl.to(".orrery-container", { scale: 1.5, duration: 2, ease: "power2.inOut" });

    // 2. Focus on Planet 1
    tl.to(".orrery-container", { rotation: 0, x: "-25vw", y: "15vh", duration: 2, ease: "power2.inOut" }, "planet1");
    tl.to("#planet-0", { scale: 2, filter: "drop-shadow(0 0 20px #1f6feb)"}, "planet1");
    tl.fromTo(".keyword-0", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.2, duration: 1 }, "planet1+=0.5");

    // 3. Travel to Planet 2
    tl.to(".keyword-0", { opacity: 0, scale: 0, stagger: 0.1, duration: 1 }, "planet2");
    tl.to("#planet-0", { scale: 1, filter: "drop-shadow(0 0 0px #1f6feb)"}, "planet2");
    tl.to(".orrery-container", { rotation: 120, x: "25vw", y: "-10vh", duration: 2, ease: "power2.inOut" }, "planet2");
    tl.to("#planet-1", { scale: 2, filter: "drop-shadow(0 0 20px #5d3fd3)"}, "planet2");
    tl.fromTo(".keyword-1", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.2, duration: 1 }, "planet2+=0.5");

    // 4. Travel to Planet 3
    tl.to(".keyword-1", { opacity: 0, scale: 0, stagger: 0.1, duration: 1 }, "planet3");
    tl.to("#planet-1", { scale: 1, filter: "drop-shadow(0 0 0px #5d3fd3)"}, "planet3");
    tl.to(".orrery-container", { rotation: 240, x: "-10vw", y: "-15vh", duration: 2, ease: "power2.inOut" }, "planet3");
    tl.to("#planet-2", { scale: 2, filter: "drop-shadow(0 0 20px #ffb347)"}, "planet3");
    tl.fromTo(".keyword-2", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.2, duration: 1 }, "planet3+=0.5");

    // 5. Pull back and fade out
    tl.to(".keyword-2", { opacity: 0, scale: 0, stagger: 0.1, duration: 1 }, "exit");
    tl.to("#planet-2", { scale: 1, filter: "drop-shadow(0 0 0px #ffb347)"}, "exit");
    tl.to(".orrery-container", { scale: 0.5, rotation: 360, opacity: 0, duration: 2, ease: "power2.in" }, "exit");
    tl.to(".nebula-title", { opacity: 0, duration: 1 }, "exit");


  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="nebula-journey" className="relative">
      <div ref={pinRef} className="h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        {/* Dynamic Starfield */}
        <div className="absolute inset-0 opacity-40">
            {Array.from({ length: 150 }).map((_, i) => (
                <div key={i} className="absolute w-px h-px bg-white rounded-full" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `twinkle ${Math.random() * 5 + 2}s infinite alternate` }} />
            ))}
        </div>
        
        <div className="nebula-content relative w-full h-full flex flex-col items-center justify-start pt-24">
            <div className="nebula-title text-center">
                <h2 className="font-heading text-5xl md:text-6xl text-text"><span>Ready To Turn Your Screen Time Into Skill Time?</span></h2>
                <p className="font-body text-secondary-text mt-2">Scroll to pilot your journey.</p>
            </div>
            
            <div className="flex-grow w-full flex-center relative">
                <div className="orrery-container w-96 h-96 scale-50">
                    {featuresData.map((game, index) => (
                        <div key={game.title} id={`planet-${index}`} className="planet absolute-center w-24 h-24 rounded-full flex-center transition-all duration-500" style={{ transform: `rotate(${index * 120}deg) translateX(180px) rotate(${-index * 120}deg)`}}>
                           <img src={game.gifSrc} alt={game.title} className="w-20 h-20 rounded-full object-cover"/>
                           <div className="absolute inset-0">
                                {keywords[index].map((word, wordIndex) => (
                                    <span key={wordIndex} className={`keyword-${index} absolute font-heading text-text text-sm bg-black/50 px-2 py-1 rounded-full`} style={{transform: `rotate(${wordIndex * 45}deg) translate(70px) rotate(${-wordIndex * 45}deg)`}}>{word}</span>
                                ))}
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
       <style>{`
            @keyframes twinkle {
                from { opacity: 0.2; }
                to { opacity: 1; }
            }
        `}</style>
    </section>
  );
};

export default NebulaSection;