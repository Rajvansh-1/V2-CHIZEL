import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "@components/common/AnimatedTitle";
import { FaChevronDown } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const ChizelverseIntroSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Animate the entire section to fade in
    gsap.from(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
    });

    // Animate the scroll down prompt to loop
    gsap.fromTo(
      ".chizelverse-scroll-prompt",
      { opacity: 0, y: 0 },
      {
        opacity: 1,
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5, // Start after the title animation
      }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="chizelverse-intro"
      className="relative h-screen w-screen flex flex-col items-center justify-center text-center p-4"
    >
      {/* Background with subtle animated stars */}
      <div className="absolute inset-0 bg-background overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-text rounded-full animate-pulse delay-100" />
        <div className="absolute top-[50%] right-[15%] w-1 h-1 bg-text rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-[30%] left-[25%] w-1 h-1 bg-text rounded-full animate-pulse delay-500" />
        <div className="absolute top-[70%] left-[80%] w-1 h-1 bg-text rounded-full animate-pulse" />
      </div>
      
      <div className="relative z-10">
        <AnimatedTitle
          title="Ready For A Journey<br />Through The Chizelverse?"
          containerClass="!text-4xl md:!text-6xl !leading-tight text-text"
        />
      </div>

      <div className="chizelverse-scroll-prompt absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
        <div className="flex flex-col items-center gap-1 font-ui text-sm text-secondary-text">
          <span>Keep Scrolling</span>
          <FaChevronDown />
        </div>
      </div>
    </section>
  );
};

export default ChizelverseIntroSection;