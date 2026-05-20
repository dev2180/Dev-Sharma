"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function SpaceCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Set initial positions offscreen to prevent flash
    gsap.set(dot, { x: -100, y: -100 });
    gsap.set(ring, { x: -100, y: -100 });

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      // Central dot tracks mouse extremely fast
      gsap.to(dot, {
        x: clientX,
        y: clientY,
        duration: 0.08,
        ease: "power2.out",
      });

      // Outer ring tracks mouse with smooth lag (spring inertia)
      gsap.to(ring, {
        x: clientX,
        y: clientY,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Event delegation for hover interactions
    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a, button, [role='button'], details summary, .project-card, .li-card, .clickable"
      );
      if (target) {
        // Expand ring and shift to glowing Electric Blue glass
        gsap.to(ring, {
          scale: 1.6,
          borderColor: "rgba(0, 122, 255, 0.6)",
          backgroundColor: "rgba(0, 122, 255, 0.08)",
          duration: 0.3,
          ease: "power2.out",
        });

        // Anchor/minimize central dot and color it blue
        gsap.to(dot, {
          scale: 0.5,
          backgroundColor: "#007AFF",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a, button, [role='button'], details summary, .project-card, .li-card, .clickable"
      );
      if (target) {
        // Restore standard states
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(255, 255, 255, 0.25)",
          backgroundColor: "rgba(0, 0, 0, 0)",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(dot, {
          scale: 1,
          backgroundColor: "#ffffff",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      {/* Central precise dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[100000] -translate-x-1/2 -translate-y-1/2"
      />
      {/* Organic trailing outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-7 h-7 rounded-full border border-white/25 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
      />
    </>
  );
}

