import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaExclamationTriangle } from "react-icons/fa";
import { problemSlides } from "@utils/constants";
import ProblemCard from "@/components/features/about/ProblemCard";

gsap.registerPlugin(ScrollTrigger);

const ProblemStatementSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const scrollTriggerConfig = {
      toggleActions: "play none none reverse",
      fastScrollEnd: true,
      preventOverlaps: true,
    };

    let ctx = gsap.context(() => {
      gsap.from(".problem-heading", {
        scrollTrigger: {
          trigger: ".problem-heading",
          start: "top 85%",
          ...scrollTriggerConfig,
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.utils.toArray(".problem-slide").forEach((el) => {
        if (!el) return;
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            ...scrollTriggerConfig,
          },
          opacity: 0,
          y: 50,
          duration: 0.7,
          ease: "power3.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <section
        id="problem"
        className="relative w-screen bg-background pt-8 sm:pt-12 pb-6 sm:pb-12 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 h-60 w-60 rounded-full bg-red-500/10 blur-[90px]" />
        </div>
        <div className="container mx-auto px-6 md:px-8">
          <div className="problem-heading text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold">
              <FaExclamationTriangle />
              <span className="text-sm uppercase tracking-wider">
                THE PROBLEM
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text">
              Screen Time is Hurting <br /> Our Kids
            </h2>
            <p className="text-xl text-secondary-text font-medium max-w-3xl mx-auto">
              While technology should help children grow, most apps are designed
              to be addictive rather than educational.
            </p>
          </div>
          <div className="space-y-14 max-w-4xl mx-auto">
            {problemSlides.map((slide, i) => (
              <div
                key={i}
                className="problem-slide w-full max-w-[900px] mx-auto"
                style={{ willChange: "transform, opacity" }}
              >
                <ProblemCard slide={slide} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProblemStatementSection;