import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { holoDecks } from "@utils/constants";
import { FaUsers, FaChild, FaChartLine } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  kids: <FaChild className="text-4xl text-accent" />,
  parents: <FaUsers className="text-4xl text-accent" />,
  investors: <FaChartLine className="text-4xl text-accent" />,
};

const AboutSection = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.utils.toArray(".about-panel").forEach((panel, i) => {
        gsap.from(panel, {
          opacity: 0,
          y: 80,
          duration: 1,
          delay: i * 0.2,
          scrollTrigger: {
            trigger: panel,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="about-us"
      className="relative overflow-hidden bg-gradient-to-br from-background via-background to-black py-24"
    >
      {/* Decorative gradient orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse-slow" />

      {/* Heading */}
      <div className="relative text-center mb-20 px-6 z-10">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          What We Offer
        </h2>
        <p className="mt-4 text-secondary-text max-w-2xl mx-auto">
          Chizel connects learning with experience — built for kids, parents,
          and investors with futuristic vision.
        </p>
      </div>

      {/* Panels */}
      <div className="relative z-10 flex flex-col md:flex-row md:flex-wrap gap-12 justify-center max-w-6xl mx-auto px-6">
        {holoDecks.map((deck) => (
          <div
            key={deck.id}
            className="about-panel group relative flex-1 min-w-[280px] max-w-sm p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">{iconMap[deck.id]}</div>

            {/* Title */}
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
              {deck.title}
            </h3>

            {/* Subtitle */}
            <p className="uppercase text-sm tracking-wider text-accent/70 mb-4">
              {deck.subtitle}
            </p>

            {/* Description */}
            <p className="text-secondary-text leading-relaxed">
              {deck.description}
            </p>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style>{`
        .animate-pulse-slow {
          animation: pulse-slow 6s infinite alternate;
        }
        @keyframes pulse-slow {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 0.9; }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
