import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { holoDecks } from "@utils/constants";
import { FaUsers, FaChild, FaChartLine } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

// This map translates the string from your constants file into a renderable React icon component.
const iconMap = {
  // FIX: Added responsive icon sizing
  kids: <FaChild className="text-3xl md:text-4xl" />,
  parents: <FaUsers className="text-3xl md:text-4xl" />,
  investors: <FaChartLine className="text-3xl md:text-4xl" />,
};

const AboutSection = () => {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    // Main horizontal scroll timeline
    const horizontalScroll = gsap.to(contentRef.current, {
      x: () => -(contentRef.current.scrollWidth - pinRef.current.clientWidth),
      ease: "none",
      scrollTrigger: {
        trigger: pinRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${contentRef.current.scrollWidth}`,
      },
    });

    // Animate each Holo-Deck as it comes into view
    gsap.utils.toArray(".holo-deck-panel").forEach(panel => {
      const imageLayers = panel.querySelectorAll(".parallax-layer");
      const textContent = panel.querySelectorAll(".panel-text > *");
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          containerAnimation: horizontalScroll,
          start: "left 80%",
          end: "left left",
          scrub: 1,
        }
      });

      // Parallax effect for image layers
      tl.fromTo(imageLayers, 
        { xPercent: (i) => -50 + i * 50 },
        { xPercent: (i) => 50 - i * 50, ease: "none" },
        0
      );
      
      // Text reveal animation
      tl.from(textContent, {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      }, 0);
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about-us" className="overflow-hidden bg-background py-20 md:py-24">
      
      {/* This heading is outside the pinned element and will not scroll horizontally */}
      <div className="text-center mb-16 px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-text">
          What We Offer
        </h2>
      </div>

      <div ref={pinRef} className="h-screen w-full">
        <div ref={contentRef} className="flex h-full w-[300vw]">
          {holoDecks.map((deck) => (
            <div
              key={deck.id}
              // FIX: Reduced padding on smaller screens
              className="holo-deck-panel relative w-screen h-full flex items-center justify-center p-4 sm:p-8 md:p-16 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-center max-w-7xl mx-auto">
                <div className="panel-text md:col-span-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-card/50 border border-white/10 rounded-full">
                    <span className="text-xl" style={{ color: deck.themeColor }}>
                      {iconMap[deck.id]}
                    </span>
                    {/* FIX: Made subtitle text smaller on mobile */}
                    <p className="font-ui text-base md:text-lg uppercase tracking-widest text-secondary-text">{deck.subtitle}</p>
                  </div>
                  {/* FIX: Made heading smaller on mobile and scale up */}
                  <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold text-text mt-2">{deck.title}</h2>
                  {/* FIX: Made description text smaller on mobile */}
                  <p className="mt-6 font-body text-base sm:text-lg text-secondary-text max-w-md">{deck.description}</p>
                </div>
                
                {/* FIX: Made image container shorter on smaller screens */}
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
    </section>
  );
};

export default AboutSection;