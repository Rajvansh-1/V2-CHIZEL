// src/pages/home/sections/AboutSection.jsx

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    // Horizontal scrolling animation
    gsap.to(contentRef.current, {
      x: () => -(contentRef.current.scrollWidth - pinRef.current.clientWidth),
      ease: "none",
      scrollTrigger: {
        trigger: pinRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${contentRef.current.scrollWidth}`,
      },
    });

    // Animate each world's content as it comes into view
    gsap.utils.toArray(".world-content").forEach(section => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                containerAnimation: gsap.getTweensOf(contentRef.current)[0], // Link to the horizontal scroll
                start: "left 75%",
                toggleActions: "play reverse play reverse",
            }
        });
        tl.from(section, { y: 50, opacity: 0, scale: 0.9, duration: 1, ease: "power2.out" });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about-us" className="overflow-hidden">
      <div ref={pinRef} className="h-screen w-full">
        <div ref={contentRef} className="flex h-full w-[300vw]">
          {/* World 1: For Kids */}
          <div className="world-section flex-center relative w-screen h-full bg-gradient-to-br from-[#1a237e] to-[#0d1226]">
            <img src="/images/about-image.webp" alt="Kids creating in Chizel" className="absolute inset-0 w-full h-full object-contain opacity-40"/>
            <div className="world-content text-center relative z-10">
                <p className="font-ui text-secondary-text uppercase tracking-widest">For Kids</p>
                <h2 className="font-heading text-5xl md:text-7xl text-text mt-2">A Universe to Create</h2>
            </div>
          </div>

          {/* World 2: For Parents */}
          <div className="world-section flex-center relative w-screen h-full bg-gradient-to-br from-[#0d1226] to-[#2a0d45]">
            <img src="/images/vision-image.webp" alt="Parents witnessing growth" className="absolute inset-0 w-full h-full object-contain opacity-30"/>
            <div className="world-content text-center relative z-10">
                <p className="font-ui text-secondary-text uppercase tracking-widest">For Parents</p>
                <h2 className="font-heading text-5xl md:text-7xl text-text mt-2">A Journey to Witness</h2>
            </div>
          </div>

          {/* World 3: For Investors */}
          <div className="world-section flex-center relative w-screen h-full bg-gradient-to-br from-[#2a0d45] to-[#0d1226]">
            <img src="/images/ecosystem-image.webp" alt="The future of Chizel expanding" className="absolute inset-0 w-full h-full object-contain opacity-40"/>
            <div className="world-content text-center relative z-10">
                <p className="font-ui text-secondary-text uppercase tracking-widest">For Investors</p>
                <h2 className="font-heading text-5xl md:text-7xl text-text mt-2">A Future to Build</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;