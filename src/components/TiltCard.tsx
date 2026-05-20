"use client";

import React, { useEffect, useRef } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      
      // Calculate cursor position relative to the card center
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate absolute cursor position relative to the card dimensions
      const absoluteX = (e.clientX - rect.left).toFixed(1);
      const absoluteY = (e.clientY - rect.top).toFixed(1);
      
      // Normalize values between [-1, 1]
      const normX = x / (rect.width / 2);
      const normY = y / (rect.height / 2);
      
      // Apply smooth rotation angles (max 7 degrees for premium subtle tilt)
      const rotateX = -(normY * 7).toFixed(2);
      const rotateY = (normX * 7).toFixed(2);
      
      // Shift shadow opposite to cursor to simulate three-dimensional floating depth
      const shadowX = -(normX * 15).toFixed(1);
      const shadowY = -(normY * 15).toFixed(1);
      
      // Update inline CSS transforms directly to bypass React render cycle (120 FPS performance lock)
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.boxShadow = `
        ${shadowX}px ${shadowY}px 35px rgba(0, 122, 255, 0.25),
        0 25px 50px -12px rgba(0, 0, 0, 0.75)
      `;
      card.style.borderColor = "rgba(0, 122, 255, 0.35)";
      
      // Expose cursor coordinates via CSS variables for premium hardware-accelerated spotlight gradients
      card.style.setProperty("--mouse-x", `${absoluteX}px`);
      card.style.setProperty("--mouse-y", `${absoluteY}px`);
    };

    const handleMouseEnter = () => {
      // Set responsive, snappy spring transition on entrance
      card.style.transition = "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.15s ease, border-color 0.3s ease";
    };

    const handleMouseLeave = () => {
      // Soft, lingering inertia transition back to absolute rest state
      card.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease, border-color 0.6s ease";
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.boxShadow = "";
      card.style.borderColor = "";
      
      // Clear variables on exit
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
    };

    card.addEventListener("mousemove", handleMouseMove, { passive: true });
    card.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    card.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-card-spotlight h-full ${className}`}
      style={{
        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease, border-color 0.6s ease",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}
