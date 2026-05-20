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
      infinite: true,
    });

    if (destroyed) { lenis.destroy(); return; }

    lenis.scrollTo(0, { immediate: true });
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);

    // Mobile infinite scroll
    let touchStartY = 0;
    const docHeight = () => document.documentElement.scrollHeight - window.innerHeight;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (destroyed) return;
      const delta = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;

      const current = window.scrollY;
      const max = docHeight();

      let next = current + delta;
      if (next < 0) next = max + next;
      if (next > max) next = next - max;

      lenis.scrollTo(next, { immediate: true });
      e.preventDefault();
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      destroyed = true;
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      gsap.ticker.lagSmoothing(1);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, []);

  return null;
}