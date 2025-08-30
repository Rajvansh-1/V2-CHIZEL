// src/pages/home/sections/ProblemStatementSection.jsx

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { problemSlides } from "@utils/constants";

gsap.registerPlugin(ScrollTrigger);

const FieryProblemCard = ({ slide }) => {
  // The card component itself remains the same, as its styling is already excellent.
  return (
    <div
      className={`problem-card-container relative w-full rounded-3xl border-4 border-yellow-400/30 bg-gradient-to-br ${slide.gradient} backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(255,51,51,0.3)]`}
    >
      <div className="absolute top-5 right-5 flex gap-1 z-20">
        <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-60 animate-ping" />
        <div className="w-6 h-6 bg-red-600 rounded-full opacity-40 animate-pulse delay-200" />
      </div>
      
      <div className="absolute left-0 right-0 bottom-0 h-4 bg-gradient-to-r from-red-700 via-yellow-400 to-indigo-800 opacity-35 blur-sm z-10" />

      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-72 md:h-80 lg:h-96 object-cover object-center rounded-t-3xl border-b-4 border-yellow-500/40"
      />
      
      <div className="p-8 md:p-10 bg-black/80">
        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-red-600 to-indigo-700 border border-red-700 text-white font-bold text-base uppercase tracking-widest shadow-lg">
          {slide.badge}
        </span>
        <h3 className="mt-6 font-heading text-3xl md:text-4xl lg:text-5xl text-yellow-400 font-black tracking-tight drop-shadow-lg">
          {slide.title}
        </h3>
        <p className="mt-3 font-heading text-xl md:text-2xl lg:text-3xl text-red-600 bg-gradient-to-r from-yellow-300 via-red-600 to-indigo-800 bg-clip-text text-transparent font-bold drop-shadow-lg">
          {slide.highlight}
        </p>
        <p className="mt-5 font-body text-lg md:text-xl text-gray-100 max-w-2xl font-bold border-l-4 border-yellow-400 pl-5">
          {slide.description}
        </p>
      </div>
    </div>
  );
};


const ProblemStatementSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1, // Tie animations directly to scroll position
        }
    });

    // Animate the background nebulae with parallax
    tl.to(".nebula-1", { y: -200, x: 100, rotation: 20 }, 0);
    tl.to(".nebula-2", { y: -150, x: -100, rotation: -20 }, 0);
    tl.to(".nebula-3", { y: -100, rotation: 10 }, 0);

    // Animate the heading with a subtle zoom and fade
    gsap.from(".problem-heading", {
      scrollTrigger: {
        trigger: ".problem-heading",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: "power3.out",
    });

    // Animate each card floating into view
    gsap.utils.toArray(".problem-slide").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        scale: 0.8,
        rotationX: -20,
        y: 100,
        duration: 1,
        ease: "power3.out",
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ perspective: '1000px' }}>
      <section
        id="problem"
        className="relative w-screen bg-black py-24 overflow-hidden"
      >
        {/* Fiery Space Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="nebula-1 absolute -top-40 -left-40 h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-red-700/45 via-yellow-500/20 to-transparent blur-[80px]" />
          <div className="nebula-2 absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-gradient-to-br from-orange-600/40 via-pink-600/20 to-transparent blur-[100px]" />
          <div className="nebula-3 absolute top-32 left-1/2 transform -translate-x-1/2 h-60 w-60 rounded-full bg-gradient-to-br from-indigo-700/40 via-purple-900/30 to-blue-700/20 blur-[80px]" />
        </div>

        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="problem-heading text-center mb-16 space-y-6">
            <p className="font-bold text-lg uppercase tracking-widest text-red-600 mb-2">
              EXTREME WARNING
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-gradient-to-r from-red-600 via-yellow-400 to-indigo-800 bg-clip-text drop-shadow-lg">
              Every Second is a Disaster
            </h2>
            <p className="mt-4 text-2xl text-white font-semibold font-heading">
              Act now or your child’s spark will vanish forever.
            </p>
          </div>
          <div className="space-y-14 max-w-4xl mx-auto">
            {problemSlides.map((slide, i) => (
              <div
                key={i}
                className="problem-slide w-full max-w-[900px] mx-auto"
              >
                <FieryProblemCard slide={slide} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProblemStatementSection;