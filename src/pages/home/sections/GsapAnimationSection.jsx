import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GsapAnimationSection = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useGSAP(() => {
    gsap.from(lineRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
      scaleX: 0, // Animate the width from 0 to 100%
      transformOrigin: "center center",
      ease: "none",
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="transition-border"
      className="w-full h-32 flex items-center justify-center bg-background"
    >
      <div className="w-full max-w-4xl px-8">
        <div
          ref={lineRef}
          className="h-px bg-gradient-to-r from-primary/20 via-accent/80 to-primary/20"
        />
      </div>
    </section>
  );
};

export default GsapAnimationSection;