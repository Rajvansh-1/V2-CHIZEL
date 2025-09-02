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

// --- Helper Components (Optimized) ---

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

const InfoCard = ({ card }) => {
  return (
    <div
      className="p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 h-full transform-gpu transition-transform hover:scale-105 duration-300 ease-out"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="text-3xl md:text-4xl text-primary shrink-0">{iconMap[card.icon]}</div>
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-white break-words">{card.title}</h3>
      </div>
      <ul className="space-y-3">
        {card.points.map((p, i) => (
          <li key={i} className="font-body text-gray-300 text-base md:text-lg flex leading-relaxed">
            <FaStar className="text-primary mt-1 mr-2 shrink-0" />
            <span className="min-w-0 break-words">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DemoPreview = () => {
  const [open, setOpen] = useState(true);
  return (
    // THEME COLOR FIX: Changed gradient to use theme colors
    <div className="verse-rest p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/10 backdrop-blur-md border border-primary/40 w-full shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-heading text-2xl md:text-3xl text-white">Interactive Demo</h3>
          <p className="text-gray-200 text-sm md:text-base">Experience the ChizelVerse right here.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button title={open ? "Hide" : "Show"} onClick={() => setOpen(v => !v)} />
          <a
            href="https://rajvansh-1.github.io/ChizelVerse/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/90 hover:text-white hover:border-white/40 transition"
          >
            Open in new tab <FaExternalLinkAlt />
          </a>
        </div>
      </div>
      {open && (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
          <div className="relative w-full aspect-[16/9]">
            <iframe
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


// --- Main Component ---

const ChizelverseCardsSection = () => {
  const containerRef = useRef(null);
  const introRef = useRef(null);
  const contentRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion) {
      gsap.set([introRef.current, contentRef.current, ".chizelverse-title", ".verse-rest"], { opacity: 1, y: 0, clipPath: "circle(100% at 50% 50%)" });
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
      .fromTo(".planet-layer", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 2, ease: "power3.inOut" }, "-=0.5");


    // --- Content Reveal Animation ---
    gsap.from(contentRef.current, {
        scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        duration: 1
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
        ease: "power3.out"
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
        stagger: 0.15
    });


  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  return (
    <div ref={containerRef}>
      {/* SECTION 1: The Cinematic Intro */}
      <section
        ref={introRef}
        className="relative h-screen w-full bg-black overflow-hidden"
      >
        {/* THEME COLOR FIX: Changed gradient to use theme colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/40" />
        <div className="cv-stars absolute inset-0" aria-hidden="true">
          {Array.from({ length: 60 }).map((_, i) => <span key={i} className="cv-star" />)}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center p-6 intro-text">
          <div className="text-center">
            {/* THEME COLOR FIX: Changed gradient to use theme colors */}
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
          <img src="/images/Chizel-verse-bg.jpg" alt="Chizelverse background" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      </section>

      {/* SECTION 2: The Main Content */}
      <section
        ref={contentRef}
        className="relative w-full bg-black overflow-hidden pb-16 md:pb-24"
        aria-label="ChizelVerse Content"
      >
        <div className="absolute inset-0">
            <img src="/images/Chizel-verse-bg.jpg" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="relative z-10 flex flex-col items-center p-4 sm:p-6 md:p-10 gap-6 md:gap-8">
          <div className="w-full max-w-screen-xl mx-auto space-y-6 md:space-y-10">
            {/* THEME COLOR FIX: Changed gradient to use theme colors */}
            <h2 className="chizelverse-title font-heading text-center text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Welcome To The ChizelVerse 🚀
            </h2>

            <DemoPreview />

            <div className="verse-rest grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {chizelverseInfo.map(card => <InfoCard key={card.title} card={card} />)}
            </div>

            <div className="verse-rest p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-full shadow-lg overflow-hidden">
              <ul className="flex flex-wrap justify-center gap-3 md:gap-6 mb-6 md:mb-8 border-b border-white/10 pb-4">
                {featuresData.map((f, i) => (
                  <li key={i} onMouseEnter={() => setActiveIndex(i)} onClick={() => setActiveIndex(i)} className="cursor-pointer text-center px-3 py-2 rounded-lg transition hover:bg-white/5">
                    <h3 className={`font-heading text-base sm:text-lg md:text-2xl transition ${activeIndex === i ? "text-primary scale-110 drop-shadow" : "text-gray-300 hover:text-white"}`}>
                      {f.title}
                    </h3>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/10">
                  <div className="relative w-full aspect-[16/10]">
                    {featuresData.map((f, i) => (
                      <img key={i} src={f.gifSrc} alt={f.title} loading="lazy" className={`absolute inset-0 w-full h-full object-contain p-4 transition duration-500 ${activeIndex === i ? "opacity-100" : "opacity-0"}`} />
                    ))}
                  </div>
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="relative min-h-[220px]">
                  {featuresData.map((f, i) => (
                    <div key={i} className={`absolute inset-0 flex flex-col justify-center transition duration-500 ${activeIndex === i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"}`}>
                      <p className="font-body text-gray-200 text-base md:text-lg leading-relaxed">{f.description}</p>
                      <div className="relative border-l-2 border-primary/40 pl-4 mt-3 bg-white/5 rounded-r-lg p-3">
                        <FaQuoteLeft className="absolute -top-1 -left-2 text-base text-primary/40" />
                        <blockquote className="font-body text-gray-300 italic text-sm md:text-base">“{f.quote}”</blockquote>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="verse-rest p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center w-full shadow-lg">
              <h3 className="font-heading text-xl md:text-3xl text-white">🌌 More Worlds Coming Soon...</h3>
              <p className="text-gray-300 mt-2 md:mt-3 text-base md:text-lg font-body">The ChizelVerse is always expanding. Stay tuned for new adventures!</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .cv-stars { position: absolute; width: 100%; height: 100%; overflow: hidden; }
        .cv-star { position: absolute; width: 2px; height: 2px; background: rgba(255,255,255,0.9); border-radius: 50%; animation: cv-twinkle calc(2s + 4s * var(--d, 0)) infinite ease-in-out; }
        .cv-stars .cv-star { left: calc(100% * var(--l, 0)); top: calc(100% * var(--t, 0)); }
        @keyframes cv-twinkle { 0%, 100% { opacity: 0.25; transform: scale(0.9);} 50% { opacity: 1; transform: scale(1.15);} }
      `}</style>
      <ScriptSetup />
    </div>
  );
};

const ScriptSetup = () => {
  useEffect(() => {
    const stars = document.querySelectorAll(".cv-stars .cv-star");
    stars.forEach(s => {
      s.style.setProperty("--l", Math.random().toString());
      s.style.setProperty("--t", Math.random().toString());
      s.style.setProperty("--d", Math.random().toString());
    });
  }, []);
  return null;
};

export default ChizelverseCardsSection;