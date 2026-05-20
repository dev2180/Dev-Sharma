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
                try {
                  if (e.message && (e.message.indexOf('ChunkLoadError') !== -1 || e.message.indexOf('Loading chunk') !== -1)) {
                    var now = Date.now();
                    var urlParams = new URLSearchParams(window.location.search);
                    var lastReload = urlParams.get('r');
                    
                    if (!lastReload) {
                      try {
                        lastReload = window.sessionStorage ? window.sessionStorage.getItem('last_chunk_reload') : null;
                      } catch (err) {
                        console.warn('sessionStorage access blocked:', err);
                      }
                    }
                    
                    if (!lastReload || (now - parseInt(lastReload, 10)) > 10000) {
                      try {
                        if (window.sessionStorage) {
                          window.sessionStorage.setItem('last_chunk_reload', now.toString());
                        }
                      } catch (err) {
                        console.warn('sessionStorage set blocked:', err);
                      }
                      console.warn('Chunk load error caught. Auto-recovering...');
                      
                      var newSearch = new URLSearchParams(window.location.search);
                      newSearch.set('r', now.toString());
                      window.location.search = newSearch.toString();
                    } else {
                      console.error('Multiple chunk load errors within 10 seconds. Halting recovery to prevent loop.');
                    }
                  }
                } catch (handlerErr) {
                  console.error('Error in ChunkLoadError handler:', handlerErr);
                }
              });

              // Clear active service workers from previous site versions to prevent cache collisions
              try {
                if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var i = 0; i < registrations.length; i++) {
                      registrations[i].unregister().catch(function(err) {
                        console.error('Error unregistering service worker:', err);
                      });
                    }
                  }).catch(function(err) {
                    console.error('Error getting service worker registrations:', err);
                  });
                }
              } catch (swErr) {
                console.error('Service worker cleanup failed:', swErr);
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
