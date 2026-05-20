import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";
import { SmoothScroller } from "@/components/SmoothScroller";
import { GsapController } from "@/components/GsapController";
import { CanvasBackground } from "@/components/CanvasBackground";
import { SpaceCursor } from "@/components/SpaceCursor";
import { AudioPlayer } from "@/components/AudioPlayer";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Dev Sharma — GenAI Engineer",
  description: "GenAI Engineer specialising in agentic pipelines, RAG systems and LangGraph. Currently building production AI workflows at Astroraaga.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${bebasNeue.variable} ${outfit.variable} font-body antialiased bg-black text-white selection:bg-white selection:text-black cursor-none`}
      >
        <SpaceCursor />
        <AudioPlayer />
        <CanvasBackground />
        <SmoothScroller />
        <GsapController />
        {children}
      </body>
    </html>
  );
}
