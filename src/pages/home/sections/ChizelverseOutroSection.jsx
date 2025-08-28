import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "@components/common/AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const ChizelverseOutroSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Animate the section to fade in and out as you scroll past it
    gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      opacity: 1,
      ease: "none",
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="chizelverse-outro"
      className="relative h-screen w-screen flex items-center justify-center text-center p-4 bg-background opacity-0"
    >
      <div className="relative z-10">
        <AnimatedTitle
          title="Leaving The ChizelVerse"
          containerClass="!text-4xl md:!text-6xl text-text"
        />
      </div>
    </section>
  );
};

export default ChizelverseOutroSection;