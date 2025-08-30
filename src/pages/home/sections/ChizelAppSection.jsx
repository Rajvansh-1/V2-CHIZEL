// src/pages/home/sections/ChizelAppSection.jsx

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FaBrain, FaUsers, FaCheckCircle, FaRocket } from "react-icons/fa";
import Button from "@/components/ui/Button";

const features = [
  { icon: <FaBrain />, label: "AI-Powered Learning", position: "top-1/4 -left-24" },
  { icon: <FaUsers />, label: "Progress Tracking", position: "top-1/2 -left-40" },
  { icon: <FaCheckCircle />, label: "Safe Community", position: "bottom-1/4 -left-28" },
];

const ChizelAppSection = () => {
  const containerRef = useRef(null);
  const artifactRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useGSAP(() => {
    // Entrance animation
    gsap.from(containerRef.current, {
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
        },
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
    });

    // Artifact floating animation
    gsap.to(artifactRef.current, {
      y: -20,
      rotation: 5,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Hover timeline
    const tl = gsap.timeline({ paused: true });
    tl.to(".callout-line", { scaleX: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" })
      .to(".callout-label", { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.3");

    artifactRef.current.addEventListener('mouseenter', () => tl.play());
    artifactRef.current.addEventListener('mouseleave', () => tl.reverse());

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="chizel-app" className="w-full bg-background text-text overflow-hidden py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8 flex flex-col items-center">
        <h2 className="font-heading text-5xl md:text-6xl text-center mb-8">A New World Awaits</h2>
        <p className="font-body text-secondary-text text-center max-w-xl mb-24">
            At the heart of our galaxy, a powerful tool has been discovered. Interact with the artifact to analyze its capabilities.
        </p>

        <div ref={artifactRef} className="relative w-72 h-[600px] cursor-pointer" onClick={() => setIsModalOpen(true)}>
          {/* The Phone Mockup - The Artifact */}
          <div className="relative w-full h-full rounded-[2.5rem] border-2 border-primary/20 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-[0_0_80px_rgba(31,111,235,0.3)] overflow-hidden">
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/15 to-badge-bg/10" />
              <div className="relative h-full w-full flex flex-col items-center justify-center p-8">
                <img src="/images/logo.png" alt="Chizel Logo" className="w-24 h-24 object-contain animate-pulse" />
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="font-ui text-sm text-primary font-medium">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Callouts */}
          {features.map((feature) => (
            <div key={feature.label} className={`absolute w-48 h-12 flex items-center ${feature.position}`}>
              <div className="callout-label opacity-0 -translate-x-4 flex items-center gap-3 text-right">
                <span className="font-ui text-sm">{feature.label}</span>
                <span className="text-primary text-xl">{feature.icon}</span>
              </div>
              <div className="callout-line w-full h-px bg-primary/50 origin-right scale-x-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Join Waitlist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex-center bg-black/70 backdrop-blur-md" onClick={() => setIsModalOpen(false)}>
            <div className="bg-card border border-primary/30 rounded-2xl p-8 text-center max-w-sm" onClick={(e) => e.stopPropagation()}>
                <FaRocket className="text-5xl text-primary mx-auto mb-4"/>
                <h3 className="font-heading text-3xl text-text mb-2">Be the First to Explore</h3>
                <p className="text-secondary-text mb-6">Join the waitlist and get exclusive early access to the Chizel App.</p>
                <Button title="Join The Waitlist" onClick={() => window.open("https://docs.google.com/forms/d/1pgIheerPwWhEGL8gNWiv-fvXsn2POEbU2HjEl4RievU/viewform?edit_requested=true", "_blank")} />
            </div>
        </div>
      )}
    </section>
  );
};

export default ChizelAppSection;