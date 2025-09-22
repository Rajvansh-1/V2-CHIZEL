import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, memo } from "react";
import Button from "@/components/ui/Button";
import { socialLinks } from "@utils/constants";
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { trackEvent } from "@/utils/analytics";

const iconMap = {
  Instagram: <FaInstagram size="1.5em" />,
  YouTube: <FaYoutube size="1.5em" />,
  LinkedIn: <FaLinkedin size="1.5em" />,
};

const ContactSection = () => {
  const containerRef = useRef(null);
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/edit"; 

  useGSAP(() => {
    // --- OPTIMIZED ANIMATION: All elements animate in together without delay ---
    gsap.from(".contact-element, .social-icon", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      scale: 0.98,
      duration: 1,
      ease: "power3.out",
      stagger: 0.1, // A very subtle stagger for a clean, unified effect. Set to 0 if you want pure simultaneity.
    });

    gsap.utils.toArray(".contact-star").forEach(star => {
      gsap.to(star, {
        x: gsap.utils.random(-50, 50),
        y: gsap.utils.random(-50, 50),
        opacity: gsap.utils.random(0.2, 1),
        duration: gsap.utils.random(4, 8),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

  }, { scope: containerRef });

  const handleContactClick = () => {
    trackEvent('enlist_now', 'CTA', 'Contact Section Button');
    window.open(GOOGLE_FORM_URL, "_blank");
  };

  const handleSocialClick = (socialName) => {
    trackEvent('social_media_click', 'Social', `Clicked ${socialName} Icon`);
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative w-full min-h-[90vh] flex-center py-24 sm:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img src="/images/Chizel-verse-bg.jpg" alt="Cosmic background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="contact-star absolute w-px h-px bg-white rounded-full"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-8">
        
        <div className="mb-10">
            <h3 className="contact-element font-ui uppercase tracking-widest text-primary">Incoming Transmission...</h3>
            <h2 className="contact-element font-heading text-4xl sm:text-5xl md:text-6xl mt-2 animated-gradient-heading">Join The Mission</h2>
            <p className="contact-element max-w-2xl text-lg text-secondary-text leading-relaxed mt-4">
                The journey ahead requires the brightest minds and the bravest hearts. Your voice, your ideas, and your support can shape the future of learning across the galaxy.
            </p>
        </div>
        
        <div className="contact-element relative group mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary/50 rounded-full blur-md opacity-50 animate-pulse group-hover:opacity-80 transition-opacity"></div>
            <Button
              title="Enlist Now"
              onClick={handleContactClick}
              containerClass="!text-lg !py-4 !px-8"
            />
        </div>

        <div className="social-hub w-full max-w-md border-t border-white/10 pt-8">
             <h4 className="contact-element font-ui uppercase tracking-widest text-secondary-text mb-6">Follow Mission Command</h4>
             <div className="flex justify-center gap-4 md:gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Chizel on ${link.name}`}
                  className="social-icon group"
                  onClick={() => handleSocialClick(link.name)}
                >
                  <div className="w-16 h-16 flex-center bg-card/50 border-2 border-primary/20 rounded-full backdrop-blur-md transition-all duration-300 ease-out group-hover:bg-primary group-hover:border-primary/50 group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_rgba(31,111,235,0.4)]">
                    <span className="text-primary transition-colors duration-300 group-hover:text-text">
                      {iconMap[link.name]}
                    </span>
                  </div>
                </a>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ContactSection);