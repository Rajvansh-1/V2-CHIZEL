import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaPuzzlePiece,
  FaRocket,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";
import { solutionCards } from "@utils/constants";
import AnimatedTitle from "@components/common/AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

// Map icon names from constants.js to actual react-icons components
const iconMap = {
  FaPuzzlePiece: <FaPuzzlePiece />,
  FaRocket: <FaRocket />,
  FaUsers: <FaUsers />,
  FaShieldAlt: <FaShieldAlt />,
};

const SolutionCard = ({ card, index }) => {
  return (
    <div
      className="solution-card relative rounded-2xl p-8 overflow-hidden border border-white/10 bg-card/80 backdrop-blur-sm"
      style={{ willChange: "transform, opacity" }}
    >
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-r ${card.gradient}`}
      />
      <div className="relative z-10">
        <div
          className={`text-4xl text-white p-4 rounded-xl inline-block mb-6 bg-gradient-to-br ${card.gradient}`}
        >
          {iconMap[card.icon]}
        </div>
        <h3 className="font-heading text-2xl text-text mb-3">{card.title}</h3>
        <p className="font-body text-secondary-text">{card.description}</p>
      </div>
    </div>
  );
};

const SolutionSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const scrollTriggerConfig = {
      trigger: containerRef.current,
      start: "top 80%",
      toggleActions: "play none none reverse",
    };

    gsap.from(".solution-title", {
      ...scrollTriggerConfig,
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
    });

    gsap.from(".solution-card", {
      ...scrollTriggerConfig,
      opacity: 0,
      y: 50,
      duration: 0.7,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2,
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="solution"
      className="w-screen bg-background py-16 sm:py-24"
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="solution-title text-center mb-16">
          <AnimatedTitle
            title="Our Solution:<br />The Chizel Approach"
            containerClass="!text-4xl md:!text-5xl !leading-tight text-text"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutionCards.map((card, index) => (
            <SolutionCard key={index} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;