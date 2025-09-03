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

  const handleMouseMove = (event) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 20;
    const tiltY = (relativeX - 0.5) * -20;
    setTransformStyle(
      `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
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
      }}
    >
      {children}
    </div>
  );
};

const InfoCard = ({ card }) => {
  return (
    <TiltCard className="h-full group">
      <div className="relative p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 h-full transform-gpu transition-all duration-300 ease-out overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-accent to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-5 transform transition-transform duration-500 group-hover:-translate-y-1">
            <div className="text-4xl md:text-5xl text-primary shrink-0 transition-transform duration-300 group-hover:scale-110">{iconMap[card.icon]}</div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-white break-words">{card.title}</h3>
          </div>
          <ul className="space-y-3">
            {card.points.map((p, i) => (
              <li key={i} className="font-body text-gray-300 text-base md:text-lg flex leading-relaxed transition-all duration-300 group-hover:text-white group-hover:pl-2">
                <FaStar className="text-primary mt-1 mr-3 shrink-0 transition-colors duration-300 group-hover:text-badge-bg" />
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
  const [open, setOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);

  const toggleFullscreen = () => {
    if (!iframeRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      iframeRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="verse-rest p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/10 backdrop-blur-md border border-primary/40 w-full shadow-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-heading text-2xl md:text-3xl text-white">Interactive Demo</h3>
          <p className="text-gray-200 text-sm md:text-base">Experience the ChizelVerse right here.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button title={open ? "Hide" : "Show"} onClick={() => setOpen((v) => !v)} containerClass="w-full sm:w-auto justify-center" />
          <Button
            title={isFullscreen ? "Exit" : "Fullscreen"}
            onClick={toggleFullscreen}
            rightIcon={isFullscreen ? <FaCompress /> : <FaExpand />}
            containerClass="!bg-accent w-full sm:w-auto justify-center"
          />
          <a
            href="https://rajvansh-1.github.io/ChizelVerse/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-xl border border-white/20 text-white/90 hover:text-white hover:border-white/40 transition"
            aria-label="Open Demo in new tab"
          >
            <span className="sm:hidden">New Tab</span>
            <span className="hidden sm:inline">Open in new tab</span>
            <FaExternalLinkAlt />
          </a>
        </div>
      </div>
      {open && (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
          <div className="relative w-full aspect-[16/9]">
            <iframe
              ref={iframeRef}
              title="ChizelVerse Demo"
              src="https://rajvansh-1.github.io/ChizelVerse/"
              loading="lazy"
              className="absolute inset-0 w-full h-full"
              allow="fullscreen; autoplay; clipboard-read; clipboard-write"
            />
          </div>
        </div>
      )}
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
          duration: 0.4,
          ease: 'power3.inOut'
        });
      }
    }, [activeIndex]);
  
    return (
      <div className="verse-rest p-1 rounded-2xl bg-gradient-to-br from-primary/30 via-accent/30 to-primary/30 w-full shadow-2xl shadow-primary/10">
        <div className="bg-card/80 backdrop-blur-xl rounded-[15px] p-6 md:p-8">
          <div className="relative mb-6 md:mb-8">
            <div ref={indicatorRef} className="absolute bottom-0 h-1 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]"></div>
            <ul className="flex flex-wrap justify-center gap-3 md:gap-6 border-b border-white/10 pb-4">
              {featuresData.map((f, i) => (
                <li
                  key={i}
                  ref={el => tabsRef.current[i] = el}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  className="cursor-pointer text-center px-3 py-2 rounded-lg transition"
                >
                  <h3 className={`font-heading text-base sm:text-lg md:text-2xl transition-all duration-300 ${activeIndex === i ? "text-primary scale-110 drop-shadow" : "text-gray-300 hover:text-white"}`}>
                    {f.title}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="relative rounded-xl overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10 rounded-xl"></div>
               <div className="absolute inset-0 bg-black/40 rounded-xl group-hover:bg-black/20 transition-colors"></div>
               <div className="relative w-full aspect-[16/10]">
                {featuresData.map((f, i) => (
                  <img key={i} src={f.gifSrc} alt={f.title} loading="lazy" className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-500 ${activeIndex === i ? "opacity-100" : "opacity-0"}`} />
                ))}
              </div>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
            </div>
            <div className="relative min-h-[240px]">
              {featuresData.map((f, i) => (
                <div key={i} className={`absolute inset-0 flex flex-col justify-center transition-all duration-500 ${activeIndex === i ? "opacity-100 transform-none" : "opacity-0 translate-x-3"}`}>
                  <p className="font-body text-gray-200 text-base md:text-lg leading-relaxed">{f.description}</p>
                  <div className="relative border-l-4 border-primary/40 pl-4 mt-4 bg-white/5 p-4 rounded-r-lg">
                    <FaQuoteLeft className="absolute -top-2 left-2 text-xl text-primary/40 opacity-50" />
                    <blockquote className="font-body text-gray-300 italic text-sm md:text-base">“{f.quote}”</blockquote>
                    <cite className="block text-right text-primary/80 text-sm mt-2 not-italic"> - {f.author}</cite>
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
          end: "+=1500",
          scrub: 1,
          pin: true,
        },
      });

      introTl
        .fromTo(".intro-text", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" })
        .to(".intro-text", { opacity: 0, scale: 0.8, duration: 0.5, ease: "power2.in" }, "+=0.5")
        .fromTo(
          ".planet-layer",
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(75% at 50% 50%)", duration: 2, ease: "power3.inOut" },
          "-=0.5"
        );

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

  return (
    <div ref={containerRef}>
      {/* SECTION 1: The Cinematic Intro */}
      <section ref={introRef} className="relative h-screen w-full bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/40" />
        <div className="cv-stars absolute inset-0" aria-hidden="true">
          {Array.from({ length: 60 }).map((_, i) => (
            <span key={i} className="cv-star" />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-6 intro-text">
          <div className="text-center">
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-2xl mb-3">
              Entering ChizelVerse
            </h2>
            <div className="flex items-center justify-center gap-2 md:gap-3 text-white/80">
              <FaRocket className="text-lg md:text-xl animate-pulse" />
              <span className="text-sm md:text-lg font-body">Initializing portal...</span>
            </div>
          </div>
        </div>

        <div className="planet-layer absolute inset-0" style={{ clipPath: "circle(0% at 50% 50%)" }}>
          <img
            src="/images/Chizel-verse-bg.jpg"
            alt="Chizelverse background"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      </section>

      {/* SECTION 2: The Main Content */}
      <section ref={contentRef} className="relative w-full bg-black overflow-hidden pb-16 md:pb-24" aria-label="ChizelVerse Content">
        <div className="absolute inset-0">
          <img src="/images/Chizel-verse-bg.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="relative z-10 flex flex-col items-center p-4 sm:p-6 md:p-10 gap-6 md:gap-8">
          <div className="w-full max-w-screen-xl mx-auto space-y-6 md:space-y-10">
            <h2 className="chizelverse-title font-heading text-center text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Welcome To The ChizelVerse 🚀
            </h2>

            <DemoPreview />

            <div className="verse-rest grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {chizelverseInfo.map((card) => (
                <InfoCard key={card.title} card={card} />
              ))}
            </div>

            <FeatureDisplay />

            <TiltCard className="w-full">
              <div className="relative verse-rest p-8 md:p-10 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/10 backdrop-blur-xl border border-accent/40 text-center w-full shadow-2xl shadow-accent/10 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-px h-px bg-white rounded-full"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>

                <div className="relative z-10">
                  <div className="mb-4">
                    <FaRocket className="text-5xl md:text-6xl text-badge-bg mx-auto animate-float" />
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

      <style jsx global>{`
        .cv-stars {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .cv-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          animation: cv-twinkle calc(2s + 4s * var(--d, 0)) infinite ease-in-out;
        }
        .cv-stars .cv-star {
          left: calc(100% * var(--l, 0));
          top: calc(100% * var(--t, 0));
        }
        @keyframes cv-twinkle {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(-5deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-float {
            animation: float 6s infinite ease-in-out;
        }
      `}</style>
      <ScriptSetup />
    </div>
  );
};

const ScriptSetup = () => {
  useEffect(() => {
    const stars = document.querySelectorAll(".cv-stars .cv-star");
    stars.forEach((s) => {
      s.style.setProperty("--l", Math.random().toString());
      s.style.setProperty("--t", Math.random().toString());
      s.style.setProperty("--d", Math.random().toString());
    });
  }, []);
  return null;
};

export default ChizelverseCardsSection;