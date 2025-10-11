// src/pages/ProfessionalPage.jsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowDown, FaQuoteLeft } from "react-icons/fa";
import Button from "@/components/ui/Button";
import ImpactSection from "@/components/professional/ImpactSection";
import SolutionSection from "@/components/professional/SolutionSection";
import ProblemStatementSection from "@/pages/home/sections/ProblemStatementSection";

gsap.registerPlugin(ScrollTrigger);

const ProfessionalPage = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Animate hero elements
    gsap.from(".hero-anim-element", {
      opacity: 0,
      y: 50,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.5,
    });

    // Scroll down prompt animation
    gsap.to(".scroll-down-prompt", {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "sine.inOut",
    });

    // Animate stars for a subtle floating effect
    gsap.utils.toArray(".prof-star").forEach(star => {
      gsap.to(star, {
        x: gsap.utils.random(-30, 30),
        y: gsap.utils.random(-30, 30),
        duration: gsap.utils.random(5, 10),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

  }, { scope: containerRef });

  const handleEnlistClick = () => {
    window.open("https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/edit", "_blank");
  };

  return (
    <div ref={containerRef} className="bg-background text-text relative overflow-x-hidden">
      {/* ===== UNIFIED CELESTIAL BACKGROUND ===== */}
      <div className="absolute inset-0 z-0">
        <div className="fixed inset-0">
          <img src="/images/Chizel-verse-bg.jpg" alt="Cosmic background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
          <div className="absolute inset-0">
            {Array.from({ length: 150 }).map((_, i) => (
              <div
                key={i}
                className="prof-star absolute w-px h-px bg-white rounded-full"
                style={{ 
                  top: `${Math.random() * 100}%`, 
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.6 + 0.3
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen w-screen flex flex-col items-center justify-center text-center p-4">
        <video
          src="/videos/home-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-25 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_20%,transparent_70%)]"
        />
        
        <div className="relative z-20 flex flex-col items-center">
          <img src="/images/logo.png" alt="Chizel Logo" className="hero-anim-element w-24 h-24 md:w-32 md:h-32 mb-4 drop-shadow-[0_0_20px_rgba(31,111,235,0.5)]" />
          <h1 className="hero-anim-element font-heading text-4xl sm:text-5xl md:text-7xl font-bold uppercase drop-shadow-lg">
            From <span className="text-red-500">Brainrot</span> to <span className="animated-gradient-heading">Brilliance</span>
          </h1>
          <p className="hero-anim-element max-w-3xl mx-auto mt-6 text-base sm:text-lg md:text-xl text-secondary-text">
            Chizel is not just another app; it's a revolution. We're on a mission to transform every moment of screen time into a powerful step toward a child's greatness.
          </p>
          <div className="scroll-down-prompt absolute bottom-[-10vh] flex flex-col items-center gap-2 text-secondary-text hero-anim-element">
            <span className="font-ui text-sm">Discover the Mission</span>
            <FaArrowDown />
          </div>
        </div>
      </section>

      {/* The rest of the page content scrolls over the fixed background */}
      <div className="relative z-10">
        <ProblemStatementSection />
        <ImpactSection />
        <SolutionSection />

        <section className="py-24 bg-card/20 backdrop-blur-sm">
          <div className="container mx-auto px-6 text-center">
             <FaQuoteLeft className="text-4xl text-primary/50 mx-auto mb-6" />
             <blockquote className="font-heading text-3xl md:text-5xl text-text max-w-5xl mx-auto leading-tight font-bold">
              "We Are Not Raising Children — We Are Forging The Architects of a Future Beyond Even Our Wildest Dreams."
            </blockquote>
            <cite className="font-body text-xl text-primary mt-6 block">- Chizel Founders</cite>
          </div>
        </section>

        <section className="py-24 text-center">
           <div className="container mx-auto px-6">
              <h2 className="font-heading text-4xl md:text-6xl font-bold animated-gradient-heading">The Mission Awaits.</h2>
              <p className="max-w-2xl mx-auto mt-4 text-lg text-secondary-text">Your voice, your ideas, and your support can shape the future of learning across the galaxy. Join us.</p>
               <div className="mt-10">
                  <Button
                    title="Enlist Now & Join the Waitlist"
                    onClick={handleEnlistClick}
                    containerClass="!text-lg !py-4 !px-8 mx-auto"
                  />
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default ProfessionalPage;