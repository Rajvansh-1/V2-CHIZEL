import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Helper component to randomize star positions once on mount
const ScriptSetup = () => {
  useEffect(() => {
    const stars = document.querySelectorAll(".cv-stars-outro .cv-star-outro");
    stars.forEach(s => {
      s.style.setProperty("--l", Math.random().toString());
      s.style.setProperty("--t", Math.random().toString());
      s.style.setProperty("--d", Math.random().toString());
    });
  }, []);
  return null;
};

const ChizelverseOutroSection = () => {
  const containerRef = useRef(null);
  const planetLayerRef = useRef(null);
  const textRef = useRef(null);
  const quoteRef = useRef(null);

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=2000",
        scrub: 1,
        pin: true,
      },
    });

    timeline
      .fromTo(
        textRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      )
      .to(
        textRef.current,
        { opacity: 0, y: -50, duration: 1, ease: "power2.in" },
        "+=0.5"
      )
      .to(
        planetLayerRef.current,
        {
          clipPath: "circle(0% at 50% 50%)",
          duration: 1.5,
          ease: "power3.inOut",
        },
        "-=0.5"
      )
      .fromTo(
        quoteRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.8"
      );
  }, { scope: containerRef });

  // Reusable background component with the correct theme from the reference file
  const SpaceBackground = () => (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/40" />
      <div className="cv-stars-outro absolute inset-0" aria-hidden="true">
        {Array.from({ length: 60 }).map((_, i) => <span key={i} className="cv-star-outro" />)}
      </div>
    </>
  );

  return (
    <section ref={containerRef} className="relative h-screen w-screen overflow-hidden">
      {/* Base Layer: Correct Blue Space Background */}
      <div className="absolute inset-0">
        <SpaceBackground />
      </div>
      
      {/* Planet Layer: This layer has the same background and shrinks away */}
      <div ref={planetLayerRef} className="absolute inset-0 z-10" style={{ clipPath: "circle(100% at 50% 50%)" }}>
        <SpaceBackground />
      </div>

      {/* The "Leaving" text sits on top of the planet layer */}
      <div ref={textRef} className="absolute inset-0 flex-center flex-col text-center opacity-0 z-20">
        <h2 className="font-heading text-4xl md:text-6xl text-text bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg">
          Leaving The ChizelVerse
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

      <style jsx global>{`
        .cv-stars-outro { position: absolute; width: 100%; height: 100%; overflow: hidden; }
        .cv-star-outro { position: absolute; width: 2px; height: 2px; background: rgba(255,255,255,0.9); border-radius: 50%; animation: cv-twinkle calc(2s + 4s * var(--d, 0)) infinite ease-in-out; }
        .cv-stars-outro .cv-star-outro { left: calc(100% * var(--l, 0)); top: calc(100% * var(--t, 0)); }
        @keyframes cv-twinkle { 0%, 100% { opacity: 0.25; transform: scale(0.9);} 50% { opacity: 1; transform: scale(1.15);} }
      `}</style>
      <ScriptSetup />
    </section>
  );
};

export default ChizelverseOutroSection;