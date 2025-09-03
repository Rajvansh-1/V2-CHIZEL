import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaUsers, FaChild, FaChartLine } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

// Data for our Holo-Deck panels
const holoDecks = [
  {
    id: "kids",
    title: "A Universe of Play",
    subtitle: "For Kids",
    description: "Fun games that make learning exciting, an AI buddy that builds confidence, and a community to explore, learn, and connect — helping them grow in every aspect of life from the very beginning.",
    icon: <FaChild />,
    image: "/images/about-image.webp",
    alt: "Kids creating in Chizel",
    themeColor: "var(--color-primary)",
  },
  {
    id: "parents",
    title: "A Journey to Witness",
    subtitle: "For Parents",
    description: "Peace of mind knowing your child is learning while having fun. Watch their interests grow, support their journey, and turn screen time into skill time",
    icon: <FaUsers />,
    image: "/images/vision-image.webp",
    alt: "Parents witnessing growth",
    themeColor: "var(--color-accent)",
  },
  {
    id: "investors",
    title: "A Future to Build",
    subtitle: "For Investors",
    description: "Be part of transforming lives with Chizel. This is your chance to be an early supporter of something set for massive growth — blink now, and you might miss us`.",
    icon: <FaChartLine />,
    image: "/images/ecosystem-image.webp",
    alt: "The future of Chizel expanding",
    themeColor: "var(--color-badge-bg)",
  },
];

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
    <section ref={containerRef} id="about-us" className="overflow-hidden bg-background">
      <div ref={pinRef} className="h-screen w-full">
        <div ref={contentRef} className="flex h-full w-[300vw]">
          {holoDecks.map((deck) => (
            <div
              key={deck.id}
              className="holo-deck-panel relative w-screen h-full flex items-center justify-center p-8 md:p-16 overflow-hidden"
            >
              {/* Background Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-center max-w-7xl mx-auto">
                {/* Text Content */}
                <div className="panel-text md:col-span-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-card/50 border border-white/10 rounded-full">
                    <span className="text-xl" style={{ color: deck.themeColor }}>{deck.icon}</span>
                    <p className="font-ui text-lg uppercase tracking-widest text-secondary-text">{deck.subtitle}</p>
                  </div>
                  <h2 className="font-heading text-5xl md:text-7xl font-bold text-text mt-2">{deck.title}</h2>
                  <p className="mt-6 font-body text-lg text-secondary-text max-w-md">{deck.description}</p>
                </div>
                
                {/* Image Holo-Deck */}
                <div className="md:col-span-3 h-96 relative flex items-center justify-center">
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
