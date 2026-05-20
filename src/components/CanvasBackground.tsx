"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas dimensions to window innerHeight/Width
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const frameCount = 163;
    const currentFrame = (index: number) =>
      `${process.env.NODE_ENV === "production" ? "/Dev-Sharma" : ""}/frames/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;

    const images: HTMLImageElement[] = [];
    const seq = {
      progress: 0,
    };

    // Initialize global state for instant mounting sync
    (window as any).__bgImagesProgress = { loaded: 0, total: frameCount };

    let loadedCount = 0;
    const counted = new Set<number>();

    const onImageLoaded = (index: number) => {
      if (counted.has(index)) return;
      counted.add(index);
      loadedCount++;

      const progress = { loaded: loadedCount, total: frameCount };
      (window as any).__bgImagesProgress = progress;

      window.dispatchEvent(
        new CustomEvent("bg-image-progress", {
          detail: progress,
        })
      );

      // Render the frame immediately if it matches the active scroll frame
      render();
    };

    // Preload all images and dispatch progress events
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.onload = () => onImageLoaded(i);
      img.onerror = () => onImageLoaded(i); // Count errors to prevent loader hangs
      img.src = currentFrame(i);
      images.push(img);

      // If cached by the browser, count it immediately
      if (img.complete) {
        onImageLoaded(i);
      }
    }

    let virtualFrame = 0;
    let lastProgress = 0;
    let lastRenderedFrame = -1;
    let lastWidth = 0;
    let lastHeight = 0;

    function render() {
      if (!canvas || !context) return;
      
      const p = seq.progress;
      let dp = p - lastProgress;
      
      // Handle infinite scroll wrapping boundary jumps
      if (dp > 0.5) dp -= 1.0;
      else if (dp < -0.5) dp += 1.0;
      
      // Always advance forward by adding the absolute difference (modulo to keep bounded)
      virtualFrame = (virtualFrame + Math.abs(dp) * (frameCount - 1)) % (frameCount - 1);
      lastProgress = p;
      
      const currentFrameIndex = Math.min(
        frameCount,
        Math.max(1, Math.round(1 + virtualFrame))
      );
      
      // Determine which image to draw: prefer currentFrameIndex if complete, otherwise fallback to lastRenderedFrame
      let imgToDraw = images[currentFrameIndex - 1];
      let frameToDraw = currentFrameIndex;
      
      if (!imgToDraw || !imgToDraw.complete) {
        if (lastRenderedFrame !== -1) {
          imgToDraw = images[lastRenderedFrame - 1];
          frameToDraw = lastRenderedFrame;
        }
      }

      if (!imgToDraw || !imgToDraw.complete) {
        return; // Nothing to draw yet
      }

      // Skip rendering if everything is identical to the last frame
      if (
        frameToDraw === lastRenderedFrame &&
        canvas.width === lastWidth &&
        canvas.height === lastHeight
      ) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      
      const scale = Math.max(canvas.width / imgToDraw.width, canvas.height / imgToDraw.height);
      const x = (canvas.width / 2) - (imgToDraw.width / 2) * scale;
      const y = (canvas.height / 2) - (imgToDraw.height / 2) * scale;
      context.drawImage(imgToDraw, x, y, imgToDraw.width * scale, imgToDraw.height * scale);
      
      lastRenderedFrame = frameToDraw;
      lastWidth = canvas.width;
      lastHeight = canvas.height;
    }

    let lastTargetProgress = 0;
    let progressTween: gsap.core.Tween | null = null;

    const handleScrollUpdate = (targetProgress: number) => {
      const dp = targetProgress - lastTargetProgress;
      
      if (Math.abs(dp) > 0.5) {
        // Wrapped instantly! Set progress instantly to prevent backward scrub jitter
        if (progressTween) progressTween.kill();
        seq.progress = targetProgress;
        render();
      } else {
        // Normal scroll: tween progress smoothly
        if (progressTween) progressTween.kill();
        progressTween = gsap.to(seq, {
          progress: targetProgress,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: render,
        });
      }
      
      lastTargetProgress = targetProgress;
    };

    // Scroll trigger animation
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          handleScrollUpdate(self.progress);
        },
      });
    });

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Perform an initial render draw
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (progressTween) progressTween.kill();
      ctx.revert();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen -z-20 pointer-events-none blur-[6px] brightness-[0.4] scale-105"
      />
      {/* Heavy Vignette to focus center and darken edges */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      {/* SVN Film Grain to add cinematic texture */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none opacity-[0.25] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
    </>
  );
}
