import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaRocket, FaBrain, FaUsers, FaLightbulb, FaGooglePlay, FaApple } from "react-icons/fa";
import Button from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

// --- Main Component ---
const ChizelAppSection = () => {
  const containerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/1pgIheerPwWhEGL8gNWiv-fvXsn2POEbU2HjEl4RievU/viewform?edit_requested=true";
  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window;

  const handleRedirect = () => {
    window.open(GOOGLE_FORM_URL, "_blank");
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        toggleActions: "play none none reverse",
      }
    });

    tl.from(".hype-text", { y: 50, opacity: 0, stagger: 0.15, duration: 1, ease: "power3.out" })
      .fromTo(".phone-artifact-container", 
        { y: 100, scale: 0.7, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1.2, ease: "expo.out" },
        "-=0.5"
      )
      .from(".feature-display", { opacity: 0, scale: 0.8, stagger: { amount: 0.5, from: "edges" }, duration: 0.7, ease: "power2.out" }, "-=0.8")
      .from(".cta-button", { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=0.5");

    gsap.to(".phone-artifact", { y: -15, repeat: -1, yoyo: true, duration: 5, ease: "sine.inOut" });
    gsap.to(".orbit-icon", { rotation: 360, repeat: -1, duration: 10, ease: "none", stagger: 2 });
    gsap.to(".shine-effect", { x: "200%", duration: 3, repeat: -1, ease: "power1.inOut", delay: 2 });
  }, { scope: containerRef });

  const OrbitingIcon = ({ icon, positionClasses }) => (
    <div className={`orbit-icon absolute ${positionClasses} w-10 h-10 md:w-12 md:h-12 flex-center bg-card/50 border border-primary/20 rounded-full text-primary text-xl`}>
        {icon}
    </div>
  );

  return (
    <>
      <section 
        ref={containerRef} 
        id="chizel-app" 
        className={`relative w-full min-h-screen flex flex-col justify-center items-center bg-background text-text overflow-hidden py-20 px-4 ${isMobile ? 'cursor-pointer' : ''}`}
        onClick={isMobile ? handleRedirect : undefined}
      >
        {/* Background Grid & Glows */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-primary/10"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1/2 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="text-center mb-10">
            <h2 className="hype-text relative font-heading text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-badge-bg bg-clip-text text-transparent overflow-hidden">
                The Next Evolution in Learning is Coming.
                <div className="shine-effect absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </h2>
            <p className="hype-text font-body text-secondary-text text-lg md:text-xl max-w-3xl mx-auto mt-4">Be the first to experience a new universe of smart play. Pre-register now for exclusive early access and special rewards.</p>
          </div>

          <div className="relative w-full max-w-5xl h-[450px] md:h-[500px] flex items-center justify-center mt-8">
            <div className="feature-display absolute left-0 top-1/2 -translate-y-1/2 text-right space-y-8 hidden md:block">
              <div className="max-w-xs"><h3 className="font-bold text-lg">AI-Powered Learning</h3><p className="text-sm text-secondary-text">Adapts to your child's unique style.</p></div>
              <div className="max-w-xs"><h3 className="font-bold text-lg">Progress Tracking</h3><p className="text-sm text-secondary-text">Real-time developmental insights.</p></div>
            </div>
            
            <div className="phone-artifact-container group relative w-72 h-[550px] md:w-80 md:h-[600px] transition-transform duration-300 md:hover:scale-105">
              <div className="phone-artifact relative w-full h-full">
                <div className="relative w-full h-full rounded-[2.5rem] border-2 border-primary/30 bg-card/50 backdrop-blur-xl shadow-[0_0_100px_rgba(31,111,235,0.4)] flex-center flex-col p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
                  <img src="/images/logo.png" alt="Chizel Logo" className="w-24 h-24 object-contain animate-pulse" />
                  <div className="flex gap-4 mt-6 text-3xl text-secondary-text"><FaApple /><FaGooglePlay /></div>
                </div>
                <OrbitingIcon icon={<FaBrain />} positionClasses="top-10 -left-5" />
                <OrbitingIcon icon={<FaUsers />} positionClasses="top-1/2 -right-5" />
                <OrbitingIcon icon={<FaLightbulb />} positionClasses="bottom-10 -left-5" />
              </div>
            </div>

            <div className="feature-display absolute right-0 top-1/2 -translate-y-1/2 text-left space-y-8 hidden md:block">
              <div className="max-w-xs"><h3 className="font-bold text-lg">Safe Community</h3><p className="text-sm text-secondary-text">Moderated for positive collaboration.</p></div>
              <div className="max-w-xs"><h3 className="font-bold text-lg">Skill-Based Games</h3><p className="text-sm text-secondary-text">Turning screen time into skill time.</p></div>
            </div>
          </div>
          
          <div className="cta-button mt-12">
            <Button
              title="Join The Waitlist & Get Early Access"
              onClick={(e) => {
                if (!isMobile) {
                  e.stopPropagation(); // Prevent section's onClick on desktop
                  setIsModalOpen(true);
                }
              }}
              rightIcon={<FaRocket />}
              containerClass="!text-lg !py-4 !px-8"
            />
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex-center bg-black/70 backdrop-blur-md" onClick={() => setIsModalOpen(false)}>
            <div className="bg-card border border-primary/30 rounded-2xl p-8 text-center max-w-sm m-4" onClick={(e) => e.stopPropagation()}>
                <FaRocket className="text-5xl text-primary mx-auto mb-4"/>
                <h3 className="font-heading text-3xl text-text mb-2">You're on the VIP List!</h3>
                <p className="text-secondary-text mb-6">Click to secure your spot for early access and exclusive rewards.</p>
                <Button title="Confirm Your Spot" onClick={handleRedirect} />
            </div>
        </div>
      )}
    </>
  );
};

export default ChizelAppSection;