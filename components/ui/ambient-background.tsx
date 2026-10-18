"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * AmbientBackground
 *
 * A fixed, full-viewport atmospheric background layer.
 * Dynamically shifts lighting balance based on global scroll progress
 * using the Digital Jade × Soft Peach palette:
 * - Deep background: #102D25
 * - Dark surface: #222722
 * - Jade glow: rgba(23, 107, 85, 0.30)
 * - Mint glow: rgba(188, 232, 213, 0.18)
 * - Peach glow: rgba(255, 207, 184, 0.10)
 */
export function AmbientBackground() {
  const { scrollYProgress } = useScroll();

  // Background Color Interpolation
  // Map scroll progress to section tones (Ivory in light areas, Deep Forest in dark areas)
  const backgroundColor = useTransform(
    scrollYProgress,
    [
      0, 0.18,      // Hero (Warm Ivory)
      0.22, 0.45,   // Selected Work & Capabilities (Warm Ivory / Pale Mint)
      0.52, 0.72,   // Process (Deep Forest)
      0.75, 0.84,   // Final CTA (Warm Ivory)
      0.87, 0.96,   // Team / About (Deep Forest)
      1.0           // Footer (Deep Forest)
    ],
    [
      "#F7F4ED", "#F7F4ED",
      "#F7F4ED", "#F7F4ED",
      "#102D25", "#102D25",
      "#F7F4ED", "#F7F4ED",
      "#102D25", "#102D25",
      "#102D25"
    ]
  );

  // AMBIENT FIELD A — Top-Left Jade Glow
  // Activated mainly in dark sections (Process, Team, Footer) and subtle in light sections
  const jadeGlowOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.50, 0.55, 0.70, 0.75, 0.85, 0.90, 1],
    [0.05, 0.05, 0.05, 0.30, 0.30, 0.05, 0.05, 0.30, 0.30]
  );

  // AMBIENT FIELD B — Bottom-Right Mint Glow
  const mintGlowOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.50, 0.55, 0.70, 0.75, 0.85, 0.90, 1],
    [0.08, 0.08, 0.08, 0.22, 0.22, 0.08, 0.08, 0.20, 0.20]
  );

  // AMBIENT FIELD C — Soft Peach Accent Highlight
  const peachGlowOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.50, 0.55, 0.70, 0.75, 0.85, 0.90, 1],
    [0.06, 0.06, 0.04, 0.12, 0.12, 0.06, 0.06, 0.10, 0.12]
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
      {/* Jade Glow — Top-Left */}
      <motion.div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "90%",
          height: "100%",
          background:
            "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(23, 107, 85, 0.30) 0%, rgba(16, 75, 61, 0.18) 50%, transparent 85%)",
          filter: "blur(110px)",
          opacity: jadeGlowOpacity,
          willChange: "opacity",
        }}
      />

      {/* Mint Glow — Bottom-Right */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "80%",
          height: "80%",
          background:
            "radial-gradient(ellipse 70% 60% at 80% 70%, rgba(188, 232, 213, 0.22) 0%, rgba(100, 169, 142, 0.12) 50%, transparent 85%)",
          filter: "blur(120px)",
          opacity: mintGlowOpacity,
          willChange: "opacity",
        }}
      />

      {/* Soft Peach Accent — Mid-Right */}
      <motion.div
        style={{
          position: "absolute",
          top: "35%",
          right: "-15%",
          width: "60%",
          height: "60%",
          background:
            "radial-gradient(ellipse at center, rgba(255, 207, 184, 0.14) 0%, rgba(255, 229, 216, 0.06) 45%, transparent 75%)",
          filter: "blur(90px)",
          opacity: peachGlowOpacity,
          willChange: "opacity",
        }}
      />

      {/* Soft Bottom Vignette for Dark Sections */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "25%",
          background: "linear-gradient(to top, rgba(16, 45, 37, 0.35) 0%, transparent 100%)",
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
          opacity: 0.28,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
