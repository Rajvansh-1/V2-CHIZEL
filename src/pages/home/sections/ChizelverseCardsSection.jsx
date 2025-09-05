import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import { chizelverseInfo, featuresData } from "@utils/constants";
import {
  FaGamepad,
  FaUsers,
  FaLightbulb,
  FaPaintBrush,
  FaQuoteLeft,
  FaStar,
  FaRocket,
  FaExternalLinkAlt,
  FaExpand,
  FaCompress,
} from "react-icons/fa";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap = {
  gamepad: <FaGamepad />,
  users: <FaUsers />,
  lightbulb: <FaLightbulb />,
  paintbrush: <FaPaintBrush />,
};

// --- Helper Components (Optimized & Enhanced) ---

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReduced(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return reduced;
};

const TiltCard = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const containerRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (event) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 15; // Reduced intensity for a subtler effect
    const tiltY = (relativeX - 0.5) * -15;
    setTransformStyle(
      `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

const InfoCard = ({ card }) => {
  return (
    <TiltCard className="h-full group">
      <div className="relative p-6 md:p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 h-full transform-gpu transition-all duration-300 ease-out overflow-hidden shadow-lg shadow-black/30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-indigo-500 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-5 transform transition-transform duration-500 group-hover:-translate-y-1">
            <div className="text-4xl md:text-5xl text-cyan-400 shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">{iconMap[card.icon]}</div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-white break-words">{card.title}</h3>
          </div>
          <ul className="space-y-3">
            {card.points.map((p, i) => (
              <li key={i} className="font-body text-gray-300 text-base md:text-lg flex leading-relaxed transition-all duration-300 group-hover:text-white group-hover:pl-2">
                <FaStar className="text-cyan-400 mt-1 mr-3 shrink-0 transition-colors duration-300 group-hover:text-amber-400" />
                <span className="min-w-0 break-words">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TiltCard>
  );
};

const DemoPreview = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);

  const toggleFullscreen = () => {
    if (!iframeRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      iframeRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting full-screen: ${err.message} (${err.name})`);
      });
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="verse-rest p-1 rounded-2xl bg-gradient-to-br from-cyan-500/40 via-indigo-600/40 to-blue-700/40 w-full shadow-2xl shadow-blue-500/10">
      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[15px] p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-heading text-2xl md:text-3xl text-white">Interactive Demo</h3>
            <p className="text-gray-300 text-sm md:text-base">Experience the ChizelVerse right here.</p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-3 w-full md:w-auto">
             <Button
              title={isFullscreen ? "Exit" : "Fullscreen"}
              onClick={toggleFullscreen}
              leftIcon={isFullscreen ? <FaCompress /> : <FaExpand />}
              containerClass="!bg-indigo-600 hover:!bg-indigo-500 w-full sm:w-auto justify-center col-span-1"
            />
            <a
              href="https://rajvansh-1.github.io/ChizelVerse/"
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-1 inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-full bg-white/10 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-white/20"
              aria-label="Open Demo in new tab"
            >
              <span className="hidden sm:inline">New Tab</span>
               <span className="sm:hidden">New Tab</span>
              <FaExternalLinkAlt />
            </a>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-[16/9] shadow-inner shadow-black/50">
          <iframe
            ref={iframeRef}
            title="ChizelVerse Demo"
            src="https://rajvansh-1.github.io/ChizelVerse/"
            loading="lazy"
            className="w-full h-full"
            allow="fullscreen; autoplay; clipboard-read; clipboard-write"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureDisplay = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const indicatorRef = useRef(null);
    const tabsRef = useRef([]);
  
    useEffect(() => {
      const activeTab = tabsRef.current[activeIndex];
      if (activeTab && indicatorRef.current) {
        gsap.to(indicatorRef.current, {
          x: activeTab.offsetLeft,
          width: activeTab.offsetWidth,
          duration: 0.5,
          ease: 'power3.inOut'
        });
      }
    }, [activeIndex]);
  
    return (
      <div className="verse-rest p-1 rounded-2xl bg-gradient-to-br from-cyan-500/40 via-indigo-600/40 to-blue-700/40 w-full shadow-2xl shadow-blue-500/10">
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[15px] p-6 md:p-8">
          <div className="relative mb-6 md:mb-8">
            <div ref={indicatorRef} className="absolute -bottom-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.7)]"></div>
            <ul className="flex flex-wrap justify-center gap-3 md:gap-6 border-b border-white/10 pb-4">
              {featuresData.map((f, i) => (
                <li
                  key={i}
                  ref={el => tabsRef.current[i] = el}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  className="cursor-pointer text-center px-3 py-2 rounded-lg transition-colors"
                >
                  <h3 className={`font-heading text-base sm:text-lg md:text-2xl transition-all duration-300 ${activeIndex === i ? "text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]" : "text-gray-300 hover:text-white"}`}>
                    {f.title}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="relative rounded-xl overflow-hidden bg-black/30 border border-white/10 shadow-lg">
               <div className="w-full aspect-[16/10]">
                {featuresData.map((f, i) => (
                  <img key={i} src={f.gifSrc} alt={f.title} loading="lazy" className={`absolute inset-0 w-full h-full object-contain p-2 sm:p-4 transition-opacity duration-500 ease-in-out ${activeIndex === i ? "opacity-100" : "opacity-0"}`} />
                ))}
              </div>
            </div>
            <div className="relative min-h-[260px] sm:min-h-[240px]">
              {featuresData.map((f, i) => (
                <div key={i} className={`absolute inset-0 flex flex-col justify-center transition-all duration-500 ease-in-out ${activeIndex === i ? "opacity-100 transform-none" : "opacity-0 translate-x-4 pointer-events-none"}`}>
                  <p className="font-body text-gray-200 text-base md:text-lg leading-relaxed">{f.description}</p>
                  <div className="relative border-l-4 border-cyan-400/50 pl-4 mt-4 bg-white/5 p-4 rounded-r-lg">
                    <FaQuoteLeft className="absolute -top-2 left-2 text-xl text-cyan-400/40 opacity-50" />
                    <blockquote className="font-body text-gray-300 italic text-sm md:text-base">“{f.quote}”</blockquote>
                    <cite className="block text-right text-cyan-400/80 text-sm mt-2 not-italic">- {f.author}</cite>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
};

// --- Main Component ---

const ChizelverseCardsSection = () => {
  const containerRef = useRef(null);
  const introRef = useRef(null);
  const contentRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set([introRef.current, contentRef.current, ".chizelverse-title", ".verse-rest"], {
          opacity: 1,
          y: 0,
          clipPath: "circle(100% at 50% 50%)",
        });
        return;
      }

      // --- Cinematic Intro Animation ---
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top top",
          end: "bottom top", // Changed end to fix double scroll
          scrub: 1,
          pin: true,
        },
      });

      introTl
        .fromTo(".intro-text", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" })
        .to(".intro-text", { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in" }, "+=0.5")
        .fromTo(".planet-layer", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 1, ease: "power3.inOut" }, "-=0.3");

      // --- Content Reveal Animation ---
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        duration: 1,
      });

      gsap.from(".chizelverse-title", {
        scrollTrigger: {
          trigger: ".chizelverse-title",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".verse-rest", {
        scrollTrigger: {
          trigger: ".chizelverse-title",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );
  
  // Component that sets random star positions. Runs once.
  const StarField = ({ count = 60 }) => {
    useEffect(() => {
        const stars = document.querySelectorAll(".cv-star");
        stars.forEach(star => {
            star.style.setProperty("--l", `${Math.random() * 100}%`);
            star.style.setProperty("--t", `${Math.random() * 100}%`);
            star.style.setProperty("--d", `${Math.random() * 4 + 2}s`); // duration
            star.style.setProperty("--s", `${Math.random() * 1.5 + 0.5}px`); // size
        });
    }, [count]);

    return (
        <div className="cv-stars absolute inset-0" aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => <span key={i} className="cv-star" />)}
        </div>
    );
  };


  return (
    <div ref={containerRef} className="bg-space-dark">
      {/* SECTION 1: The Cinematic Intro - Original Background */}
      <section ref={introRef} className="relative h-screen w-full bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900/50 to-black" />
        <StarField count={80} />

        <div className="absolute inset-0 flex items-center justify-center p-6 intro-text">
          <div className="text-center">
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.5)] mb-3">
              Entering ChizelVerse
            </h2>
            <div className="flex items-center justify-center gap-2 md:gap-3 text-white/80">
              <FaRocket className="text-lg md:text-xl animate-pulse" />
              <span className="text-sm md:text-lg font-body">Initializing portal...</span>
            </div>
          </div>
        </div>
        
        {/* Planet Layer to reveal the new background */}
        <div className="planet-layer absolute inset-0" style={{ clipPath: "circle(0% at 50% 50%)" }}>
           <div className="absolute inset-0 bg-space-dark" />
           <div className="absolute -bottom-1/2 w-full h-full bg-radial-nebula opacity-50" />
           <StarField count={100} />
        </div>
      </section>

      {/* SECTION 2: The Main Content - New Space Background */}
      <section ref={contentRef} className="relative w-full bg-space-dark overflow-hidden pb-16 md:pb-24" aria-label="ChizelVerse Content">
        <div className="absolute inset-0 bg-space-dark" />
        <div className="absolute top-0 w-full h-full bg-radial-nebula opacity-30" />
        <StarField count={100} />

        <div className="relative z-10 flex flex-col items-center p-4 sm:p-6 md:p-10 gap-8 md:gap-12">
          <div className="w-full max-w-screen-xl mx-auto space-y-8 md:space-y-12">
            <div className="relative w-full flex justify-center items-center group">
              <h2 className="chizelverse-title relative font-heading text-4xl md:text-6xl font-bold 
                bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 
                bg-clip-text text-transparent overflow-hidden">
                Welcome To The ChizelVerse
                <div className="shine-effect absolute top-0 -left-full w-full h-full 
                  bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              </h2>
              <span className="text-3xl md:text-5xl ml-2 md:ml-4 animate-rocket-bounce" style={{ display: "inline-block" }}>
                🚀
              </span>
            </div>

            <DemoPreview />

            <div className="verse-rest grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {chizelverseInfo.map((card) => (
                <InfoCard key={card.title} card={card} />
              ))}
            </div>

            <FeatureDisplay />

            <TiltCard className="w-full verse-rest">
              <div className="relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-xl border border-blue-500/40 text-center w-full shadow-2xl shadow-blue-500/10 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="absolute w-px h-px bg-white rounded-full" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`}}/>
                  ))}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <FaRocket className="text-5xl md:text-6xl text-cyan-400 mx-auto animate-float drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]" />
                  </div>
                  <h3 className="font-heading text-3xl md:text-4xl text-white drop-shadow-lg">
                    The ChizelVerse is Expanding...
                  </h3>
                  <p className="text-gray-200 mt-3 md:mt-4 text-base md:text-lg font-body max-w-md mx-auto">
                    Our Developer is working really hard to bring an unimaginable experience in your devices <br />STAY TUNE WITH US!
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Global styles for dynamic effects */}
      <style jsx global>{`
        :root {
          --color-space-dark: #020010;
        }
        .bg-space-dark {
          background-color: var(--color-space-dark);
        }
        .bg-radial-nebula {
          background-image: radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.15), transparent 40%),
                            radial-gradient(circle at 80% 30%, rgba(129, 140, 248, 0.15), transparent 40%);
        }
        .cv-star {
          position: absolute;
          left: var(--l);
          top: var(--t);
          width: var(--s);
          height: var(--s);
          background: white;
          border-radius: 50%;
          animation: cv-twinkle var(--d) infinite ease-in-out;
          will-change: opacity, transform;
        }
        @keyframes cv-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-float {
            animation: float 6s infinite ease-in-out;
        }
        @keyframes rocket-bounce {
          0%, 100% { transform: translateY(0) rotate(-15deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-rocket-bounce {
          animation: rocket-bounce 2.5s infinite ease-in-out;
        }
        .shine-effect {
          animation: shine-sweep 3s infinite linear;
          will-change: transform;
        }
        @keyframes shine-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .group:hover .shine-effect {
          animation-duration: 1.5s;
        }
      `}</style>
    </div>
  );
};

export default ChizelverseCardsSection;