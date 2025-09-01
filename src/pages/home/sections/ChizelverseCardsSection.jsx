import { useRef, useState } from "react";
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
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  gamepad: <FaGamepad />,
  users: <FaUsers />,
  lightbulb: <FaLightbulb />,
  paintbrush: <FaPaintBrush />,
};

// SIMPLIFIED InfoCard: No internal animations, just presentation.
const InfoCard = ({ card }) => {
  return (
    <div className="p-8 md:p-10 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl text-primary">{iconMap[card.icon]}</div>
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-white">
          {card.title}
        </h3>
      </div>
      <ul className="space-y-4">
        {card.points.map((point, i) => (
          <li
            key={i}
            className="font-body text-gray-300 text-lg flex items-start leading-relaxed"
          >
            <FaStar className="text-primary mr-3 mt-1.5 flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ChizelverseCardsSection = () => {
  const containerRef = useRef(null);
  const planetRef = useRef(null);
  const contentRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=6000", // Longer scroll for a more paced experience
        scrub: 1,
        pin: true,
      },
    });

    // Animate the portal opening
    tl.fromTo(
      planetRef.current,
      { clipPath: "circle(5% at 50% 50%)" },
      { clipPath: "circle(100% at 50% 50%)", duration: 2, ease: "power3.inOut" },
      0
    );

    // Animate the content appearing inside the portal
    tl.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
      "-=1"
    );

    // Animate ALL cards with a single, staggered animation
    tl.from(".verse-card-anim", {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2,
    }, "-=1"); // Overlap with content appearance for a fluid feel

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-screen bg-black overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="entering-text font-heading text-6xl md:text-7xl text-center font-extrabold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          Entering Chizelverse
        </h2>
      </div>

      <div
        ref={planetRef}
        className="absolute inset-0"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        <div className="absolute inset-0">
          <img
            src="/images/Chizel-verse-bg.jpg"
            alt="Chizelverse background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center gap-12 p-6 md:p-16 opacity-0 overflow-y-auto"
        >
          <h2 className="verse-card-anim font-heading text-5xl md:text-6xl text-center font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome To The Chizelverse 🚀
          </h2>

          <div className="max-w-7xl w-full space-y-10">
            <div className="verse-card-anim p-10 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-500/10 backdrop-blur-md border border-primary/40 text-center shadow-lg hover:shadow-2xl transition-all w-full">
              <h3 className="font-heading text-3xl md:text-4xl text-white mb-3">Interactive Demo</h3>
              <p className="text-gray-200 text-lg mb-6">Experience the Chizelverse firsthand.</p>
              <Button
                title="Try Me"
                onClick={() => window.open("https://rajvansh-1.github.io/ChizelVerse/", "_blank")}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {chizelverseInfo.map((card) => (
                <div key={card.title} className="verse-card-anim">
                  <InfoCard card={card} />
                </div>
              ))}
            </div>

            <div className="verse-card-anim p-8 md:p-10 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-full shadow-lg">
              <ul className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8 border-b border-white/10 pb-6">
                {featuresData.map((feature, index) => (
                  <li
                    key={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    className="cursor-pointer text-center"
                  >
                    <h3 className={`font-heading text-xl md:text-3xl transition-all duration-300 ${activeIndex === index ? "text-primary scale-110" : "text-gray-300 hover:text-white"}`}>
                      {feature.title}
                    </h3>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[350px]">
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-black/40">
                  {featuresData.map((feature, index) => (
                    <img key={index} src={feature.gifSrc} alt={feature.title} className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${activeIndex === index ? "opacity-100" : "opacity-0"}`} />
                  ))}
                </div>
                <div className="relative h-full">
                  {featuresData.map((feature, index) => (
                    <div key={index} className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-500 ${activeIndex === index ? "opacity-100" : "opacity-0"}`}>
                      <p className="font-body text-gray-200 text-lg leading-relaxed">{feature.description}</p>
                      <div className="relative border-l-2 border-primary/40 pl-4 mt-4">
                        <FaQuoteLeft className="absolute -top-1 -left-2 text-lg text-primary/40" />
                        <blockquote className="font-body text-gray-300 italic text-base">"{feature.quote}"</blockquote>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="verse-card-anim p-10 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center w-full shadow-lg">
              <h3 className="font-heading text-2xl md:text-3xl text-white">🌌 More Worlds Coming Soon...</h3>
              <p className="text-gray-300 mt-3 text-lg">The Chizelverse is always expanding. Stay tuned for new adventures!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChizelverseCardsSection;