"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * AmbientBackground
 *
 * A fixed, full-viewport atmospheric background layer.
 * Dynamically shifts lighting balance based on global scroll progress.
 */
export function AmbientBackground() {
  const { scrollYProgress } = useScroll();

  // Background Color Interpolation
  // Map scroll progress (0 to 1) to specific section tones
  const backgroundColor = useTransform(
    scrollYProgress,
    [
      0, 0.15, // Hero (Brand)
      0.2, 0.35, // Work (Deep Black)
      0.4, 0.5, // Capabilities (Graphite)
      0.55, 0.65, // Process (Near Black)
      0.7, 0.8, // About (Warm Graphite)
      0.85, 0.95, // Contact (Brand)
      1 // Footer (Deep Black)
    ],
    [
      "#060608", "#060608",
      "#050505", "#050505",
      "#101114", "#101114",
      "#08090B", "#08090B",
      "#0A0A0C", "#0A0A0C",
      "#060608", "#060608",
      "#050505"
    ]
  );

  // AMBIENT FIELD A — Top-Left Highlight (Blue)
  const blueOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.2, 0.8, 0.85, 0.95, 1],
    [0.25, 0.25, 0.03, 0.03, 0.25, 0.25, 0.0]
  );
  
  // AMBIENT FIELD B — Bottom-Right Glow (Orange)
  const orangeOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.2, 0.8, 0.85, 0.95, 1],
    [0.15, 0.15, 0.0, 0.0, 0.15, 0.15, 0.0]
  );

  // Capabilities Neutral Spotlight
  const capSpotlightOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.4, 0.5, 0.55],
    [0, 1, 1, 0]
  );

  // Team Warm Edge Glow
  const teamWarmOpacity = useTransform(
    scrollYProgress,
    [0.65, 0.7, 0.8, 0.85],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor,
      }}
    >
      {/* Brand Blue Glow */}
      <motion.div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "90%",
          height: "100%",
          background: "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(15, 100, 255, 1) 0%, rgba(10, 60, 180, 0.5) 50%, transparent 90%)",
          filter: "blur(100px)",
          opacity: blueOpacity,
          willChange: "opacity",
        }}
      />

      {/* Brand Orange Glow */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "80%",
          height: "80%",
          background: "radial-gradient(ellipse 70% 60% at 80% 70%, rgba(255, 120, 20, 1) 0%, rgba(200, 80, 10, 0.5) 50%, transparent 90%)",
          filter: "blur(120px)",
          opacity: orangeOpacity,
          willChange: "opacity",
        }}
      />

      {/* Capabilities Neutral Glow */}
      <motion.div
        style={{
          position: "absolute",
          top: "20%",
          left: "20%",
          width: "60%",
          height: "60%",
          background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: capSpotlightOpacity,
          willChange: "opacity",
        }}
      />

      {/* Team Warm Edge Glow */}
      <motion.div
        style={{
          position: "absolute",
          top: "10%",
          right: "-20%",
          width: "60%",
          height: "80%",
          background: "radial-gradient(ellipse at 80% 50%, rgba(200, 100, 30, 0.06) 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: teamWarmOpacity,
          willChange: "opacity",
        }}
      />

      {/* BOTTOM VIGNETTE */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "25%",
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
        }}
      />

      {/* FILM GRAIN */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "150px 150px",
          opacity: 0.35,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
