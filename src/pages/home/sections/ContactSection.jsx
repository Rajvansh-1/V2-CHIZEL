// src/pages/home/sections/ContactSection.jsx

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import { socialLinks } from "@utils/constants";
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

const iconMap = {
  Instagram: <FaInstagram size="1.5em" />,
  YouTube: <FaYoutube size="1.5em" />,
  LinkedIn: <FaLinkedin size="1.5em" />,
};

const ContactSection = () => {
  const containerRef = useRef(null);
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/edit"; 

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
      },
    });

    // Animate the incoming transmission text
    tl.from(".transmission-line", {
      opacity: 0,
      y: 20,
      stagger: 0.3,
      duration: 1,
      ease: "power2.out",
    });

    // Animate the button and social links
    tl.from([".contact-button", ".social-hub"], {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");

    // UI animations
    gsap.to(".radar-sweep", {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%"
    });

  }, { scope: containerRef });

  const handleContactClick = () => {
    window.open(GOOGLE_FORM_URL, "_blank");
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative w-full py-24 sm:py-32 overflow-hidden"
    >
      {/* VFX Artist's Note: The background is the view from the space station window.
          This would ideally be a very slow-moving video or a high-res image. */}
      <div className="absolute inset-0 bg-background z-0">
          <img src="/images/vision-image.webp" alt="View of Earth from space" className="w-full h-full object-cover opacity-20 blur-sm"/>
      </div>
      
      {/* Animated UI Console Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="radar-sweep absolute-center w-[80vw] h-[80vw] border-t border-primary/30 rounded-full" />
          <div className="absolute top-10 left-10 w-24 h-12 border-l-2 border-t-2 border-primary/20 rounded-tl-lg" />
          <div className="absolute bottom-10 right-10 w-24 h-12 border-r-2 border-b-2 border-primary/20 rounded-br-lg" />
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-8">
        <div className="mb-10">
            <h3 className="transmission-line font-ui uppercase tracking-widest text-primary">Incoming Transmission...</h3>
            <h2 className="transmission-line font-heading text-4xl sm:text-5xl md:text-6xl mt-2">Join The Mission</h2>
            <p className="transmission-line max-w-2xl text-lg text-secondary-text leading-relaxed mt-4">
                The journey ahead requires the brightest minds and the bravest hearts. Your voice, your ideas, and your support can shape the future of learning across the galaxy.
            </p>
        </div>
        
        <div className="contact-button relative group mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary/50 rounded-full blur-md opacity-50 animate-pulse"></div>
            <Button
              title="Enlist Now"
              containerClass="button-primary"
              onClick={handleContactClick}
            />
        </div>

        <div className="social-hub w-full max-w-md border-t border-white/10 pt-8">
             <h4 className="font-ui uppercase tracking-widest text-secondary-text mb-6">Follow Mission Command</h4>
             <div className="flex justify-center gap-8">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Chizel on ${link.name}`}
                  className="text-secondary-text transition-all duration-300 hover:text-accent hover:scale-110"
                >
                  {iconMap[link.name]}
                </a>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;