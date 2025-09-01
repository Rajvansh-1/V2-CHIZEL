// src/components/common/GravityTitle.jsx

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import clsx from "clsx";

const GravityTitle = ({ title, containerClass }) => {
  const containerRef = useRef(null);

  // Split the title into lines and then characters for animation
  const lines = title.split("<br />").map(line =>
    line.split("").map(char => (char === " " ? "\u00A0" : char))
  );

  useGSAP(() => {
    // Set initial random positions for each character
    gsap.utils.toArray(".gravity-char").forEach(char => {
      gsap.set(char, {
        x: gsap.utils.random(-200, 200),
        y: gsap.utils.random(-150, 150),
        scale: gsap.utils.random(0.5, 2),
        rotation: gsap.utils.random(-180, 180),
        opacity: 0,
      });
    });

    // Animate characters to their final position
    gsap.to(".gravity-char", {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 1.5,
      stagger: 0.04,
      ease: "power3.out",
      delay: 0.5,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={clsx("gravity-title-container", containerClass)}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="flex justify-center flex-wrap">
          {line.map((char, charIndex) => (
            <span key={charIndex} className="gravity-char wavy-gradient-text inline-block">
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GravityTitle;