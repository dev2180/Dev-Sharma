"use client";

import { useEffect, useRef } from "react";

interface ShaderCanvasProps {
  type: "liquid" | "digital" | "stealth" | "neural";
}

export function ShaderCanvas({ type }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Track active rendering state
    let isRendering = true;
    let animationFrameId: number;

    // Relative mouse coordinates mapped to [0, 1]
    const mouse = { x: 0.5, y: 0.5 };
    const targetMouse = { x: 0.5, y: 0.5 };

    // Get WebGL context
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not supported in this browser.");
      return;
    }

    // ─── SHADER COMPILATION HELPER ───────────────────────────────────────────
    const compileShader = (source: string, shaderType: number): WebGLShader | null => {
      const shader = gl.createShader(shaderType);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    // ─── VERTEX SHADER ───────────────────────────────────────────────────────
    const vsSource = `
      attribute vec2 position;
      varying vec2 v_uv;
      void main() {
        v_uv = position * 0.5 + 0.5;
        // Flip Y to match traditional screen coordinates
        v_uv.y = 1.0 - v_uv.y;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // ─── FRAGMENT SHADER SOURCES ─────────────────────────────────────────────
    let fsSource = "";
    const sharedHeader = `
      precision mediump float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }
    `;

    if (type === "liquid") {
      // Quantum Fluid Wave - highly active, self-animated, coordinate-warped cosmic wave fronts
      fsSource = `
        ${sharedHeader}
        void main() {
          vec2 uv = v_uv;
          
          // 1. Double coordinate distortion (creating a self-animating turbulent liquid)
          float t = u_time * 0.8;
          
          // Warp uv coordinates using time-modulated high-frequency wave patterns
          vec2 warp = vec2(
            sin(uv.x * 6.0 + uv.y * 3.0 + t) * 0.15,
            cos(uv.x * 3.0 - uv.y * 5.0 - t * 1.2) * 0.15
          );
          
          // Dynamic secondary warp (cascade)
          vec2 uvWarped = uv + warp;
          
          // 2. High-contrast multi-octave wave superposition (Mesmerizing continuous flow)
          float waveA = sin(uvWarped.x * 5.0 + t * 1.5) * cos(uvWarped.y * 4.0 - t * 0.8);
          float waveB = cos(uvWarped.x * 12.0 - t * 2.2) * sin(uvWarped.y * 8.0 + t * 1.6);
          float waveC = sin((uvWarped.x + uvWarped.y) * 18.0 + t * 3.0);
          
          // Combine waves with varying weights to construct rich fluid complexity
          float compositeFlow = waveA * 0.6 + waveB * 0.3 + waveC * 0.1;
          // Map to absolute positive range
          compositeFlow = abs(compositeFlow);
          
          // 3. High-precision mouse interactive magnetic vortex
          float mouseDist = distance(uv, u_mouse);
          float hoverActivation = smoothstep(0.4, 0.0, mouseDist);
          // Pull waves towards cursor on hover
          uvWarped -= normalize(uv - u_mouse) * hoverActivation * 0.08;
          
          // Re-evaluate localized flow around mouse
          float localWave = sin(uvWarped.x * 8.0 + t * 2.0) * cos(uvWarped.y * 8.0 - t * 1.5);
          
          // 4. Chromatic morphing (the colors themselves breathe and rotate continuously)
          float colorCycle = sin(t * 0.4) * 0.5 + 0.5;
          vec3 electricBlue = vec3(0.0, 0.48, 1.0);
          vec3 cyberCyan = vec3(0.0, 0.88, 1.0);
          vec3 magentaViolet = vec3(0.68, 0.05, 1.0);
          
          // Breathe colors over time and spatial flow density
          vec3 currentColor = mix(electricBlue, magentaViolet, colorCycle);
          currentColor = mix(currentColor, cyberCyan, compositeFlow * 0.7);
          
          // Highlight vortex color on mouse hover
          currentColor = mix(currentColor, cyberCyan, hoverActivation * 0.5);
          
          // 5. Total glow density
          // Boosted base glow, highly active self-animation flow, and dynamic mouse glow
          float glow = 0.28 + (compositeFlow * 0.95) + (abs(localWave) * hoverActivation * 0.45);
          vec3 finalColor = currentColor * glow;
          
          // 6. Delicate micro-shimmer lines mapping coordinates
          float shimmer = step(0.982, sin(uvWarped.y * 80.0 + t * 4.0)) * 0.15;
          finalColor += cyberCyan * shimmer * (0.3 + hoverActivation * 0.7);
          
          // Vignette frame blending
          float vignette = v_uv.x * v_uv.y * (1.0 - v_uv.x) * (1.0 - v_uv.y);
          vignette = clamp(pow(16.0 * vignette, 0.35), 0.0, 1.0);
          
          gl_FragColor = vec4(finalColor * vignette, 0.9);
        }
      `;
    } else if (type === "digital") {
      // Falling binary/coordinate scanner grid - bright matrix laser crosshair
      fsSource = `
        ${sharedHeader}
        void main() {
          // Slice coordinates into granular grid cells (40 cols, 20 rows)
          vec2 gridCount = vec2(40.0, 20.0);
          vec2 gridPos = floor(v_uv * gridCount);
          vec2 gridF = fract(v_uv * gridCount);
          
          // Unique random seed per column
          float colSeed = hash(vec2(gridPos.x, 23.41));
          
          // Falling velocity
          float speed = 0.5 + colSeed * 1.5;
          float pulse = fract(-v_uv.y * 1.5 + u_time * speed * 0.35 + colSeed);
          
          // Pixel borders to render distinct digital grid dots
          float borderMask = step(0.12, gridF.x) * step(0.12, gridF.y);
          
          // Coordinate crosshair highlight triggered by mouse
          float xDist = abs(v_uv.x - u_mouse.x);
          float yDist = abs(v_uv.y - u_mouse.y);
          
          // Sharpened dynamic laser lines crossing at cursor coordinates (increased glow)
          float laserX = smoothstep(0.015, 0.0, xDist) * 0.65;
          float laserY = smoothstep(0.03, 0.0, yDist) * 0.65;
          float scanLines = (laserX + laserY) * borderMask;
          
          // Proximity radial fade to bound matrix glow locally
          float mDist = distance(v_uv, u_mouse);
          float hoverActivation = smoothstep(0.42, 0.0, mDist);
          
          // Render falling bytes and coordinate crosshair lasers
          vec3 matrixColor = vec3(0.0, 0.48, 1.0); // Electric Blue
          
          // Boosted dynamic intensity values
          float intensity = (pulse * 0.28) + (scanLines * hoverActivation * 1.6);
          vec3 finalColor = matrixColor * intensity * borderMask;
          
          // Add rich ambient background noise glow
          finalColor += matrixColor * 0.03 * borderMask * (1.0 - hoverActivation);
          
          gl_FragColor = vec4(finalColor, 0.8);
        }
      `;
    } else if (type === "stealth") {
      // Pulsing radial gravity well - strong black hole singularity glow
      fsSource = `
        ${sharedHeader}
        void main() {
          // Bends UV grid coordinates towards the cursor to simulate spatial gravity
          vec2 dirToMouse = u_mouse - v_uv;
          float distToMouse = length(dirToMouse);
          
          // Dynamic warp envelope
          float gravityForce = smoothstep(0.45, 0.0, distToMouse);
          vec2 warpedUv = v_uv + normalize(dirToMouse) * gravityForce * 0.075;
          
          // Distance from central singularity in distorted coordinate space
          float distToCenter = distance(warpedUv, vec2(0.5, 0.5));
          
          // Soft rhythmic engine breath
          float breathe = sin(u_time * 2.2) * 0.06 + 0.94;
          
          // Hyperbolic glow scaling (boosted)
          float coreGlow = 0.022 / (distToCenter + 0.001);
          coreGlow = clamp(coreGlow * breathe, 0.0, 3.5);
          
          // Outer gravity dust rings
          float ringMask = sin(distToCenter * 45.0 - u_time * 1.5) * 0.5 + 0.5;
          float dynamicRing = smoothstep(0.03, 0.0, abs(distToCenter - 0.28)) * ringMask * 0.28;
          
          vec3 electricBlue = vec3(0.0, 0.48, 1.0);
          
          // Pure additive light mapping
          float totalGlow = (coreGlow * 0.22) + (dynamicRing * 0.95) + (gravityForce * 0.08);
          vec3 finalColor = electricBlue * totalGlow;
          
          gl_FragColor = vec4(finalColor, 0.8);
        }
      `;
    } else if (type === "neural") {
      // Drifting Voronoi cellular synapse network - fully WebGL 1.0 array-index safe
      fsSource = `
        ${sharedHeader}
        
        vec2 getNodePos(vec2 cell, vec2 ip, vec2 gridCount, vec2 u_mouse, float u_time) {
          vec2 seed = ip + cell;
          float rx = hash(seed);
          float ry = hash(seed + vec2(48.23, 73.19));
          vec2 p = cell + vec2(rx, ry);
          p = 0.5 + 0.35 * sin(u_time * 0.5 + p * 6.28);
          
          // Mouse attraction in cell space
          vec2 absoluteNodePos = (seed + p) / gridCount;
          float mDist = distance(absoluteNodePos, u_mouse);
          if (mDist < 0.3) {
            vec2 pullDir = u_mouse * gridCount - (seed + p);
            p += pullDir * (1.0 - mDist / 0.3) * 0.35;
          }
          return p;
        }

        void main() {
          vec2 gridCount = vec2(7.0, 5.0);
          vec2 gUv = v_uv * gridCount;
          vec2 ip = floor(gUv);
          vec2 fp = fract(gUv);
          
          float nodeGlow = 0.0;
          float lines = 0.0;
          
          // Get the node position of the current central cell (0, 0)
          vec2 centerNode = getNodePos(vec2(0.0, 0.0), ip, gridCount, u_mouse, u_time);
          
          // We check the 3x3 cell neighborhood to add node glows and draw connections
          // Completely avoids WebGL 1.0 dynamic array index limitations
          for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
              vec2 cell = vec2(float(x), float(y));
              vec2 p = getNodePos(cell, ip, gridCount, u_mouse, u_time);
              
              // Node glow
              float d = distance(fp, p);
              nodeGlow += 0.009 / (d + 0.005);
              
              // Synaptic lines: draw connections between centerNode and neighborNode (p)
              if (x != 0 || y != 0) {
                vec2 ba = p - centerNode;
                vec2 pa = fp - centerNode;
                float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                float dLine = length(pa - ba * h);
                float len = length(ba);
                if (len < 2.5) {
                  lines += smoothstep(0.038, 0.0, dLine) * (1.0 - len / 2.5) * 0.55;
                }
              }
            }
          }
          
          vec3 nodeColor = vec3(0.0, 0.48, 1.0); // Electric Blue
          
          // Attenuate node glows in relative proximity to cursor coordinates
          float mouseProximity = smoothstep(0.45, 0.0, distance(v_uv, u_mouse));
          
          float totalIntensity = (nodeGlow * 0.22) + (lines * 0.75) + (mouseProximity * 0.12);
          vec3 finalColor = nodeColor * totalIntensity;
          
          gl_FragColor = vec4(finalColor, 0.8);
        }
      `;
    }

    // ─── SHADER INITIALIZATION ───────────────────────────────────────────────
    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // ─── BUFFERS & ATTRIBUTES ────────────────────────────────────────────────
    // 2 triangles covering the full WebGL clipspace [-1, 1]
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");

    // Set initial canvas resolution
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const displayWidth = Math.floor(rect.width * window.devicePixelRatio);
      const displayHeight = Math.floor(rect.height * window.devicePixelRatio);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    };
    resizeCanvas();

    // ─── INTERACTION LISTENERS ────────────────────────────────────────────────
    // Track cursor events on parent card inner boundaries
    const parentCard = canvas.parentElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (!parentCard) return;
      const rect = parentCard.getBoundingClientRect();
      // Map cursor coordinates to relative percentage coordinates [0, 1]
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = (e.clientY - rect.top) / rect.height;
    };

    const handleMouseLeave = () => {
      // Softly return target coordinate back to the absolute center
      targetMouse.x = 0.5;
      targetMouse.y = 0.5;
    };

    if (parentCard) {
      parentCard.addEventListener("mousemove", handleMouseMove, { passive: true });
      parentCard.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    // ─── RENDER LOOP WITH INTERPOLATION ──────────────────────────────────────
    const startTime = performance.now();

    const render = () => {
      if (!isRendering) return;

      // 1. Interpolate coordinates for premium fluid damping momentum
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      // 2. Clear canvas
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // 3. Set Uniforms
      const elapsedSeconds = (performance.now() - startTime) / 1000.0;
      gl.uniform1f(timeLoc, elapsedSeconds);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);

      // 4. Draw Array
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // 5. Request Next Frame
      animationFrameId = requestAnimationFrame(render);
    };

    // ─── VISIBILITY CULLING (INTERSECTION OBSERVER) ──────────────────────────
    // Stop rendering completely when parent component scrolls out of active viewport
    const observerOptions = {
      root: null, // use absolute viewport
      threshold: 0.01, // trigger when even 1% of card is in viewport
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isRendering = true;
          render();
        } else {
          isRendering = false;
          cancelAnimationFrame(animationFrameId);
        }
      });
    }, observerOptions);

    if (parentCard) {
      observer.observe(parentCard);
    }

    // Handle viewport resize events
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // ─── CLEANUP ─────────────────────────────────────────────────────────────
    return () => {
      isRendering = false;
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);

      if (parentCard) {
        parentCard.removeEventListener("mousemove", handleMouseMove);
        parentCard.removeEventListener("mouseleave", handleMouseLeave);
      }

      // Cleanup GPU buffers
      gl.deleteBuffer(vertexBuffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10 pointer-events-none opacity-75 transition-opacity duration-500 group-hover:opacity-100"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
