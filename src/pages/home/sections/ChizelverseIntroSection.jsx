import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaChevronDown, FaRocket } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const ChizelverseIntroSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Gentle floating animation for the title
    gsap.to(".intro-title", {
      y: -15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Animate stars with parallax effect on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    
    gsap.utils.toArray(".star").forEach((star) => {
      const depth = gsap.getProperty(star, "--depth");
      const yPercent = -100 * (depth || 1);
      tl.to(star, { yPercent, ease: "none" }, 0);
    });

    // UFO Fly-by Animation
    gsap.fromTo(".ufo",
      { xPercent: -100, yPercent: 100 },
      {
        xPercent: 1200,
        yPercent: -200,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom top",
          scrub: 1,
        }
      }
    );

    // Fade in the whole section for a smooth entrance
    gsap.from(containerRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    })

    // Animate the scroll down prompt to loop
    gsap.fromTo(
      ".chizelverse-scroll-prompt",
      { opacity: 0, y: 0 },
      { opacity: 1, y: 10, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="chizelverse-intro"
      className="relative h-screen w-screen flex flex-col items-center justify-center text-center p-4 overflow-hidden"
    >
      <div className="ufo absolute top-1/2 left-0 z-20 text-primary text-4xl md:text-5xl opacity-70">
        <FaRocket style={{ transform: "rotate(45deg)" }} />
      </div>

      <div className="absolute inset-0 bg-background pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 2 + 1;
          const depth = Math.random() * 0.8 + 0.2;
          return (
            <div
              key={i}
              className="star absolute rounded-full bg-white"
              style={{
                '--depth': depth,
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: `${Math.random() * 0.6 + 0.2}`,
              }}
            />
          );
        })}
      </div>
      
      <div className="relative z-10 intro-title">
        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl leading-tight animated-gradient-heading">
          Ready For A Journey
          <br />
          Through The Chizelverse?
        </h2>
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