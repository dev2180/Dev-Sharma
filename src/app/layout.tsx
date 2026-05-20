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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Auto-recover from chunk load/network errors
              window.addEventListener('error', function(e) {
                if (e.message && (e.message.indexOf('ChunkLoadError') !== -1 || e.message.indexOf('Loading chunk') !== -1)) {
                  var lastReload = sessionStorage.getItem('last_chunk_reload');
                  var now = Date.now();
                  if (!lastReload || (now - parseInt(lastReload, 10)) > 10000) {
                    sessionStorage.setItem('last_chunk_reload', now);
                    console.warn('Chunk load error caught. Auto-recovering...');
                    window.location.reload();
                  }
                }
              });

              // Clear active service workers from previous site versions to prevent cache collisions
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var i = 0; i < registrations.length; i++) {
                    registrations[i].unregister().then(function(success) {
                      if (success) {
                        console.log('Unregistered active service worker. Refreshing...');
                        window.location.reload();
                      }
                    });
                  }
                });
              }
            `
          }}
        />
      </head>
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
