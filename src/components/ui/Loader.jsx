// src/components/ui/Loader.jsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Loader = ({ setIsLoading }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsLoading(false),
      delay: 0.2,
    });

    // Countdown sequence (lasts ~2.9s)
    gsap.utils.toArray(".countdown-number").forEach((num, i) => {
      tl.fromTo(num, 
        { scale: 2, opacity: 0, textShadow: "0 0 0px #fff" }, 
        { scale: 1, opacity: 1, textShadow: "0 0 20px #fff", duration: 0.7, ease: "power2.out" },
        i * 1 // Stagger each number by 1 second
      )
      .to(num, 
        { scale: 1.5, opacity: 0, duration: 0.3, ease: "power2.in" }, 
        ">-0.1" // Fade out slightly faster
      );
    });
    
    // Pre-ignition camera zoom
    tl.to(".scene-container", { scale: 1.25, duration: 3.5, ease: "power1.in" }, 0);
    
    // Ignition, shake, and launch sequence starts immediately after the countdown
    tl.addLabel("ignition", "-=0.2") // Start ignition just as the last number fades
      .to(".rocket-fire", {
        opacity: 1,
        scaleY: 1,
        duration: 0.4,
        ease: "power3.out",
      }, "ignition")
      .to(".launchpad-smoke", {
        opacity: 1,
        scale: 1.5,
        duration: 2,
        ease: "power2.out",
      }, "ignition")
      .to(containerRef.current, {
        keyframes: [
          { x: -2, y: 2, duration: 0.05 }, { x: 2, y: -2, duration: 0.05 }
        ],
        repeat: 20,
      }, "ignition")
      .addLabel("liftoff", ">-0.2")

      // CORRECTED LIFTOFF: Rocket and camera move together for a full screen ascent
      .to(".chizel-rocket", {
        y: "-100vh", // Rocket travels the full screen height
        duration: 2.0, 
        ease: "power2.in",
      }, "liftoff")
      .to(".scene-container", {
        y: "50vh", // Camera pans down to follow the rocket up
        duration: 2.0,
        ease: "power2.in",
      }, "liftoff")

      .to(".launchpad-smoke", {
        scale: 3,
        opacity: 0,
        duration: 2,
        ease: "power2.in",
      }, "liftoff")
      .to(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      }, ">-0.8"); // Fade out as the rocket leaves

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex justify-center items-end bg-[#020010] text-text overflow-hidden"
    >
      {/* Starfield */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="star absolute w-px h-[1px] bg-white rounded-full opacity-50"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Countdown Text */}
      <div className="absolute inset-0 flex-center pointer-events-none z-30">
        <span className="countdown-number absolute font-heading text-9xl text-white font-black opacity-0">3</span>
        <span className="countdown-number absolute font-heading text-9xl text-white font-black opacity-0">2</span>
        <span className="countdown-number absolute font-heading text-9xl text-white font-black opacity-0">1</span>
      </div>

      <div className="scene-container w-full h-full flex justify-center items-end">
          {/* Launchpad Structure */}
          <div className="absolute bottom-0 w-[400px] h-[100px] border-t-4 border-gray-500 bg-gray-700 z-20" style={{clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)'}}>
            <div className="w-full h-full bg-repeat-x opacity-20" style={{backgroundImage: 'linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(180deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
          </div>

          {/* The Rocket */}
          <div className="chizel-rocket relative z-10 flex flex-col items-center w-28 md:w-32 mb-20">
            <div className="w-full h-24 bg-gradient-to-b from-white to-gray-300 shadow-md" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
            <div className="w-full h-36 bg-gradient-to-r from-gray-200 to-gray-400 flex-center p-2 border-y border-gray-500 shadow-inner">
              <img src="/images/logo.png" alt="Chizel Logo" className="w-16 h-16 object-contain" />
            </div>
            <div className="relative w-full h-16 flex justify-center items-end">
              <div className="absolute bottom-0 w-[150%] h-14 flex justify-between">
                <div className="w-10 h-full bg-gradient-to-br from-red-800 to-red-600 shadow-md" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}/>
                <div className="w-10 h-full bg-gradient-to-bl from-red-800 to-red-600 shadow-md" style={{ clipPath: 'polygon(0% 0, 0% 100%, 100% 100%)' }}/>
              </div>
              <div className="w-[70%] h-8 bg-gray-600 rounded-b-lg shadow-inner" />
            </div>
            {/* Engine Fire */}
            <div className="rocket-fire absolute -bottom-48 w-full h-48 opacity-0 scale-y-0 origin-top blur-sm">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-gradient-to-t from-white via-yellow-300 to-transparent animate-flicker" style={{clipPath: 'polygon(50% 100%, 0 0, 100% 0)', animationDelay: '0s'}}/>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-gradient-to-t from-orange-400 to-transparent animate-flicker" style={{clipPath: 'polygon(50% 100%, 10% 0, 90% 0)', animationDelay: '0.05s'}}/>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[60%] bg-gradient-to-t from-red-500 to-transparent blur-md animate-flicker" style={{clipPath: 'polygon(50% 100%, 0 0, 100% 0)', animationDelay: '0.1s'}}/>
            </div>
          </div>

          {/* Volumetric Smoke */}
          <div className="launchpad-smoke absolute bottom-0 w-[400px] h-48 rounded-t-full bg-white opacity-0" style={{ filter: "blur(60px)" }} />
      </div>
      
      <style>{`
        @keyframes flicker {
          0%, 100% { transform: scale(1, 1); opacity: 1; }
          50% { transform: scale(1.05, 0.9); opacity: 0.9; }
        }
        .animate-flicker { animation: flicker 0.08s infinite alternate; }
        @keyframes twinkle { 50% { opacity: 1; transform: scale(1.5); } }
      `}</style>
    </div>
  );
};

export default Loader;