import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ChizelverseOutroSection = () => {
  const containerRef = useRef(null);
  const planetLayerRef = useRef(null);
  const textRef = useRef(null);
  const quoteRef = useRef(null); // Ref for the new quote content

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=2000", // Extended scroll duration for the full sequence
        scrub: 1,
        pin: true,
      },
    });

    // The full animation sequence:
    timeline
      // 1. Fade in the "Leaving" text
      .fromTo(
        textRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      )
      // 2. Fade out the text
      .to(
        textRef.current,
        { opacity: 0, y: -50, duration: 1, ease: "power2.in" },
        "+=0.5" // Hold text briefly
      )
      // 3. Animate the planet layer shrinking away
      .to(
        planetLayerRef.current,
        {
          clipPath: "circle(0% at 50% 50%)",
          duration: 1.5,
          ease: "power3.inOut",
        },
        "-=0.5" // Overlap with text fade out
      )
      // 4. As the planet vanishes, fade in the quote
      .fromTo(
        quoteRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.8" // Start revealing the quote
      );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-screen overflow-hidden bg-background">
      {/* This layer has the planet background and will shrink */}
      <div ref={planetLayerRef} className="absolute inset-0 z-10" style={{ clipPath: "circle(100% at 50% 50%)" }}>
        <img 
          src="/images/Chizel-verse-bg.jpg" 
          alt="Chizelverse background" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* The "Leaving" text sits on top of the planet layer */}
      <div ref={textRef} className="absolute inset-0 flex-center flex-col text-center opacity-0 z-20">
        <h2 className="font-heading text-4xl md:text-6xl text-text animated-gradient-heading">
          Leaving The Chizelverse
        </h2>
        <p className="font-body text-2xl text-secondary-text mt-4">
          See you again, explorer!
        </p>
      </div>

      {/* The quote sits on the base background and is revealed at the end */}
      <div ref={quoteRef} className="absolute inset-0 flex-center flex-col text-center p-8 opacity-0 z-0">
        <blockquote className="font-heading text-3xl md:text-5xl text-text max-w-4xl leading-tight">
          "The future belongs to those who believe in the beauty of their dreams."
        </blockquote>
        <cite className="font-body text-xl text-primary mt-4">- Eleanor Roosevelt</cite>
      </div>
    </section>
  );
};

export default ChizelverseOutroSection;