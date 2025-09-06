import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Loader = ({ setIsLoading }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsLoading(false),
      delay: 0.5,
    });

    // Countdown sequence
    gsap.utils.toArray(".countdown-number").forEach((num) => {
      tl.fromTo(num, 
        { scale: 0.5, opacity: 0, filter: "blur(10px)" }, 
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power2.out" }
      )
      .to(num, 
        { scale: 1.5, opacity: 0, filter: "blur(10px)", duration: 0.3, ease: "power2.in" }, 
        "+=0.2"
      );
    });
    
    // Liftoff text
    tl.fromTo(".liftoff-text", 
      { scale: 0.8, opacity: 0 },
      { scale: 1.2, opacity: 1, duration: 0.5, ease: "power2.out" }
    )
    .to(".liftoff-text", { opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.2");

    // Rocket ignition and launch
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
      .to(".chizel-rocket-style", {
        y: "-150vh",
        rotation: 5, // Slight rotation for a dynamic feel
        duration: 2.5,
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
      <div className="absolute inset-0 opacity-60">
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 4 + 2}s infinite alternate`
            }}
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

      {/* The Styled Rocket */}
      <div className="chizel-rocket-style relative z-10 flex flex-col items-center w-36 md:w-48 mb-[-40px]">
        {/* Main body (white) */}
        <div className="w-full h-48 md:h-64 bg-gray-100 relative rounded-t-full">
            {/* Top Red Cone */}
            <div className="absolute -top-12 left-0 w-full h-24 bg-red-600 rounded-t-full" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
            {/* Window */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-500 rounded-full border-2 border-white shadow-inner" />
            {/* Chizel Logo - Can be placed here if desired */}
            {/* <img src="/images/logo.png" alt="Chizel Logo" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 object-contain" /> */}
        </div>
        {/* Mid-body connecting to fins (red) */}
        <div className="w-full h-16 md:h-20 bg-red-600 relative">
            {/* Smaller central engine cone (darker) */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-16 bg-gray-700" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
        </div>
        {/* Large Red Fins */}
        <div className="absolute bottom-16 w-[180%] h-32 flex justify-between">
            <div className="w-[40%] h-full bg-red-600 rounded-bl-full" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}/>
            <div className="w-[40%] h-full bg-red-600 rounded-br-full" style={{ clipPath: 'polygon(0% 0, 0% 100%, 100% 100%)' }}/>
        </div>
        {/* Engine Exhaust (below central engine cone) */}
        <div className="rocket-fire-realistic absolute -bottom-56 w-full h-56 opacity-0 scale-y-0 origin-top">
            <div className="fire-inner-realistic"></div>
            <div className="fire-middle-realistic"></div>
            <div className="fire-outer-realistic"></div>
        </div>
      </div>

      {/* Volumetric Smoke */}
      <div className="launchpad-smoke-realistic absolute bottom-[-20%] w-[300%] h-1/2 bg-white rounded-full opacity-0" style={{ filter: "blur(100px)" }} />
      
      <style>{`
        .fire-inner-realistic {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 80%; height: 100%;
          background: linear-gradient(to top, white, #FFD700, transparent);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation: flicker 0.05s infinite alternate;
        }
        .fire-middle-realistic {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 120%; height: 90%;
          background: linear-gradient(to top, #FFA500, transparent);
          clip-path: polygon(50% 0%, 10% 100%, 90% 100%);
          animation: flicker 0.07s infinite alternate;
        }
        .fire-outer-realistic {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 180%; height: 80%;
          background: linear-gradient(to top, #FF4500, transparent);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          filter: blur(8px);
          animation: flicker 0.09s infinite alternate;
        }
        @keyframes flicker {
          from { transform: translateX(-50%) scale(1, 1); opacity: 1; }
          to { transform: translateX(-50%) scale(0.95, 1.05); opacity: 0.85; }
        }
        @keyframes twinkle {
            from { opacity: 0; }
            to { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Loader;