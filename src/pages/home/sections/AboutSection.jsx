import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaChild, FaUsers, FaRocket } from "react-icons/fa";
import OfferCard from "@/components/features/about/OfferCard";
import { offers } from "@utils/constants";

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  kids: <FaChild className="text-3xl text-white" />,
  parents: <FaUsers className="text-3xl text-white" />,
  investors: <FaRocket className="text-3xl text-white" />,
};

const AboutSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".offer-card", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      duration: 0.7,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="what-we-offer"
      className="relative w-screen bg-background pt-16 sm:pt-24 pb-16 sm:pb-24 overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center space-y-6 md:space-y-8">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-text">
            What We Offer
          </h2>
          <p className="font-body text-lg text-secondary-text max-w-3xl mx-auto">
            Tailored experiences for every member of the Chizel family. From
            playful learning to strategic growth, we've got something special
            for everyone.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pt-6">
            {offers.map((offer) => (
              <OfferCard
                key={offer.title}
                icon={iconMap[offer.icon]} 
                title={offer.title}
                description={offer.description}
                bgGradient={offer.bgGradient}
                iconGradient={offer.iconGradient}
                hoverShadow={offer.hoverShadow}
                className="offer-card" // Add a class for GSAP targeting
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;