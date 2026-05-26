"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * InteractiveBackground — ambient gradient blobs with mouse parallax.
 *
 * Uses refs + direct DOM manipulation (no setState) to avoid triggering
 * React re-renders on every mouse movement, which was causing the entire
 * app tree to re-render hundreds of times per second and exhausting memory.
 */
export default function InteractiveBackground() {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const updateBlobs = useCallback(() => {
    const { x, y } = mouseRef.current;
    const ox = (x - window.innerWidth / 2) / 30;
    const oy = (y - window.innerHeight / 2) / 30;

    if (blob1Ref.current) {
      blob1Ref.current.style.transform = `translate(${ox}px, ${oy}px)`;
    }
    if (blob2Ref.current) {
      blob2Ref.current.style.transform = `translate(${-ox * 0.8}px, ${oy * 0.8}px)`;
    }
    if (blob3Ref.current) {
      blob3Ref.current.style.transform = `translate(${ox * 0.6}px, ${-oy * 0.6}px)`;
    }
    rafRef.current = null;
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Throttle to one update per animation frame
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateBlobs);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateBlobs]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Rose blob — top left */}
      <div
        ref={blob1Ref}
        className="absolute w-[600px] h-[600px] rounded-full animate-blob opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255,51,102,0.3) 0%, transparent 70%)",
          top: "-200px",
          left: "-200px",
          filter: "blur(120px)",
          transition: "transform 0.3s ease-out",
          willChange: "transform",
        }}
      />
      {/* Violet blob — center right */}
      <div
        ref={blob2Ref}
        className="absolute w-[500px] h-[500px] rounded-full animate-blob opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
          top: "30%",
          right: "-150px",
          filter: "blur(150px)",
          transition: "transform 0.3s ease-out",
          willChange: "transform",
          animationDelay: "4s",
        }}
      />
      {/* Cyan blob — bottom left */}
      <div
        ref={blob3Ref}
        className="absolute w-[450px] h-[450px] rounded-full animate-blob opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)",
          bottom: "-100px",
          left: "20%",
          filter: "blur(130px)",
          transition: "transform 0.3s ease-out",
          willChange: "transform",
          animationDelay: "8s",
        }}
      />
    </div>
  );
}
