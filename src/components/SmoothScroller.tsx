"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroller() {
  useEffect(() => {
    let destroyed = false;

    if (typeof window !== "undefined") {
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
    });

    if (destroyed) { lenis.destroy(); return; } // ← bail if already unmounted

    lenis.scrollTo(0, { immediate: true });
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);

    return () => {
      destroyed = true;
      gsap.ticker.lagSmoothing(1);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, []);

  return null;
}