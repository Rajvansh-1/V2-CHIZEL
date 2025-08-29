import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { solutionCards } from "@utils/constants";
import AnimatedTitle from "@components/common/AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

// New "Activity Pod" component, styled like your reference image
const ActivityPod = ({ card }) => {
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  // Playful hover/tap animation
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -10,
      boxShadow: "0px 20px 40px rgba(0, 170, 255, 0.2)",
      borderColor: "rgba(0, 170, 255, 0.5)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(iconRef.current, {
      scale: 1.2,
      rotate: -10,
      duration: 0.4,
      ease: "back.out(1.7)",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      duration: 0.3,
      ease: "power2.out",
    });
     gsap.to(iconRef.current, {
      scale: 1,
      rotate: 0,
      duration: 0.4,
      ease: "back.out(1.7)",
    });
  };

  return (
    <div
      ref={cardRef}
      className="solution-card p-6 rounded-3xl cursor-pointer bg-[#10182B] border border-white/10 shadow-[0px_10px_30px_rgba(0,0,0,0.2)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start gap-4">
        <div ref={iconRef} className="text-4xl">
            {card.emoji}
        </div>
        <div>
            <h3 className="font-heading text-xl text-text mb-2">{card.title}</h3>
            <p className="font-body text-secondary-text text-sm">{card.description}</p>
        </div>
      </div>
    </div>
  );
};

const SolutionSection = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    const image = imageRef.current;

    // Cute Parallax Effect for the image
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const xPercent = (clientX - left - width / 2) / width;
      const yPercent = (clientY - top - height / 2) / height;

      gsap.to(image, {
        x: -xPercent * 30,
        y: -yPercent * 30,
        rotationY: xPercent * 20,
        rotationX: -yPercent * 20,
        duration: 1,
        ease: "power2.out",
      });
    };
    
    containerRef.current.addEventListener("mousemove", handleMouseMove);

    // Entrance animation for the whole section
    gsap.from(containerRef.current, {
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
        },
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
    });

    // Staggered entrance animation for the pods
    gsap.from(".solution-card", {
      scrollTrigger: {
        trigger: ".pods-container",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)",
    });

    return () => {
        containerRef.current?.removeEventListener("mousemove", handleMouseMove);
    }

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="solution"
      className="relative w-full py-20 md:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: The Parallax Image */}
        <div className="flex items-center justify-center" style={{ perspective: '1000px' }}>
          <img
            ref={imageRef}
            src="/images/about-image.webp"
            alt="Chizel Smart Solution"
            className="w-full max-w-md lg:max-w-full rounded-3xl shadow-2xl"
          />
        </div>

        {/* Right Side: Title and Activity Pods */}
        <div className="flex flex-col">
          <div className="mb-12 text-center lg:text-left">
            <AnimatedTitle
              title="THE SMART SOLUTION<br />FOR SCREEN TIME"
              containerClass="!text-4xl md:!text-5xl !leading-tight text-text"
            />
          </div>
          <div className="pods-container grid grid-cols-1 sm:grid-cols-2 gap-6">
            {solutionCards.map((card, index) => (
              <ActivityPod key={index} card={card} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SolutionSection;
