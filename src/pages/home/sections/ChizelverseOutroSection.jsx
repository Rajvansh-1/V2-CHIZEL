import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ChizelverseOutroSection = () => {
  const containerRef = useRef(null);
  const revealRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=1000", // SCROLL DURATION MINIMIZED
        scrub: 1.5,
        pin: true,
      },
    });

    timeline
      .fromTo(textRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      )
      .to(textRef.current, 
        { opacity: 0, y: -50, duration: 1, ease: "power2.in" },
        "+=1"
      )
      .fromTo(revealRef.current,
        { clipPath: "circle(100% at 50% 50%)" },
        { clipPath: "circle(0% at 50% 50%)", duration: 2, ease: "power2.inOut" },
        "-=1"
      );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-screen overflow-hidden">
      {/* This will be the image that gets covered */}
      <div className="absolute inset-0">
        <img src="/images/Chizel-verse-bg.jpg" alt="Chizelverse background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      {/* This is the overlay that closes the scene */}
      <div ref={revealRef} className="absolute inset-0 bg-background" />

      {/* The text that appears before closing */}
      <div ref={textRef} className="absolute inset-0 flex-center flex-col text-center opacity-0">
        <h2 className="font-heading text-4xl md:text-6xl text-text animated-gradient-heading">
          Leaving The Chizelverse
        </h2>
        <p className="font-body text-2xl text-secondary-text mt-4">
          See you again, explorer!
        </p>
      </div>
    </section>
  );
};

export default ChizelverseOutroSection;