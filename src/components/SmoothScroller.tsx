"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroller() {
  useEffect(() => {
    // Disable browser scroll history restoration and reset to top
    if (typeof window !== "undefined") {
      // Clear URL hash to prevent automatic scrolling to anchor elements on reload
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
      infinite: true, // User requested infinite scroll back
    });

    // Reset scroller instance to top immediately
    lenis.scrollTo(0, { immediate: true });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker instead of rAF for frame sync
    gsap.ticker.lagSmoothing(0);
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);

    return () => {
      gsap.ticker.lagSmoothing(1); // restore default
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, []);

  return null;
}
