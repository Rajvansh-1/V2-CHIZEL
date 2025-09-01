import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

// Placeholder data for the new cards
const chizelverseContent = {
  demo: {
    title: "Interactive Demo",
    description: "Experience the Chizelverse firsthand.",
    buttonText: "Try Me",
    href: "https://rajvansh-1.github.io/ChizelVerse/",
  },
  infoCards: [
    {
      title: "Info Card 1",
      description: "Content for the first info card will go here.",
    },
    {
      title: "Info Card 2",
      description: "Content for the second info card will be added later.",
    },
  ],
  features: {
    title: "Features Card",
    description: "A detailed breakdown of the features will be placed here.",
  }
};

const ChizelverseCardsSection = () => {
  const containerRef = useRef(null);
  const planetRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3500",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    timeline
      .to(".entering-text-container", { opacity: 0, scale: 0.8, duration: 0.5 })
      .to(planetRef.current, {
        scale: 150,
        duration: 2,
        ease: "power2.inOut",
      })
      .fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.5"
      )
      .from(".verse-card", {
        y: 100,
        opacity: 0,
        stagger: 0.3,
        duration: 1,
        ease: "power2.out",
      });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="chizelverse-cards"
      className="relative h-screen w-screen overflow-hidden flex-center"
    >
      {/* Entering Animation */}
      <div className="absolute inset-0 flex-center">
        <div className="entering-text-container text-center">
          <h2 className="font-heading text-4xl md:text-6xl text-text">
            Entering Chizel Verse
          </h2>
        </div>
        <div
          ref={planetRef}
          className="absolute w-20 h-20 bg-primary rounded-full"
          style={{ transform: "scale(0)" }}
        />
      </div>

      {/* Chizelverse Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex-center flex-col gap-8 p-8 opacity-0"
      >
        <h2 className="font-heading text-4xl md:text-5xl text-text">
          Welcome To The Chizelverse!
        </h2>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demonstration Card */}
          <div className="verse-card md:col-span-2 p-8 rounded-2xl bg-card/70 backdrop-blur-lg border border-primary/30 text-center flex flex-col items-center justify-center">
            <h3 className="font-heading text-3xl text-primary mb-2">
              {chizelverseContent.demo.title}
            </h3>
            <p className="text-secondary-text mb-6">
              {chizelverseContent.demo.description}
            </p>
            <Button
              title={chizelverseContent.demo.buttonText}
              onClick={() => window.open(chizelverseContent.demo.href, "_blank")}
            />
          </div>

          {/* Info Cards */}
          {chizelverseContent.infoCards.map((card, index) => (
            <div key={index} className="verse-card p-8 rounded-2xl bg-card/70 backdrop-blur-lg border border-white/10">
              <h3 className="font-heading text-2xl text-text mb-2">{card.title}</h3>
              <p className="text-secondary-text">{card.description}</p>
            </div>
          ))}

          {/* Features Card */}
          <div className="verse-card md:col-span-2 p-8 rounded-2xl bg-card/70 backdrop-blur-lg border border-white/10">
            <h3 className="font-heading text-3xl text-text mb-2">{chizelverseContent.features.title}</h3>
            <p className="text-secondary-text">{chizelverseContent.features.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChizelverseCardsSection;