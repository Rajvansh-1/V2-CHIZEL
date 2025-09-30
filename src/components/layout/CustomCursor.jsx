// src/components/layout/CustomCursor.jsx
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  // An improved, more reliable check for touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkIsTouch = () => {
      // This is a more robust way to detect touch capabilities
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);
    };
    checkIsTouch();
    window.addEventListener("resize", checkIsTouch);
    return () => window.removeEventListener("resize", checkIsTouch);
  }, []);


  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);

  const { contextSafe } = useGSAP({ scope: document.body });

  useEffect(() => {
    // If it's a touch device, do nothing.
    if (isTouchDevice) {
      document.body.style.cursor = "auto";
      return;
    }

    document.body.style.cursor = "none";

    const moveCursor = contextSafe((e) => {
      const { clientX, clientY } = e;
      gsap.to(cursorRingRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.to(cursorDotRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.2,
        ease: "power3.out",
      });
    });

    const handleMouseOver = (e) => {
      const isInteractive = e.target.closest(
        'a, button, [role="button"], .cursor-pointer'
      );
      setIsHovering(!!isInteractive);
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isTouchDevice, contextSafe]);

  // GSAP: Animate cursor based on hover state
  useGSAP(() => {
    if (isTouchDevice) return;

    gsap.to(cursorRingRef.current, {
      scale: isHovering ? 1.8 : 1,
      opacity: isHovering ? 0.7 : 1,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(cursorDotRef.current, {
      scale: isHovering ? 0 : 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isHovering, isTouchDevice]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* ============== OUTER CURSOR RING ============== */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999]"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="w-full h-full border-2 rounded-full border-accent" />
      </div>

      {/* ============== INNER CURSOR DOT ============== */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999]"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="w-full h-full rounded-full bg-text" />
      </div>
    </>
  );
};

export default CustomCursor;