// src/pages/home/sections/ChizelAppSection.jsx

import { useRef, useState, memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaRocket, FaBrain, FaUsers, FaLightbulb, FaGooglePlay, FaApple } from "react-icons/fa";
import Button from "@/components/ui/Button";
import { trackEvent } from "@/utils/analytics";

gsap.registerPlugin(ScrollTrigger);

// --- Memoized OrbitingIcon Component ---
const OrbitingIcon = memo(({ icon, positionClasses, delay }) => (
  <div className={`orbit-icon absolute ${positionClasses} w-10 h-10 md:w-14 md:h-14 flex-center bg-card/50 border-2 border-primary/30 rounded-full text-primary text-xl backdrop-blur-md animate-pulse`} style={{ animationDelay: `${delay}s` }}>
      {icon}
  </div>
));

// --- Main Component ---
const ChizelAppSection = () => {
  const containerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/viewform?edit_requested=true";

  const handleRedirect = () => {
    trackEvent('join_waitlist', 'CTA', 'Chizel App Section Waitlist');
    window.open(GOOGLE_FORM_URL, "_blank");
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      }
    });

    // A more fluid and interconnected animation sequence
    tl.from(".hype-text", { y: 30, opacity: 0, stagger: 0, duration: 0.8, ease: "power2.out" }) // <-- Reveal delay removed
      .fromTo(".phone-artifact-container", 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" },
        "-=0.5"
      )
      .from(".feature-display", { opacity: 0, x: (index) => index === 0 ? -30 : 30, stagger: { amount: 0.4, from: "edges" }, duration: 0.8, ease: "power2.out" }, "-=1")
      .from(".cta-button", { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=0.5");

    // Continuous background animations
    gsap.to(".phone-artifact", { y: -10, repeat: -1, yoyo: true, duration: 4, ease: "sine.inOut" });
    gsap.to(".orbit-icon", { rotation: 360, repeat: -1, duration: 20, ease: "none", stagger: 2 });
    gsap.to(".shine-effect", { x: "200%", duration: 3, repeat: -1, ease: "power1.inOut", delay: 2 });

  }, { scope: containerRef });

  return (
    <>
      <section 
        ref={containerRef} 
        id="chizel-app" 
        className="relative w-full min-h-screen flex flex-col justify-center items-center text-text overflow-hidden py-24 px-4"
      >
        {/* Consistent Space Background */}
        <div className="absolute inset-0 z-0">
          <img src="/images/Chizel-verse-bg.jpg" alt="Cosmic background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,18,38,0)_0%,var(--color-background)_90%)]"></div>
             {/* Starfield */}
          <div className="absolute inset-0 opacity-70">
            {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="absolute w-px h-px bg-white rounded-full" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate` }} />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="text-center mb-12">
            <h2 className="hype-text relative font-heading text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-badge-bg bg-clip-text text-transparent overflow-hidden">
                The Next Evolution in Learning is Coming.
                <div className="shine-effect absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </h2>
            <p className="hype-text font-body text-secondary-text text-lg md:text-xl max-w-3xl mx-auto mt-4">Be the first to experience a new universe of future learning. Pre-register now for exclusive early access and special rewards.</p>
          </div>

          <div className="relative w-full max-w-5xl h-[450px] md:h-[550px] flex items-center justify-center mt-8">
            <div className="feature-display absolute left-0 top-1/2 -translate-y-1/2 text-right space-y-10 hidden md:block">
              <div className="max-w-xs"><h3 className="font-bold text-lg">AI-Powered Learning</h3><p className="text-sm text-secondary-text">Adapts to your child's unique style.</p></div>
              <div className="max-w-xs"><h3 className="font-bold text-lg">Progress Tracking</h3><p className="text-sm text-secondary-text">Real-time developmental insights.</p></div>
            </div>
            
            <div 
              className="phone-artifact-container group relative w-64 h-[500px] md:w-80 md:h-[600px] cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="phone-artifact relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                <div className="relative w-full h-full rounded-[2.5rem] border-2 border-primary/20 bg-card/60 backdrop-blur-xl shadow-[0_0_100px_rgba(31,111,235,0.3)] flex-center flex-col p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
                  <img src="/images/logo.png" alt="Chizel Logo" className="w-24 h-24 object-contain" />
                  <p className="font-heading text-2xl mt-4">Chizel App</p>
                  <p className="text-secondary-text text-sm">Coming Soon</p>
                  <div className="flex gap-4 mt-6 text-3xl text-secondary-text"><FaApple /><FaGooglePlay /></div>
                </div>
                <OrbitingIcon icon={<FaBrain />} positionClasses="top-10 -left-8" delay={0} />
                <OrbitingIcon icon={<FaUsers />} positionClasses="top-1/2 -right-8" delay={0.5} />
                <OrbitingIcon icon={<FaLightbulb />} positionClasses="bottom-10 -left-8" delay={1} />
              </div>
            </div>

            <div className="feature-display absolute right-0 top-1/2 -translate-y-1/2 text-left space-y-10 hidden md:block">
              <div className="max-w-xs"><h3 className="font-bold text-lg">Safe Community</h3><p className="text-sm text-secondary-text">Moderated for positive collaboration.</p></div>
              <div className="max-w-xs"><h3 className="font-bold text-lg">Skill-Based Games</h3><p className="text-sm text-secondary-text">Turning screen time into skill time.</p></div>
            </div>
          </div>
          
          <div className="cta-button mt-16">
            <Button
              title="Join The Waitlist"
              onClick={() => setIsModalOpen(true)}
              rightIcon={<FaRocket />}
              containerClass="!text-lg !py-4 !px-8"
            />
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex-center bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}>
            <div className="bg-card border border-primary/30 rounded-2xl p-8 text-center max-w-sm m-4" onClick={(e) => e.stopPropagation()}>
                <FaRocket className="text-5xl text-primary mx-auto mb-4"/>
                <h3 className="font-heading text-3xl text-text mb-2">You're on the VIP List!</h3>
                <p className="text-secondary-text mb-6">Click to secure your spot for early access and exclusive rewards.</p>
                <Button title="Confirm Your Spot" onClick={handleRedirect} />
            </div>
        </div>
      )}
        <style>{`
            @keyframes twinkle {
                from { opacity: 0.2; }
                to { opacity: 1; }
            }
        `}</style>
    </>
  );
};

export default ChizelAppSection;