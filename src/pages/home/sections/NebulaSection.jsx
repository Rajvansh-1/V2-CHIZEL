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
    // GSAP MatchMedia for responsive animations
    let mm = gsap.matchMedia();

    // --- DESKTOP ANIMATION ---
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: "+=4000",
        },
      });

      tl.from(".nebula-content", { opacity: 0, scale: 0.5, duration: 1 })
        .to(".orrery-container", { scale: 1.5, duration: 2, ease: "power2.inOut" })
        .to(".orrery-container", { rotation: 0, x: "-25vw", y: "15vh", duration: 2, ease: "power2.inOut" }, "planet1")
        .to("#planet-0", { scale: 2, filter: "drop-shadow(0 0 20px #1f6feb)" }, "planet1")
        .fromTo(".keyword-0", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.2, duration: 1 }, "planet1+=0.5")
        .to(".keyword-0", { opacity: 0, scale: 0, stagger: 0.1, duration: 1 }, "planet2")
        .to("#planet-0", { scale: 1, filter: "drop-shadow(0 0 0px #1f6feb)" }, "planet2")
        .to(".orrery-container", { rotation: 120, x: "25vw", y: "-10vh", duration: 2, ease: "power2.inOut" }, "planet2")
        .to("#planet-1", { scale: 2, filter: "drop-shadow(0 0 20px #5d3fd3)" }, "planet2")
        .fromTo(".keyword-1", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.2, duration: 1 }, "planet2+=0.5")
        .to(".keyword-1", { opacity: 0, scale: 0, stagger: 0.1, duration: 1 }, "planet3")
        .to("#planet-1", { scale: 1, filter: "drop-shadow(0 0 0px #5d3fd3)" }, "planet3")
        .to(".orrery-container", { rotation: 240, x: "-10vw", y: "-15vh", duration: 2, ease: "power2.inOut" }, "planet3")
        .to("#planet-2", { scale: 2, filter: "drop-shadow(0 0 20px #ffb347)" }, "planet3")
        .fromTo(".keyword-2", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.2, duration: 1 }, "planet3+=0.5")
        .to(".keyword-2", { opacity: 0, scale: 0, stagger: 0.1, duration: 1 }, "exit")
        .to("#planet-2", { scale: 1, filter: "drop-shadow(0 0 0px #ffb347)" }, "exit")
        .to(".orrery-container", { scale: 0.5, rotation: 360, opacity: 0, duration: 2, ease: "power2.in" }, "exit")
        .to(".nebula-title", { opacity: 0, duration: 1 }, "exit");
    });

    // --- MOBILE ANIMATION ---
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: "+=3000",
        },
      });

      tl.from(".nebula-content", { opacity: 0, duration: 1 })
        .to("#planet-0", { scale: 1.8, filter: "drop-shadow(0 0 15px #1f6feb)" }, "planet1")
        .fromTo(".keyword-0", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.2, duration: 1 }, "planet1+=0.5")
        .to(".keyword-0", { opacity: 0, scale: 0, stagger: 0.1, duration: 1 }, "planet2")
        .to("#planet-0", { scale: 1, filter: "drop-shadow(0 0 0px #1f6feb)" }, "planet2")
        .to(".orrery-container", { rotation: 120, duration: 2, ease: "power2.inOut" }, "planet2")
        .to("#planet-1", { scale: 1.8, filter: "drop-shadow(0 0 15px #5d3fd3)" }, "planet2")
        .fromTo(".keyword-1", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.2, duration: 1 }, "planet2+=0.5")
        .to(".keyword-1", { opacity: 0, scale: 0, stagger: 0.1, duration: 1 }, "planet3")
        .to("#planet-1", { scale: 1, filter: "drop-shadow(0 0 0px #5d3fd3)" }, "planet3")
        .to(".orrery-container", { rotation: 240, duration: 2, ease: "power2.inOut" }, "planet3")
        .to("#planet-2", { scale: 1.8, filter: "drop-shadow(0 0 15px #ffb347)" }, "planet3")
        .fromTo(".keyword-2", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.2, duration: 1 }, "planet3+=0.5")
        .to(".nebula-content", { opacity: 0, duration: 1.5, ease: "power2.in" }, "+=1");
    });

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
                <div className="orrery-container w-80 h-80 md:w-96 md:h-96 scale-75 md:scale-50">
                    {featuresData.map((game, index) => (
                        <div key={game.title} id={`planet-${index}`} className="planet absolute-center w-24 h-24 rounded-full flex-center transition-all duration-500" style={{ transform: `rotate(${index * 120}deg) translateX(150px) md:translateX(180px) rotate(${-index * 120}deg)`}}>
                           <video 
                              src={game.assetSrc} 
                              autoPlay 
                              loop 
                              muted 
                              playsInline 
                              className="w-20 h-20 rounded-full object-cover"
                            />
                           <div className="absolute inset-0">
                                {keywords[index].map((word, wordIndex) => (
                                    <span key={wordIndex} className={`keyword-${index} absolute font-heading text-text text-xs md:text-sm bg-black/50 px-2 py-1 rounded-full`} style={{transform: `rotate(${wordIndex * 45}deg) translate(60px) md:translate(70px) rotate(${-wordIndex * 45}deg)`}}>{word}</span>
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
            .planet {
              will-change: transform, filter;
            }
        `}</style>
    </section>
  );
};

export default NebulaSection;