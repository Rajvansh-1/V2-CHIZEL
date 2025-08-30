// src/pages/home/sections/SolutionSection.jsx

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { solutionCards } from "@utils/constants";
import AnimatedTitle from "@components/common/AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

// A smaller, iconic version of the principle cards for the animation
const PrincipleOrb = ({ card, className }) => (
    <div className={`principle-orb absolute rounded-lg bg-card/70 backdrop-blur-md border border-white/10 p-4 flex items-center gap-3 ${className}`}>
        <span className="text-2xl">{card.emoji}</span>
        <div>
            <h4 className="font-heading text-sm text-text whitespace-nowrap">{card.title}</h4>
        </div>
    </div>
);

const SolutionSection = () => {
  const containerRef = useRef(null);
  const pinRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: "+=2000", // Controls how long the animation is pinned
      },
    });

    // 1. Title appears
    tl.from(".solution-title", { opacity: 0, scale: 0.8, duration: 0.5 });
    
    // 2. Central Core Ignites
    tl.fromTo(".central-core", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "power2.out" });
    
    // 3. Orbs Emerge and Orbit
    tl.from(".principle-orb", { 
        scale: 0, 
        opacity: 0, 
        duration: 1, 
        stagger: 0.2, 
        ease: "power2.out" 
    }, "-=0.5");
    
    // Add a continuous rotation for the orbit effect
    gsap.to(".orbit-container", {
        rotation: 360,
        repeat: -1,
        duration: 30,
        ease: "none"
    });

    // 4. Transition to Final Layout
    tl.to(".solution-title", { opacity: 0, scale: 0.8, duration: 0.5 }, "+=1");
    tl.to(".central-core", { scale: 0, opacity: 0, duration: 1}, "<");
    tl.to(".orbit-container", { scale: 0, opacity: 0, rotation: 180, duration: 1}, "<");
    
    tl.fromTo(".final-layout", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="solution">
      {/* This container will be pinned */}
      <div ref={pinRef} className="h-screen w-full flex-center flex-col relative overflow-hidden">
        {/* The initial animation scene */}
        <div className="absolute inset-0 flex-center flex-col text-center">
            <div className="solution-title">
                 <AnimatedTitle
                    title="THE SMART SOLUTION"
                    containerClass="!text-4xl md:!text-5xl !leading-tight text-text"
                />
            </div>

            <div className="central-core w-40 h-40 bg-primary/20 rounded-full flex-center shadow-2xl shadow-primary/30 relative mt-16">
                 <div className="w-24 h-24 bg-primary/30 rounded-full animate-pulse" />
                <div className="orbit-container absolute inset-0">
                    <PrincipleOrb card={solutionCards[0]} className="top-[-2rem] left-1/2 -translate-x-1/2" />
                    <PrincipleOrb card={solutionCards[1]} className="bottom-[-2rem] left-1/2 -translate-x-1/2" />
                    <PrincipleOrb card={solutionCards[2]} className="left-[-8rem] top-1/2 -translate-y-1/2" />
                    <PrincipleOrb card={solutionCards[3]} className="right-[-8rem] top-1/2 -translate-y-1/2" />
                </div>
            </div>
        </div>

        {/* The final layout scene, initially hidden */}
        <div className="final-layout opacity-0 w-full h-full flex-center">
             <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="flex items-center justify-center">
                    <img
                        src="/images/about-image.webp"
                        alt="Chizel Smart Solution"
                        className="w-full max-w-md lg:max-w-full rounded-3xl shadow-2xl shadow-primary/20"
                    />
                </div>
                <div className="flex flex-col gap-6">
                    {solutionCards.map((card, index) => (
                        <div key={index} className="p-6 rounded-3xl bg-[#10182B] border border-white/10">
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
      </div>
    </section>
  );
};

export default SolutionSection;