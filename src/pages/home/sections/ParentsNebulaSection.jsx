// src/pages/home/sections/ParentsNebulaSection.jsx

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { FaBrain, FaUsers, FaComments } from "react-icons/fa";

// Register necessary GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const ParentsNebulaSection = () => {
  const containerRef = useRef(null);
  const pinRef = useRef(null);

  useGSAP(() => {
    const journeyPath = "#journey-path";
    const star = ".journey-star";
    const milestones = gsap.utils.toArray(".milestone");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinRef.current,
        pin: true,
        scrub: 1.5,
        start: "top top",
        end: "+=3000",
      },
    });

    // Animate the title in and out
    tl.from(".parents-title", { opacity: 0, y: -50, duration: 1 })
      .to(".parents-title", { opacity: 0, y: -50, duration: 1 }, "+=1");

    // Animate the star along the SVG path
    tl.to(star, {
        motionPath: {
            path: journeyPath,
            align: journeyPath,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
        },
        duration: 10,
        ease: "power1.inOut",
    }, 0);

    // Animate the path drawing itself
    tl.from(".path-line", { strokeDashoffset: 2058, duration: 10, ease: "power1.inOut" }, 0);

    // Trigger milestones at specific points along the timeline
    milestones.forEach((milestone, index) => {
        tl.fromTo(milestone, 
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" },
            2 + index * 2.5 // Stagger the milestones along the timeline
        );
    });

    // Animate final message
    tl.from(".final-message-parents", { opacity: 0, y: 50, duration: 1.5 });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="parents-nebula">
      <div ref={pinRef} className="h-screen w-full flex-center flex-col relative overflow-hidden bg-background">
        {/* Dynamic Starfield */}
        <div className="absolute inset-0 opacity-40">
            {Array.from({ length: 150 }).map((_, i) => (
                <div key={i} className="absolute w-px h-px bg-white rounded-full" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `twinkle ${Math.random() * 5 + 2}s infinite alternate` }} />
            ))}
        </div>

        <div className="parents-title text-center">
            <h2 className="font-heading text-5xl md:text-6xl text-text">Mission Control for Parents</h2>
            <p className="font-body text-secondary-text mt-2">Scroll to witness their journey.</p>
        </div>

        {/* The Constellation Scene */}
        <div className="absolute-center w-full max-w-4xl h-full">
            <svg viewBox="0 0 800 400" className="absolute-center w-full h-full">
                <path 
                    id="journey-path"
                    d="M50,300 C150,100 300,100 400,200 S650,300 750,100" 
                    fill="none" 
                    stroke="#1f6feb" 
                    strokeWidth="2" 
                    className="path-line opacity-30"
                    strokeDasharray="2058"
                />
            </svg>
            
            <div className="journey-star w-6 h-6 rounded-full bg-badge-bg shadow-[0_0_20px_#ffb347] opacity-0" style={{opacity: 1}} />

            {/* Milestones */}
            <div className="milestone absolute flex flex-col items-center gap-2" style={{top: '18%', left: '25%'}}>
                <div className="w-12 h-12 bg-card/80 rounded-full flex-center text-accent text-2xl"><FaBrain /></div>
                <span className="font-ui text-xs tracking-widest">Critical Thinking</span>
            </div>
             <div className="milestone absolute flex flex-col items-center gap-2" style={{top: '48%', left: '50%'}}>
                <div className="w-12 h-12 bg-card/80 rounded-full flex-center text-accent text-2xl"><FaComments /></div>
                <span className="font-ui text-xs tracking-widest">Communication</span>
            </div>
             <div className="milestone absolute flex flex-col items-center gap-2" style={{top: '23%', left: '85%'}}>
                <div className="w-12 h-12 bg-card/80 rounded-full flex-center text-accent text-2xl"><FaUsers /></div>
                <span className="font-ui text-xs tracking-widest">Collaboration</span>
            </div>
        </div>

        <div className="final-message-parents absolute bottom-24 text-center">
            <h3 className="font-heading text-3xl text-text">Track their journey. Witness their growth.</h3>
        </div>
         <style>{`
            @keyframes twinkle {
                from { opacity: 0.2; }
                to { opacity: 1; }
            }
        `}</style>
      </div>
    </section>
  );
};

export default ParentsNebulaSection;