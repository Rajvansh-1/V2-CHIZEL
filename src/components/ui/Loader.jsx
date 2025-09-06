import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Loader = ({ setIsLoading }) => {
  const containerRef = useRef(null);
  const countdownRef = useRef(null);

  useGSAP(() => {
    // A single, cinematic timeline for the ~5 second launch sequence
    const tl = gsap.timeline({
      onComplete: () => setIsLoading(false),
      delay: 0.5,
    });

    // Animate the countdown numbers sequentially
    gsap.utils.toArray(".countdown-number").forEach((num, i) => {
      tl.fromTo(num, 
        { scale: 0.5, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" }
      )
      .to(num, 
        { scale: 1.5, opacity: 0, duration: 0.3, ease: "power2.in" }, 
        "+=0.2"
      );
    });
    
    // Animate the "LIFTOFF" text
    tl.fromTo(".liftoff-text", 
      { scale: 0.8, opacity: 0 },
      { scale: 1.2, opacity: 1, duration: 0.5, ease: "power2.out" }
    )
    .to(".liftoff-text", { opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.2");

    // Rocket ignition, shake, and launch sequence
    tl.to(".rocket-fire-realistic", {
        opacity: 1,
        scaleY: 1,
        duration: 0.4,
        ease: "power3.out",
      }, "-=1.2")
      .to(".launchpad-smoke-realistic", {
        opacity: 1,
        scale: 2,
        duration: 1.5,
        ease: "power2.out",
      }, "<")
      .to(containerRef.current, {
        keyframes: [
          { x: gsap.utils.random(-2, 2), y: gsap.utils.random(-2, 2), duration: 0.05 },
          { x: gsap.utils.random(-5, 5), y: gsap.utils.random(-5, 5), duration: 0.1 },
          { x: 0, y: 0, duration: 0.05 },
        ],
        repeat: 8,
      }, "<")
      .to(".chizel-rocket-realistic-v2", {
        y: "-150vh",
        rotation: 3,
        duration: 2.0,
        ease: "power2.in",
      }, "-=0.8")
      .to(".launchpad-smoke-realistic", {
        scale: 4,
        opacity: 0,
        duration: 2,
        ease: "power2.in",
      }, "<")
      .to(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      }, "-=1");

  }, { scope: containerRef, dependencies: [setIsLoading] });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex justify-center items-end bg-background text-text overflow-hidden"
    >
      {/* Starfield */}
      <div className="absolute inset-0 opacity-50">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      {/* Countdown & Liftoff Text */}
      <div className="absolute inset-0 flex-center pointer-events-none">
        <span className="countdown-number absolute font-heading text-9xl text-white font-black opacity-0">3</span>
        <span className="countdown-number absolute font-heading text-9xl text-white font-black opacity-0">2</span>
        <span className="countdown-number absolute font-heading text-9xl text-white font-black opacity-0">1</span>
        <span className="liftoff-text absolute font-heading text-7xl text-yellow-300 font-black opacity-0 tracking-widest">LIFTOFF</span>
      </div>

      {/* The Realistic Rocket */}
      <div className="chizel-rocket-realistic-v2 relative z-10 flex flex-col items-center w-28 md:w-36 mb-[-30px]">
        {/* Nose Cone */}
        <div className="w-full h-20 md:h-24 bg-gray-200" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
        {/* Main Body */}
        <div className="w-full h-32 md:h-40 bg-gray-100 flex-center p-2 border-y border-gray-300">
          <img src="/images/logo.png" alt="Chizel Logo" className="w-16 h-16 object-contain" />
        </div>
        {/* Fins & Engine */}
        <div className="relative w-full h-16 flex justify-center items-end">
          <div className="absolute bottom-0 w-[140%] h-12 flex justify-between">
            <div className="w-8 h-full bg-red-600" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}/>
            <div className="w-8 h-full bg-red-600" style={{ clipPath: 'polygon(0% 0, 0% 100%, 100% 100%)' }}/>
          </div>
          <div className="w-[60%] h-8 bg-gray-400 rounded-b-md" />
        </div>
        {/* Engine Fire */}
        <div className="rocket-fire-realistic absolute -bottom-48 w-full h-48 opacity-0 scale-y-0 origin-top">
            <div className="fire-inner-realistic"></div>
            <div className="fire-middle-realistic"></div>
            <div className="fire-outer-realistic"></div>
        </div>
      </div>

      {/* Volumetric Smoke */}
      <div className="launchpad-smoke-realistic absolute bottom-[-15%] w-[250%] h-1/2 bg-white rounded-full opacity-0" style={{ filter: "blur(80px)" }} />
      
      <style>{`
        .fire-inner-realistic {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 70%; height: 100%;
          background: linear-gradient(to top, white, #FFD700, transparent);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation: flicker 0.05s infinite alternate;
        }
        .fire-middle-realistic {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 100%; height: 90%;
          background: linear-gradient(to top, #FFA500, transparent);
          clip-path: polygon(50% 0%, 10% 100%, 90% 100%);
          animation: flicker 0.07s infinite alternate;
        }
        .fire-outer-realistic {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 150%; height: 70%;
          background: linear-gradient(to top, #FF4500, transparent);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          filter: blur(5px);
          animation: flicker 0.09s infinite alternate;
        }
        @keyframes flicker {
          from { transform: translateX(-50%) scale(1, 1); opacity: 1; }
          to { transform: translateX(-50%) scale(0.9, 1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Loader;