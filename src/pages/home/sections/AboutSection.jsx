import { useRef, useMemo, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { holoDecks } from "@utils/constants";
import { FaUsers, FaChild, FaChartLine } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  kids: <FaChild className="text-3xl md:text-4xl" />,
  parents: <FaUsers className="text-3xl md:text-4xl" />,
  investors: <FaChartLine className="text-3xl md:text-4xl" />,
};

const AboutSection = () => {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const contentRef = useRef(null);

  // Responsive starfield
  const stars = useMemo(() => {
    let count = 150;
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) count = 80;      // mobile
      else if (window.innerWidth < 1024) count = 120; // tablet
      else count = 180;                               // desktop
    }
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 5 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  useLayoutEffect(() => {
    if (!contentRef.current || !pinRef.current) return;

    let ctx = gsap.context(() => {
        const totalScroll = contentRef.current.scrollWidth - pinRef.current.clientWidth;

        // Horizontal scroll animation
        const horizontalScroll = gsap.to(contentRef.current, {
          x: -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: pinRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: `+=${totalScroll}`, // <-- FIX: Corrected syntax
          },
        });

        // Parallax animations
        const panels = contentRef.current.querySelectorAll(".holo-deck-panel");
        panels.forEach((panel) => {
          const imageLayers = panel.querySelectorAll(".parallax-layer");
          const textContent = panel.querySelectorAll(".panel-text > *");

          if (!imageLayers.length && !textContent.length) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontalScroll,
              start: "left 80%",
              end: "left left",
              scrub: 1,
            },
          });

          // GPU-accelerated parallax layers
          tl.fromTo(
            imageLayers,
            { xPercent: (i) => -50 + i * 50, transform: 'translate3d(0,0,0)', willChange: 'transform' },
            { xPercent: (i) => 50 - i * 50, ease: "none" },
            0
          );

          // Smooth text fade-in
          tl.from(
            textContent,
            { y: 50, opacity: 0, stagger: 0.1, ease: "power2.out", willChange: 'transform, opacity' },
            0
          );
        });
    }, containerRef); // Scoping the context to the container

    return () => ctx.revert(); // Cleanup GSAP animations
  }, []);

  return (
    <section ref={containerRef} id="about-us" className="relative overflow-hidden bg-background py-20 md:py-24">
      {/* Starfield */}
      <div className="absolute inset-0 z-0">
        {stars.map(star => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white opacity-40 animate-twinkle"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              transform: 'translate3d(0,0,0)',
              willChange: 'opacity',
            }}
          />
        ))}
      </div>

      {/* Heading */}
      <div className="relative text-center mb-16 px-4 z-10">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-text">
          What We Offer
        </h2>
      </div>

      {/* Cards */}
      <div ref={pinRef} className="h-screen w-full relative z-10">
        <div ref={contentRef} className="flex h-full w-[300vw]">
          {holoDecks.map((deck) => (
            <div
              key={deck.id}
              className="holo-deck-panel relative w-screen h-full flex items-center justify-center p-4 sm:p-8 md:p-16 overflow-hidden"
            >
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-center max-w-7xl mx-auto">
                <div className="panel-text md:col-span-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-card/50 border border-white/10 rounded-full">
                    <span className="text-xl" style={{ color: deck.themeColor }}>
                      {iconMap[deck.id]}
                    </span>
                    <p className="font-ui text-base md:text-lg uppercase tracking-widest text-secondary-text">{deck.subtitle}</p>
                  </div>
                  <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold text-text mt-2">{deck.title}</h2>
                  <p className="mt-6 font-body text-base sm:text-lg text-secondary-text max-w-md">{deck.description}</p>
                </div>
                <div className="md:col-span-3 h-64 sm:h-80 md:h-96 relative flex items-center justify-center">
                  <div className="absolute inset-0 z-0">
                    <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm"></div>
                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent"></div>
                  </div>
                  <div className="relative w-[90%] h-[80%] overflow-hidden" style={{ perspective: "1000px" }}>
                    <div className="parallax-layer absolute inset-0">
                      <img src={deck.image} alt={deck.alt} className="w-full h-full object-cover rounded-xl shadow-2xl opacity-80" />
                    </div>
                    <div className="parallax-layer absolute inset-0">
                      <div className="w-full h-full border-2 border-white/20 rounded-xl" style={{ transform: "scale(0.95)" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Twinkle animation */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        .animate-twinkle {
          animation: twinkle infinite alternate;
          transform: translate3d(0,0,0);
          will-change: opacity;
        }
      `}</style>
    </section>
  );
};

export default AboutSection;