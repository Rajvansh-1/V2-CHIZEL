import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Loader = ({ setIsLoading }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // For performance, we'll only animate transforms and opacity
    gsap.set(
      ".star, .chizel-rocket, .scene-container, .countdown-number, .liftoff-text, .ignition-flash, .launchpad-smoke > div",
      { willChange: "transform, opacity" }
    );

    const tl = gsap.timeline({
      onComplete: () => setIsLoading(false),
      delay: 0.5,
    });

    // --- COUNTDOWN SEQUENCE ---
    const countdownNumbers = gsap.utils.toArray(".countdown-number");
    countdownNumbers.forEach((num, i) => {
      tl.fromTo(
        num,
        { scale: 2, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          textShadow: "0 0 20px #fff, 0 0 50px #fff", // Enhanced glow
          duration: 0.7,
          ease: "power2.out",
        },
        i * 1 // Stagger the start time of each number
      ).to(
        num,
        { scale: 1.5, autoAlpha: 0, duration: 0.3, ease: "power2.in" },
        ">-0.1"
      );
    });

    // --- LIFTOFF TEXT ---
    tl.fromTo(
      ".liftoff-text",
      { scale: 0.5, autoAlpha: 0 },
      {
        scale: 1.2,
        autoAlpha: 1,
        textShadow: "0 0 30px #ffb347, 0 0 60px #ffb347", // Enhanced glow
        duration: 0.5,
        ease: "power2.out",
      }
    ).to(".liftoff-text", {
      scale: 2,
      autoAlpha: 0,
      duration: 0.4,
      ease: "power2.in",
    });

    // --- PRE-LAUNCH CAMERA MOVEMENT ---
    // A slow zoom-in to build anticipation
    tl.to(
      ".scene-container",
      { scale: 1.25, duration: 4.5, ease: "power1.in" },
      0 // Start this animation at the very beginning of the timeline
    );
    // Animate star parallax during the zoom
    tl.to(
      ".star-field",
      {
        y: (i, target) => `-${150 * parseFloat(target.dataset.speed)}px`,
        duration: 4.5,
        ease: "power1.in",
      },
      0
    );

    // --- IGNITION AND LAUNCH SEQUENCE ---
    tl.addLabel("ignition", "-=0.5") // Add a label to sync animations
      // 1. Ignition Flash
      .fromTo(
        ".ignition-flash",
        { autoAlpha: 0, scale: 2 },
        { autoAlpha: 0.8, duration: 0.1, ease: "power2.out" },
        "ignition"
      )
      .to(
        ".ignition-flash",
        { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" },
        ">"
      )
      // 2. Engine Fire & Smoke
      .to(
        ".rocket-fire",
        {
          autoAlpha: 1,
          scaleY: 1,
          duration: 0.4,
          ease: "power3.out",
        },
        "ignition"
      )
      .to(
        ".launchpad-smoke",
        {
          autoAlpha: 1,
          scale: 1.5, // Larger smoke plume
          duration: 2.5,
          ease: "power2.out",
        },
        "ignition"
      )
      // 3. Camera Shake
      .to(
        containerRef.current,
        {
          keyframes: [
            { x: -1, y: 1 },
            { x: 2, y: -1 },
            { x: -2, y: 2 },
            { x: 1, y: -2 },
            { x: 0, y: 0 },
          ],
          duration: 0.3,
          ease: "rough({ strength: 2, points: 10, template: none.out, taper: both, randomize: true, clamp: false})",
        },
        "ignition"
      )
      // 4. Liftoff
      .addLabel("liftoff", ">-0.2")
      .to(
        ".chizel-rocket",
        { y: "-120vh", duration: 2.5, ease: "power2.in" },
        "liftoff"
      )
      .to(
        ".scene-container",
        { y: "60vh", duration: 2.5, ease: "power2.in" },
        "liftoff"
      )
      .to(
        ".launchpad-smoke",
        {
          scale: 3,
          autoAlpha: 0,
          duration: 2.5,
          ease: "power2.in",
        },
        "liftoff"
      )
      // 5. Fade out the entire loader
      .to(
        containerRef.current,
        { autoAlpha: 0, duration: 1, ease: "power2.inOut" },
        ">-0.8"
      );
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex justify-center items-end bg-gradient-to-b from-[#01000c] via-[#020010] to-[#0a002c] text-white overflow-hidden"
    >
      {/* SVG filter for heat distortion effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="heat-shimmer">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.08"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* --- Starfield with Parallax Effect --- */}
      <div
        className="star-field absolute inset-0"
        data-speed="0.2"
      >
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={`star-slow-${i}`}
            className="star absolute w-px h-px bg-white rounded-full opacity-50"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`,
            }}
          />
        ))}
      </div>
      <div
        className="star-field absolute inset-0"
        data-speed="0.5"
      >
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={`star-mid-${i}`}
            className="star absolute w-0.5 h-0.5 bg-white rounded-full opacity-80"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${1.5 + Math.random() * 2}s infinite alternate`,
            }}
          />
        ))}
      </div>
      <div
        className="star-field absolute inset-0"
        data-speed="1"
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`star-fast-${i}`}
            className="star absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${1 + Math.random() * 1.5}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* --- UI Elements --- */}
      <div className="absolute inset-0 flex-center pointer-events-none z-30">
        <span className="countdown-number absolute font-black text-9xl text-white opacity-0">3</span>
        <span className="countdown-number absolute font-black text-9xl text-white opacity-0">2</span>
        <span className="countdown-number absolute font-black text-9xl text-white opacity-0">1</span>
        <span className="liftoff-text absolute font-black text-6xl md:text-9xl text-amber-400 opacity-0">
          LIFTOFF
        </span>
      </div>
      <div className="ignition-flash absolute inset-0 bg-gradient-radial from-white via-orange-300 to-transparent opacity-0 z-20" />


      {/* --- 3D Scene --- */}
      <div className="scene-container w-full h-full flex justify-center items-end" style={{ perspective: "800px" }}>
        
        {/* Launchpad Platform */}
        <div className="absolute bottom-0 w-[400px] h-[100px] border-t-4 border-gray-500 bg-gray-700 z-20" style={{ clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0% 100%)", transform: "rotateX(60deg) translateY(40px)" }}>
          <div className="w-full h-full bg-grid-pattern opacity-20" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 animate-pulse" />
        </div>

        {/* --- The Rocket --- */}
        <div className="chizel-rocket relative z-10 flex flex-col items-center w-28 md:w-32 mb-20">
          <div className="w-full h-24 bg-gradient-to-b from-gray-200 to-white shadow-md" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}>
            <div className="w-full h-full bg-gradient-to-b from-red-600 to-red-800" style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%), inset(0 0 50% 0)" }} />
          </div>
          <div className="w-full h-36 bg-gradient-to-r from-gray-100 to-gray-300 flex-center p-2 border-y border-gray-500 shadow-inner relative">
            <img src="/images/logo.png" alt="Chizel Logo" className="w-16 h-16 object-contain" />
          </div>
          <div className="relative w-full h-16 flex justify-center items-end">
            <div className="absolute bottom-0 w-[150%] h-14 flex justify-between">
              <div className="w-10 h-full bg-gradient-to-br from-red-800 to-red-600 shadow-md" style={{ clipPath: "polygon(100% 0, 0% 100%, 100% 100%)" }} />
              <div className="w-10 h-full bg-gradient-to-bl from-red-800 to-red-600 shadow-md" style={{ clipPath: "polygon(0% 0, 0% 100%, 100% 100%)" }} />
            </div>
            <div className="w-[70%] h-8 bg-gray-600 rounded-b-lg shadow-inner" />
          </div>
          
          {/* Engine Fire & Effects */}
          <div className="absolute -bottom-52 w-full h-52 origin-top">
            <div className="absolute inset-0 z-10" style={{ filter: "url(#heat-shimmer)" }} />
            <div className="rocket-fire absolute inset-0 opacity-0 scale-y-0 origin-top">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-gradient-to-t from-white via-yellow-300 to-transparent animate-flicker" style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)", animationDelay: "0s" }} />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-gradient-to-t from-orange-400 to-transparent animate-flicker" style={{ clipPath: "polygon(50% 100%, 10% 0, 90% 0)", animationDelay: "0.05s" }} />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[60%] bg-gradient-to-t from-red-500 to-transparent blur-md animate-flicker" style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)", animationDelay: "0.1s" }} />
            </div>
          </div>
        </div>

        {/* --- Volumetric Smoke --- */}
        <div className="launchpad-smoke absolute bottom-0 w-[500px] h-48 opacity-0 scale-0">
            <div className="absolute bottom-0 w-full h-full rounded-t-full bg-white blur-[60px] animate-pulse" style={{ animationDuration: '4s' }}/>
            <div className="absolute bottom-0 w-3/4 h-3/4 left-0 rounded-t-full bg-gray-300 blur-[40px] animate-pulse" style={{ animationDuration: '3s' }}/>
            <div className="absolute bottom-0 w-3/4 h-3/4 right-0 rounded-t-full bg-gray-300 blur-[40px] animate-pulse" style={{ animationDuration: '3.5s' }}/>
            <div className="absolute bottom-0 w-1/2 h-1/2 right-1/4 rounded-full bg-gray-200 blur-[50px] animate-pulse" style={{ animationDuration: '2.5s' }}/>
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        @keyframes flicker {
          0%, 100% { transform: scale(1, 1); opacity: 1; }
          50% { transform: scale(1.05, 0.9); opacity: 0.9; }
        }
        .animate-flicker { animation: flicker 0.08s infinite alternate; }
        @keyframes twinkle { 50% { opacity: 1; transform: scale(1.2); } }
        .bg-gradient-radial { background-image: radial-gradient(circle, var(--tw-gradient-stops)); }
      `}</style>
    </div>
  );
};

export default Loader;