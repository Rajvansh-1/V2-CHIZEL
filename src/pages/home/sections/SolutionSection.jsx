// src/pages/home/sections/SolutionSection.jsx

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { solutionCards } from "@utils/constants";

gsap.registerPlugin(ScrollTrigger);

const SolutionSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // ✨ NEW: Scroll reveal animation for the heading
    gsap.from(".animated-gradient-heading", {
      opacity: 0,
      y: 50, // Start 50px below its final position
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".animated-gradient-heading",
        start: "top 85%", // Trigger when the top of the heading is 85% from the top of the viewport
        toggleActions: "play none none none",
      },
    });

    // Continuous rotation for the logo
    gsap.to(".rotating-logo", {
      rotation: 360,
      repeat: -1,
      duration: 20,
      ease: "none",
    });

    // Simple fade-in animation for the content as user scrolls
    gsap.from(".solution-content", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".solution-content",
            start: "top 85%",
            toggleActions: "play none none none",
        },
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="solution" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        {/* Heading with Gradient and now Scroll Reveal */}
        <div className="text-center mb-16 md:mb-24">
            <h2 className="animated-gradient-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Ready To Turn Your Screen Time Into Skill Time?
            </h2>
        </div>

        {/* The rotating logo */}
        <div className="flex-center my-12 md:my-16">
            <img
                src="/images/logo.png"
                alt="Rotating Logo"
                className="rotating-logo w-28 h-28 md:w-36 md:h-36"
            />
        </div>

        {/* The 4 cards and image, with hover/click effects */}
        <div className="solution-content grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex items-center justify-center lg:order-last">
                <img
                    src="/images/about-image.webp"
                    alt="Chizel Smart Solution"
                    className="w-full max-w-sm lg:max-w-full rounded-3xl shadow-2xl shadow-primary/20
                                transition-all duration-300 ease-in-out
                                hover:scale-[1.02] hover:shadow-primary/40
                                active:scale-[0.98] active:shadow-primary/60
                                cursor-pointer"
                />
            </div>
            <div className="flex flex-col gap-6">
                {solutionCards.map((card, index) => (
                    <div
                        key={index}
                        className="p-6 rounded-3xl bg-[#10182B] border border-white/10 text-left
                                   transition-all duration-300 ease-in-out
                                   hover:bg-primary/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20
                                   active:scale-[0.98] active:bg-primary/20 active:border-primary/80
                                   cursor-pointer"
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-4xl pt-1">{card.emoji}</div>
                            <div>
                                <h3 className="font-heading text-xl text-text mb-2">{card.title}</h3>
                                <p className="font-body text-secondary-text text-sm">{card.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;