import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, memo } from "react";
import Button from "@/components/ui/Button"; //
import { socialLinks } from "@utils/constants"; //
import { FaInstagram, FaYoutube, FaLinkedin, FaFacebook } from "react-icons/fa"; //
import { FaXTwitter } from "react-icons/fa6";
import { trackEvent } from "@/utils/analytics"; //

// Icon mapping (ensure FaFacebook is included)
const iconMap = {
  Instagram: <FaInstagram size="1.5em" />,
  YouTube: <FaYoutube size="1.5em" />,
  LinkedIn: <FaLinkedin size="1.5em" />,
  Twitter: <FaXTwitter size="1.5em" />,
  Facebook: <FaFacebook size="1.5em" />, //
};
// Make sure this file reference is correct based on your file structure
// @filename: rajvansh-1/v2-chizel/V2-CHIZEL-a8dabf8e1aeb82c6d951192d869fb06c37e27643/src/pages/home/sections/ContactSection.jsx

const ContactSection = () => {
  const containerRef = useRef(null);
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/edit";

  useGSAP(() => {
    // --- Section Entrance Animation (remains the same) ---
    gsap.from(".contact-element", { // .social-icon animation handled separately now
      scrollTrigger: { trigger: containerRef.current, start: "top 70%", toggleActions: "play none none reverse" }, //
      opacity: 0, y: 30, scale: 0.98, duration: 1, ease: "power3.out", stagger: 0.1, //
    });

    // --- Star Animation (remains the same) ---
    gsap.utils.toArray(".contact-star").forEach(star => { /* ... star animation ... */ }); //

    // --- Enhanced Social Icon Animations ---
    const icons = gsap.utils.toArray(".social-icon-link"); // Target the link directly

    // Entrance Animation for Icons
    gsap.from(icons, {
        scrollTrigger: { trigger: ".social-hub", start: "top 80%", toggleActions: "play none none reverse"},
        opacity: 0,
        y: 20,
        scale: 0.8,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.4)"
    });

    // Hover Animations for Icons
    icons.forEach((iconLink) => {
        const iconWrapper = iconLink.querySelector(".social-icon-wrapper");
        const iconItself = iconWrapper.querySelector("span"); // The span holding the react-icon
        const pingEffect = iconLink.querySelector(".ping-effect");

        const tl = gsap.timeline({ paused: true });

        tl.to(iconWrapper, {
                scale: 1.2,
                rotate: 10,
                backgroundColor: 'var(--color-primary)', // Use CSS var
                borderColor: 'rgba(255, 255, 255, 0.3)', // Brighter border
                boxShadow: '0 0 30px 5px rgba(31, 111, 235, 0.5)', // Enhanced glow
                duration: 0.3,
                ease: 'power2.out'
            })
          .to(iconItself, {
                color: '#FFFFFF', // Change icon color to white
                scale: 1.1,      // Slightly scale icon
                duration: 0.3,
                ease: 'power2.out'
            }, 0) // Run concurrently with wrapper animation
          // Ping effect
          .fromTo(pingEffect,
                { scale: 0.5, opacity: 0.8 },
                { scale: 1.8, opacity: 0, duration: 0.4, ease: 'power1.out' },
            0); // Start ping immediately

        iconLink.addEventListener("mouseenter", () => tl.play());
        iconLink.addEventListener("mouseleave", () => tl.reverse());
    });


  }, { scope: containerRef }); //

  // --- Event Handlers (remain the same) ---
  const handleContactClick = () => { /* ... */ }; //
  const handleSocialClick = (socialName) => { /* ... */ }; //

  return (
    <section
      ref={containerRef} //
      id="contact" //
      className="relative w-full min-h-[90vh] flex-center py-24 sm:py-32 overflow-hidden" //
    >
      {/* Background elements */}
      {/* Background elements */}
<div className="absolute inset-0 z-0">
  <img src="/images/Chizel-verse-bg.jpg" alt="Cosmic background" className="w-full h-full object-cover" /> {/* */}
  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div> {/* */}
  <div className="absolute inset-0">
    {/* Corrected Star Rendering Loop */}
    {Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i} //
        className="contact-star absolute w-px h-px bg-white rounded-full" //
        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} //
      />
    ))}
  </div>
</div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-8"> {/* */}
        {/* Header */}
        <div className="mb-10"> {/* */}
            <h3 className="contact-element font-ui uppercase tracking-widest text-primary">Incoming Transmission...</h3> {/* */}
            <h2 className="contact-element font-heading text-4xl sm:text-5xl md:text-6xl mt-2 animated-gradient-heading">Join The Mission</h2> {/* */}
            <p className="contact-element max-w-2xl text-lg text-secondary-text leading-relaxed mt-4"> {/* */}
                The journey ahead requires the brightest minds and the bravest hearts... {/* */}
            </p>
        </div>
        {/* CTA Button */}
        <div className="contact-element relative group mb-16"> {/* */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary/50 rounded-full blur-md opacity-50 animate-pulse group-hover:opacity-80 transition-opacity"></div> {/* */}
            <Button title="Enlist Now" onClick={handleContactClick} containerClass="!text-lg !py-4 !px-8"/> {/* */}
        </div>

        {/* Social Hub */}
        <div className="social-hub w-full max-w-lg border-t border-white/10 pt-8"> {/* */}
             <h4 className="contact-element font-ui uppercase tracking-widest text-secondary-text mb-6">Follow Mission Command</h4> {/* */}
             <div className="flex flex-wrap justify-center gap-6 md:gap-8"> {/* Increased gap */} {/* */}
              {socialLinks.map((link) => ( //
                <a
                  key={link.name} //
                  href={link.href} //
                  target="_blank" //
                  rel="noopener noreferrer" //
                  aria-label={`Follow Chizel on ${link.name}`} //
                  className="social-icon-link relative" // Use this class for GSAP targeting and positioning context
                  onClick={() => handleSocialClick(link.name)} //
                >
                  {/* Outer container for idle animation */}
                  <div className="social-icon-float" >
                      {/* Wrapper for hover scale/rotate/glow */}
                      <div className="social-icon-wrapper w-16 h-16 relative flex-center bg-card/60 border-2 border-primary/20 rounded-full backdrop-blur-md transition-colors duration-300"> {/* Added relative */} {/* */}
                        {/* Ping effect element */}
                        <div className="ping-effect absolute inset-0 rounded-full border-2 border-primary opacity-0"/>
                        {/* Icon */}
                        <span className="relative z-10 text-primary transition-colors duration-300"> {/* Added relative z-10 */} {/* */}
                          {iconMap[link.name]} {/* */}
                        </span>
                      </div>
                  </div>
                </a>
              ))}
            </div>
        </div>
      </div>
      {/* Add CSS for idle float animation */}
      <style jsx global>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .social-icon-float {
          animation: gentleFloat 4s infinite ease-in-out;
        }
        /* Add slight delay variation for each icon */
        .social-icon-link:nth-child(2) .social-icon-float { animation-delay: 0.3s; }
        .social-icon-link:nth-child(3) .social-icon-float { animation-delay: 0.6s; }
        .social-icon-link:nth-child(4) .social-icon-float { animation-delay: 0.9s; }
        .social-icon-link:nth-child(5) .social-icon-float { animation-delay: 1.2s; } /* For Facebook */
      `}</style>
    </section>
  );
};

export default memo(ContactSection); 