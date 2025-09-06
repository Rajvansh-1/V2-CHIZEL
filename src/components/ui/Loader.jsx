import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Loader = ({ setIsLoading }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  // Animate progress and iris effect
  useGSAP(() => {
    // Animate the iris opening based on progress
    gsap.to(".iris-segment", {
      scaleY: progress / 100,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.02,
    });

    // Animate the progress text
    gsap.to(".progress-text", {
      textContent: Math.round(progress),
      duration: 0.8,
      ease: "power3.out",
      snap: { textContent: 1 },
    });

    if (progress >= 100) {
      const exitTl = gsap.timeline({
        delay: 0.8,
        onComplete: () => setIsLoading(false),
      });

      // Dramatic exit animation
      exitTl
        .to(".iris-segment", {
          scaleY: 0,
          duration: 0.6,
          ease: "power3.in",
          stagger: 0.03,
        })
        .to(".loader-logo-final, .loader-text", {
            opacity: 0,
            filter: "blur(10px)",
            duration: 0.5,
            ease: "power2.in",
        }, "<")
        .to(containerRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
        }, "-=0.3");
    }
  }, { dependencies: [progress], scope: containerRef });

  // Simulate loading progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = Math.random() * 8;
        return Math.min(prev + increment, 100);
      });
    }, 120);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex-center flex-col bg-background text-text overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />

      {/* Quantum Iris */}
      <div className="absolute-center w-full h-[150%] flex-center">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="iris-segment absolute w-2 h-full bg-gradient-to-b from-primary/30 via-accent/30 to-primary/30"
            style={{
              transform: `rotate(${i * 6}deg) scaleY(0)`,
              transformOrigin: "center center",
            }}
          />
        ))}
      </div>

      {/* Central Content */}
      <div className="relative z-10 flex-center flex-col text-center">
        <img
          src="/images/logo.png"
          alt="Chizel Logo"
          className="loader-logo-final w-24 h-24 rounded-full shadow-[0_0_30px_rgba(31,111,235,0.5)] mb-8"
        />
        <div className="loader-text">
          <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-widest">
            Teleporting You Into The World Of CHIZEL
          </h1>
          <p className="font-ui text-lg text-secondary-text mt-2">
            <span className="progress-text">0</span>%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;