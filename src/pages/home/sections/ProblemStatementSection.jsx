import { memo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { problemSlides } from "@utils/constants";

gsap.registerPlugin(ScrollTrigger);

const FieryProblemCard = memo(({ slide }) => {
  return (
    <div
      className={`problem-card-container relative w-full rounded-3xl border-4 border-yellow-400/30 bg-gradient-to-br ${slide.gradient} overflow-hidden shadow-[0_0_80px_rgba(255,51,51,0.3)]`}
    >
      <div className="absolute top-5 right-5 flex gap-1.5 z-20">
        <div className="w-5 h-5 bg-yellow-400 rounded-full opacity-60 animate-flicker-fast" />
        <div className="w-5 h-5 bg-red-600 rounded-full opacity-40 animate-flicker-slow" />
      </div>
      <img
        src={slide.image}
        alt={slide.title}
        loading="lazy"
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
});

const ProblemStatementHeader = memo(() => (
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
));

const ProblemStatementSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(".problem-heading", {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 1,
        ease: "power3.out",
    }).from(".problem-slide", {
        opacity: 0,
        y: 80,
        scale: 0.9,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
    }, "-=0.5");

    // Parallax effect for the nebulas
    gsap.utils.toArray(".nebula").forEach(nebula => {
        gsap.to(nebula, {
            y: (i) => (i % 2 === 0 ? 100 : -100),
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            },
        });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <section
        id="problem"
        className="relative w-screen bg-black py-24 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div className="nebula nebula-1 absolute -top-40 -left-40 h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-red-700/45 via-yellow-500/20 to-transparent blur-[80px] animate-parallax-slow" />
          <div className="nebula nebula-2 absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-gradient-to-br from-orange-600/40 via-pink-600/20 to-transparent blur-[100px] animate-parallax-medium" />
          <div className="nebula nebula-3 absolute top-32 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-gradient-to-br from-indigo-700/40 via-purple-900/30 to-blue-700/20 blur-[80px] animate-parallax-fast" />
        </div>
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <ProblemStatementHeader />
          <div className="space-y-14 max-w-4xl mx-auto">
            {problemSlides.map((slide, i) => (
              <div
                key={i}
                className="problem-slide w-full max-w-[900px] mx-auto will-change-transform"
              >
                <FieryProblemCard slide={slide} />
              </div>
            ))}
            <div className="relative z-10 text-center px-4 mt-16">
              <div className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition cursor-pointer select-none">
                Act Now — Protect Their Future &#x1F6A8;
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes parallax-slow { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(100px, -150px) rotate(15deg); } }
        @keyframes parallax-medium { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-80px, -100px) rotate(-15deg); } }
        @keyframes parallax-fast { 0%, 100% { transform: translate(-50%, 0) rotate(0deg); } 50% { transform: translate(-50%, -80px) rotate(10deg); } }
        .animate-parallax-slow { animation: parallax-slow 25s infinite ease-in-out; }
        .animate-parallax-medium { animation: parallax-medium 20s infinite ease-in-out; }
        .animate-parallax-fast { animation: parallax-fast 15s infinite ease-in-out; }
        @keyframes flicker { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        .animate-flicker-fast { animation: flicker 1.5s infinite ease-in-out; }
        .animate-flicker-slow { animation: flicker 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default ProblemStatementSection;