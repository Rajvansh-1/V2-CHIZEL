import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "@/components/common/AnimatedTitle";
import { FaLightbulb, FaGamepad, FaRocket, FaUsers } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// Data for the constellation nodes
const ecosystemNodes = [
  { id: "node-learn", icon: <FaLightbulb />, label: "Learn", position: "top-1/4 left-1/4" },
  { id: "node-play", icon: <FaGamepad />, label: "Play", position: "top-1/4 right-1/4" },
  { id: "node-grow", icon: <FaRocket />, label: "Grow", position: "bottom-1/4 left-1/4" },
  { id: "node-connect", icon: <FaUsers />, label: "Connect", position: "bottom-1/4 right-1/4" },
];

const ChizelEcosystemSection = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1.5,
        start: "top top",
        end: "+=4000",
      },
    });

    // Animate Title
    tl.from(".vision-title", { opacity: 0, y: -50, duration: 1 })
      .to(".vision-title", { opacity: 0, y: -50, duration: 1 }, "+=0.5");

    // Animate Nodes into view
    tl.from(".node", {
      scale: 0,
      opacity: 0,
      stagger: 0.3,
      duration: 1.5,
      ease: "back.out(1.7)"
    }, "-=0.5");

    // Animate constellation lines drawing
    tl.from(".constellation-path", {
      strokeDashoffset: (i, target) => target.getTotalLength(),
      duration: 2,
      ease: "power1.inOut",
      stagger: 0.5
    }, "-=1");

    // Animate central image
    tl.fromTo(".ecosystem-center-image",
      { scale: 0.5, opacity: 0, clipPath: "circle(0% at 50% 50%)" },
      { scale: 1, opacity: 1, clipPath: "circle(75% at 50% 50%)", duration: 2, ease: "power3.out" },
      "-=1.5"
    );

    // Animate final quote
    tl.from(".final-quote", { opacity: 0, y: 50, duration: 1.5 });

    // Interactive Hover Effects for Nodes
    const nodes = gsap.utils.toArray(".node");
    nodes.forEach(node => {
        const icon = node.querySelector(".node-icon");
        const ring = node.querySelector(".node-ring");

        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(ring, { scale: 1.3, opacity: 0.5, duration: 0.3, ease: "power2.out" })
               .to(icon, { scale: 1.2, color: "var(--color-primary)", duration: 0.3, ease: "power2.out" }, 0);

        node.addEventListener("mouseenter", () => hoverTl.play());
        node.addEventListener("mouseleave", () => hoverTl.reverse());
    });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="chizel-ecosystem"
      className="h-screen w-full bg-background text-text overflow-hidden"
    >
      <div className="relative w-full h-full flex-center flex-col">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-[#0c102a] to-[#1a0d2e] opacity-80" />
        <div className="absolute inset-0 opacity-30 z-0">
          {Array.from({ length: 150 }).map((_, i) => (
              <div key={i} className="absolute w-px h-px bg-white rounded-full" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate` }} />
          ))}
        </div>

        {/* Initial Title */}
        <div className="vision-title text-center absolute top-24 z-20">
          <p className="font-ui text-lg uppercase text-secondary-text tracking-wider mb-4">Our Vision</p>
          <AnimatedTitle
            title="Building a Chizel <b>Ecosystem</b>"
            containerClass="text-4xl sm:text-5xl"
          />
        </div>

        {/* Constellation Canvas */}
        <div className="absolute inset-0 w-full h-full z-10">
          {/* SVG Paths for connecting lines */}
          <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0.1 }} />
                <stop offset="50%" style={{ stopColor: "var(--color-accent)", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0.1 }} />
              </linearGradient>
            </defs>
            <path d="M250 150 L 750 150" className="constellation-path" />
            <path d="M250 450 L 750 450" className="constellation-path" />
            <path d="M250 150 L 250 450" className="constellation-path" />
            <path d="M750 150 L 750 450" className="constellation-path" />
            <path d="M250 150 L 750 450" className="constellation-path" />
            <path d="M750 150 L 250 450" className="constellation-path" />
          </svg>

          {/* Nodes */}
          {ecosystemNodes.map(node => (
            <div key={node.id} id={node.id} className={`node absolute -translate-x-1/2 -translate-y-1/2 ${node.position} flex flex-col items-center gap-3 cursor-pointer`}>
              <div className="relative flex-center w-20 h-20">
                <div className="node-ring absolute w-full h-full rounded-full bg-primary/20 scale-0 opacity-0" />
                <div className="node-icon text-3xl text-secondary-text transition-colors duration-300">
                  {node.icon}
                </div>
              </div>
              <span className="font-heading text-lg font-bold">{node.label}</span>
            </div>
          ))}

          {/* Central Image */}
          <div className="ecosystem-center-image absolute-center w-64 h-64 md:w-80 md:h-80">
            <img
              src="/images/ecosystem-image.webp"
              alt="Chizel Ecosystem"
              className="w-full h-full object-contain rounded-full shadow-2xl shadow-primary/20"
            />
          </div>
        </div>

        {/* Final Quote */}
        <div className="final-quote absolute bottom-16 md:bottom-24 text-center z-20 px-4">
          <p className="font-body text-secondary-text text-lg sm:text-xl max-w-2xl">
            "We are building a comprehensive App + Web experience for your child — where
            learning, play, and growth come together in a single, engaging journey."
          </p>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.1; transform: scale(0.8); }
          to { opacity: 0.7; transform: scale(1.1); }
        }
        .constellation-path {
          stroke: url(#lineGradient);
          stroke-width: 2;
          stroke-linecap: round;
          fill: none;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
        }
      `}</style>
    </section>
  );
};

export default ChizelEcosystemSection;