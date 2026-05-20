"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function GsapController() {
  useEffect(() => {
    let raf: number;

    raf = requestAnimationFrame(() => {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        // ... all your animations
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      // ctx.revert() — move ctx outside raf or use a ref
    };
  }, []);

  return null;
}
