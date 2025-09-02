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

// IMPORTANT: register once in the app entry too; keeping here for isolation
if (typeof window !== "undefined" && gsap.core) {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap = {
  gamepad: <FaGamepad />,
  users: <FaUsers />,
  lightbulb: <FaLightbulb />,
  paintbrush: <FaPaintBrush />,
};

/**
 * Small helper: respects prefers-reduced-motion
 */
const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
};

/** Particle Field (lightweight, auto-disabled on mobile) */
const ParticleField = ({ isActive }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Clear
    el.innerHTML = "";

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 16 : 36;

    const nodes = [];
    for (let i = 0; i < count; i++) {
      const d = document.createElement("div");
      d.className = "cv-particle";
      d.style.left = Math.random() * 100 + "%";
      d.style.top = Math.random() * 100 + "%";
      el.appendChild(d);
      nodes.push(d);
    }

    if (isActive) {
      nodes.forEach((n) => {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        gsap.fromTo(
          n,
          {
            x: 0,
            y: 0,
            scale: gsap.utils.random(0.6, 1.6),
            opacity: gsap.utils.random(0.3, 0.8),
          },
          {
            x: x - n.getBoundingClientRect().x,
            y: y - n.getBoundingClientRect().y,
            scale: 0,
            opacity: 0,
            duration: gsap.utils.random(1.2, 2.2),
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            repeatDelay: gsap.utils.random(0.3, 1.2),
          }
        );
      });
    }

    return () => {
      nodes.forEach((n) => n.remove());
      gsap.killTweensOf(nodes);
    };
  }, [isActive]);

  return <div ref={ref} className="pointer-events-none absolute inset-0" />;
};

