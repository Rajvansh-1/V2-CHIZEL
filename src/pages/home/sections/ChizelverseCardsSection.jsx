import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chizelverseCards } from "@utils/constants";
import AnimatedTitle from "@components/common/AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const ChizelverseCard = ({ card }) => (
  <div className="relative w-full h-full rounded-2xl bg-card/50 backdrop-blur-lg border border-white/10 overflow-hidden">
    <img
      src={card.image}
      alt={card.title}
      className="absolute inset-0 w-full h-full object-cover opacity-20"
    />
    <div className="relative z-10 p-8 flex flex-col justify-end h-full">
      <h3 className="font-heading text-3xl text-text mb-4">{card.title}</h3>
      <p className="font-body text-secondary-text">{card.description}</p>
    </div>
  </div>
);

const ChizelverseCardsSection = () => {
  const containerRef = useRef(null);
  const planetRef = useRef(null);
  const cardsRef = useRef(null);

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000", // Controls the duration of the pinned animation
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Animate "Entering Chizel Verse"
    timeline
      .to(planetRef.current, {
        scale: 150, // Expands the circle to fill the screen
        duration: 2,
        ease: "power2.inOut",
      })
      .to(".entering-text", {
        opacity: 0,
        duration: 0.5,
      }, "-=2") // Fade out the text as the planet expands
      .from(cardsRef.current, {
        opacity: 0,
        duration: 1,
      })
      .from(".chizelverse-card", {
        y: 100,
        opacity: 0,
        stagger: 0.5,
        duration: 1,
        ease: "power2.out",
      });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="chizelverse-cards"
      className="relative h-screen w-screen overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="entering-text text-center">
          <AnimatedTitle
            title="Entering Chizel Verse"
            containerClass="!text-4xl md:!text-6xl text-text"
          />
        </div>
        <div
          ref={planetRef}
          className="absolute w-20 h-20 bg-primary rounded-full"
          style={{ transform: "scale(0)" }} // Initial state
        />
      </div>

      <div
        ref={cardsRef}
        className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 opacity-0"
      >
        {chizelverseCards.map((card, index) => (
          <div key={index} className="chizelverse-card">
            <ChizelverseCard card={card} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChizelverseCardsSection;