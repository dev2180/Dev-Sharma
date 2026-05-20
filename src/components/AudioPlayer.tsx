"use client";

import { useEffect, useRef, useState } from "react";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  // Cinematic preloader states
  const [hasEntered, setHasEntered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Sync background image preloading progress
  useEffect(() => {
    setMounted(true);

    // Lock body scroll while in the preloader
    if (!hasEntered) {
      document.body.style.overflow = "hidden";
      document.body.classList.remove("experience-entered");
    } else {
      document.body.classList.add("experience-entered");
    }

    // Sync initial state in case some loaded before mounting
    if ((window as any).__bgImagesProgress) {
      const { loaded, total } = (window as any).__bgImagesProgress;
      setProgress(Math.round((loaded / total) * 100));
    }

    const handleProgress = (e: Event) => {
      const { loaded, total } = (e as CustomEvent).detail;
      setProgress(Math.round((loaded / total) * 100));
    };

    window.addEventListener("bg-image-progress", handleProgress);

    return () => {
      window.removeEventListener("bg-image-progress", handleProgress);
      // Ensure body scroll is unlocked on unmount
      document.body.style.overflow = "";
    };
  }, [hasEntered]);

  const enterExperience = () => {
    setIsExiting(true);
    
    // Add the class immediately to trigger the navbar's smooth slide-down animation
    document.body.classList.add("experience-entered");

    // Force scroll restoration to top
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    // Guaranteed unmuted audio play since this is triggered by a direct click interaction
    const audio = audioRef.current;
    if (audio) {
      setIsBuffering(true);
      audio.play().then(() => {
        setPlaying(true);
        setIsBuffering(false);
      }).catch((e) => {
        console.warn("Audio playback failed:", e);
        setIsBuffering(false);
      });
    }

    // Let the fade and zoom animation play, then unmount the preloader
    setTimeout(() => {
      setHasEntered(true);
      document.body.style.overflow = "";
    }, 800);
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setIsBuffering(true);
      audio.play().then(() => {
        setPlaying(true);
        setIsBuffering(false);
      }).catch(() => {
        setIsBuffering(false);
      });
    }
  };

  const handleCanPlay = () => {
    if (playing) setIsBuffering(false);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Immersive Audio Element */}
      <audio 
        ref={audioRef} 
        src={`${process.env.NODE_ENV === "production" ? "/Dev-Sharma" : ""}/bg-music.mp3`} 
        loop 
        preload="auto"
        onCanPlayThrough={handleCanPlay}
        onWaiting={() => playing && setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
      />

      {/* Cinematic Fullscreen Preloader Overlay */}
      {!hasEntered && (
        <div
          className={`fixed inset-0 w-screen h-screen z-[99990] bg-[#030303] flex flex-col items-center justify-center select-none pointer-events-auto transition-all duration-800 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isExiting ? "opacity-0 scale-[1.06] pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          {/* Glowing blue radial mesh gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,122,255,0.06)_0%,transparent_60%)] pointer-events-none" />
          
          {/* Subtle noise texture */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />

          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
            {/* Pulsing branding eyebrow */}
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#007AFF] uppercase animate-pulse mb-6">
              Dev Sharma
            </p>

            {/* Cinematic Main Title */}
            <h1 className="font-display tracking-[0.05em] text-white text-5xl md:text-7xl mb-12 flex flex-col items-center gap-2">
              <span>EXPLORE</span>
              <span className="text-white/30 text-3xl md:text-4xl tracking-widest font-mono">PORTFOLIO</span>
            </h1>

            {/* Progress / CTA Display */}
            {progress < 100 ? (
              <div className="flex flex-col items-center gap-4 w-64">
                <div className="font-mono text-[10px] text-white/50 tracking-widest uppercase flex justify-between w-full">
                  <span>Loading Assets</span>
                  <span className="text-white font-bold">{progress}%</span>
                </div>
                <div className="w-full h-[1px] bg-white/10 overflow-hidden relative rounded-full">
                  <div 
                    className="h-full bg-[#007AFF] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(0,122,255,0.8)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 animate-[fadeIn_0.8s_ease-out_forwards]">
                {/* Double-Bezel CTA */}
                <div 
                  style={{
                    padding: "0.25rem",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "inline-block",
                  }}
                  className="transition-all duration-500 active:scale-95 group clickable"
                >
                  <button
                    onClick={enterExperience}
                    style={{
                      padding: "0.875rem 2rem",
                      borderRadius: "9999px",
                      backgroundColor: "#007AFF",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      border: "none",
                      outline: "none",
                      boxShadow: "0 4px 20px rgba(0, 122, 255, 0.3)",
                      transition: "all 0.3s ease",
                    }}
                    className="group hover:bg-white hover:text-black cursor-none"
                  >
                    Enter Experience
                    <span 
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        borderRadius: "9999px",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}
                      className="group-hover:translate-x-0.5 group-hover:scale-105"
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Ambient notification */}
                <span className="text-[9px] font-mono text-white/30 tracking-[0.2em] uppercase mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-ping" />
                  Headphones & Ambient Audio Recommended
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Audio Toggle (Bottom Right) - Only visible after entering */}
      {hasEntered && (
        <button
          onClick={toggle}
          aria-label={playing ? "Mute ambient music" : "Play ambient music"}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/10 transition-all duration-300 active:scale-95 group clickable"
        >
          {isBuffering ? (
            <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-[#007AFF] animate-spin" />
          ) : playing ? (
            <span className="flex items-end gap-[3px] h-4">
              <span className="w-[3px] rounded-full bg-[#007AFF] animate-[soundbar_0.8s_ease-in-out_infinite_alternate]" style={{height:"60%"}} />
              <span className="w-[3px] rounded-full bg-[#007AFF] animate-[soundbar_0.8s_ease-in-out_infinite_alternate_0.2s]" style={{height:"100%"}} />
              <span className="w-[3px] rounded-full bg-[#007AFF] animate-[soundbar_0.8s_ease-in-out_infinite_alternate_0.4s]" style={{height:"40%"}} />
              <span className="w-[3px] rounded-full bg-[#007AFF] animate-[soundbar_0.8s_ease-in-out_infinite_alternate_0.1s]" style={{height:"80%"}} />
            </span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50 group-hover:text-white transition-colors duration-300">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      )}

      <style>{`
        @keyframes soundbar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