/*** Card (with safe 3D hover on desktop only) ***/
const InfoCard = ({ card }) => {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const onEnter = () => {
        gsap.to(el, {
          scale: 1.02,
          y: -5,
          rotationX: 2,
          rotationY: 2,
          duration: 0.25,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(el, {
          scale: 1,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          duration: 0.25,
          ease: "power2.out",
        });
      };
      if (window.innerWidth >= 1024) {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      }
      return () => {
        el.removeEventListener?.("mouseenter", onEnter);
        el.removeEventListener?.("mouseleave", onLeave);
      };
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className="p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 h-full transform-gpu overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="text-3xl md:text-4xl text-primary shrink-0">{iconMap[card.icon]}</div>
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-white break-words">
          {card.title}
        </h3>
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

/*** Inline demo preview (fix: demo visibly on screen) ***/
const DemoPreview = () => {
  const [open, setOpen] = useState(true); // default open so it's visible immediately
  return (
    <div className="verse-rest p-6 md:p-8 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-500/10 backdrop-blur-md border border-primary/40 w-full shadow-lg">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-heading text-2xl md:text-3xl text-white">Interactive Demo</h3>
          <p className="text-gray-200 text-sm md:text-base">Experience the ChizelVerse right here.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button title={open ? "Hide" : "Show"} onClick={() => setOpen((v) => !v)} />
          <a
            href="https://rajvansh-1.github.io/ChizelVerse/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/90 hover:text-white hover:border-white/40 transition"
          >
            Open in new tab <FaExternalLinkAlt />
          </a>
        </div>
      </div>
      {open && (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
          {/* Aspect-ratio to stop cutting on phones */}
          <div className="relative w-full aspect-[16/9] md:aspect-[16/8]">
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

const ChizelverseCardsSection = () => {
  const containerRef = useRef(null);
  const planetRef = useRef(null);
  const contentRef = useRef(null);
  const titleWrapRef = useRef(null);
  const spaceRef = useRef(null);
  const atmosphereRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEntering, setIsEntering] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Core animation and logical flow
  useGSAP(
    () => {
      if (prefersReducedMotion) {
        // No pinning or heavy motion: show content immediately in order
        gsap.set(contentRef.current, { opacity: 1, clearProps: "all" });
        gsap.set(".chizelverse-title", { opacity: 1, y: 0 });
        gsap.set(".verse-rest", { opacity: 1, y: 0 });
        return;
      }

      // Different behavior for desktop vs mobile to avoid cutting/overflow
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "+=4500",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => setIsEntering(self.progress > 0.15 && self.progress < 0.55),
            },
          });

          tl.fromTo(
            spaceRef.current,
            { scale: 1.5, opacity: 0.5 },
            { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out" },
            0
          );
          tl.fromTo(
            titleWrapRef.current,
            { scale: 0.75, opacity: 0, rotationX: -35 },
            { scale: 1, opacity: 1, rotationX: 0, duration: 1.2, ease: "back.out(1.7)" },
            0.3
          );
          tl.to(atmosphereRef.current, { opacity: 0.6, scale: 1.05, duration: 0.8, ease: "power2.inOut" }, 1.4);
          tl.fromTo(
            planetRef.current,
            { clipPath: "circle(0% at 50% 50%)" },
            { clipPath: "circle(100% at 50% 50%)", duration: 1.8, ease: "power3.inOut" },
            1.6
          );
          tl.to(titleWrapRef.current, { opacity: 0, y: -40, duration: 0.8, ease: "power2.in" }, 2.8);

          // Content reveals in strict order: title first, then everything else
          tl.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.out" }, 3.2);
          tl.from(
            ".chizelverse-title",
            { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" },
            3.4
          );
          tl.from(
            ".verse-rest",
            { y: 60, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12 },
            4.1
          );

          return () => tl.scrollTrigger?.kill();
        },
        "(max-width: 767px)": () => {
          // On phones: NO pin, just a clean enter animation to avoid content cutting
          const tlm = gsap.timeline({ defaults: { ease: "power2.out" } });
          tlm.fromTo(spaceRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
          tlm.fromTo(titleWrapRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
          tlm.to(titleWrapRef.current, { opacity: 0, y: -10, duration: 0.4 }, "+=0.6");
          tlm.fromTo(planetRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
          tlm.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
          tlm.from(".chizelverse-title", { opacity: 0, y: 20, duration: 0.5 });
          tlm.from(".verse-rest", { opacity: 0, y: 24, duration: 0.6, stagger: 0.08 });
        },
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full bg-black overflow-hidden"
      aria-label="ChizelVerse immersive section"
    >
      {/* STARFIELD / SPACE */}
      <div ref={spaceRef} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black" />
        {/* Twinkling stars */}
        <div className="absolute inset-0 cv-stars" aria-hidden="true">
          {Array.from({ length: 60 }).map((_, i) => (
            <span key={i} className="cv-star" />
          ))}
        </div>
        {/* Soft radial glow */}
        <div className="absolute inset-0 opacity-40" style={{
          background: "radial-gradient(600px 400px at 50% 30%, rgba(99,102,241,0.3), transparent 60%)",
        }} />
      </div>

      {/* PARTICLES during entry */}
      <ParticleField isActive={isEntering} />

      {/* ATMOSPHERIC GLOW */}
      <div
        ref={atmosphereRef}
        className="absolute inset-0 opacity-0 mix-blend-screen"
        style={{
          background: "radial-gradient(45% 35% at 50% 50%, rgba(34,211,238,0.4), rgba(59,130,246,0.2), transparent)",
          transform: "translateZ(0)",
        }}
      />

      {/* CENTER INTRO (Entering...) */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div ref={titleWrapRef} className="text-center will-change-transform" style={{ perspective: 1000 }}>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl mb-3">
            Entering ChizelVerse
          </h2>
          <div className="flex items-center justify-center gap-2 md:gap-3 text-white/80">
            <FaRocket className="text-lg md:text-xl animate-pulse" />
            <span className="text-sm md:text-lg font-body">Initializing portal...</span>
          </div>
        </div>
      </div>

      {/* PLANET LAYER + CONTENT */}
      <div ref={planetRef} className="absolute inset-0" style={{ clipPath: "circle(100% at 50% 50%)" }}>
        <div className="absolute inset-0">
          <img
            src="/images/Chizel-verse-bg.jpg"
            alt="Chizelverse background"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(139, 92, 246, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.35) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              animation: "cv-gridPulse 8s ease-in-out infinite",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* CONTENT: strictly ordered reveal */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center p-4 sm:p-6 md:p-10 gap-6 md:gap-8 opacity-0 overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="w-full max-w-screen-xl mx-auto space-y-6 md:space-y-10">
            {/* TITLE FIRST */}
            <h2 className="chizelverse-title font-heading text-center text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Welcome To The ChizelVerse 🚀
            </h2>

            {/* DEMO VISIBLE ON SCREEN */}
            <DemoPreview />

            {/* INFO CARDS */}
            <div className="verse-rest grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {chizelverseInfo.map((card) => (
                <InfoCard key={card.title} card={card} />
              ))}
            </div>

            {/* FEATURES TABS */}
            <div className="verse-rest p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-full shadow-lg overflow-hidden">
              <ul className="flex flex-wrap justify-center gap-3 md:gap-6 mb-6 md:mb-8 border-b border-white/10 pb-4">
                {featuresData.map((f, i) => (
                  <li
                    key={i}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => setActiveIndex(i)}
                    className="cursor-pointer text-center px-3 py-2 rounded-lg transition hover:bg-white/5"
                  >
                    <h3
                      className={`font-heading text-base sm:text-lg md:text-2xl transition ${
                        activeIndex === i
                          ? "text-primary scale-110 drop-shadow"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {f.title}
                    </h3>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                {/* Media */}
                <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/10">
                  <div className="relative w-full aspect-[16/10]">
                    {featuresData.map((f, i) => (
                      <img
                        key={i}
                        src={f.gifSrc}
                        alt={f.title}
                        loading="lazy"
                        className={`absolute inset-0 w-full h-full object-contain p-4 transition duration-500 ${
                          activeIndex === i ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                {/* Text */}
                <div className="relative min-h-[220px]">
                  {featuresData.map((f, i) => (
                    <div
                      key={i}
                      className={`absolute inset-0 flex flex-col justify-center transition duration-500 ${
                        activeIndex === i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
                      }`}
                    >
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

            {/* FOOTER CARD */}
            <div className="verse-rest p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center w-full shadow-lg">
              <h3 className="font-heading text-xl md:text-3xl text-white">🌌 More Worlds Coming Soon...</h3>
              <p className="text-gray-300 mt-2 md:mt-3 text-base md:text-lg font-body">The ChizelVerse is always expanding. Stay tuned for new adventures!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for keyframes and starfield (self-contained single-file) */}
      <style jsx global>{`
        .cv-stars { position: absolute; width: 100%; height: 100%; overflow: hidden; }
        .cv-star { position: absolute; width: 2px; height: 2px; background: rgba(255,255,255,0.9); border-radius: 50%; animation: cv-twinkle calc(2s + 4s * var(--d, 0)) infinite ease-in-out; }
        .cv-stars .cv-star { left: calc(100% * var(--l, 0)); top: calc(100% * var(--t, 0)); }
        .cv-stars .cv-star:nth-child(odd) { filter: drop-shadow(0 0 4px rgba(255,255,255,0.6)); }
        .cv-particle { position: absolute; width: 4px; height: 4px; background: linear-gradient(45deg, #6366f1, #ec4899); border-radius: 50%; box-shadow: 0 0 10px currentColor; opacity: 0.6; }
        @keyframes cv-twinkle { 0%, 100% { opacity: 0.25; transform: scale(0.9);} 50% { opacity: 1; transform: scale(1.15);} }
        @keyframes cv-gridPulse { 0%, 100% { opacity: 0.06; } 50% { opacity: 0.14; } }
      `}</style>
      <ScriptSetup />
    </section>
  );
};

/**
 * Randomize star positions once on mount without re-rendering component
 * (avoids layout thrash and ensures consistent star placement)
 */
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