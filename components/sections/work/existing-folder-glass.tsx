"use client";

import React from "react";

interface ExistingFolderGlassProps {
  className?: string;
  size?: number;
}

export function ExistingFolderGlass({ className = "", size }: ExistingFolderGlassProps) {
  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{
        width: size ? `${size}px` : "clamp(340px, min(56vw, 68vh), 620px)",
        height: size ? `${size}px` : "clamp(340px, min(56vw, 68vh), 620px)",
      }}
    >
      {/* ======================================================== */}
      {/* AMBIENT CONTACT SHADOW & COOL-BLUE PERIMETER DISPERSION  */}
      {/* ======================================================== */}
      <div 
        className="absolute -bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 w-[82%] h-12 md:h-16 pointer-events-none -z-10 rounded-full"
        style={{
          background: "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(2, 119, 189, 0.28) 0%, rgba(79, 195, 247, 0.12) 45%, rgba(248, 247, 243, 0) 75%)",
          filter: "blur(14px)",
        }}
        aria-hidden="true"
      />

      {/* ======================================================== */}
      {/* REUSED EXACT FOLDER WITH SUBTLE GLASSY BOUNDARIES        */}
      {/* 100% Vector Precision, Infinitely Sharp, Zero Blur       */}
      {/* ======================================================== */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{
          filter: "drop-shadow(0 18px 36px rgba(2, 119, 189, 0.22)) drop-shadow(0 4px 12px rgba(79, 195, 247, 0.25)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.08))",
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
          shapeRendering="geometricPrecision"
        >
          <defs>
            {/* 1. Fine Glass Highlight along the Top Edge & Tab */}
            <linearGradient id="tabGlassEdge" x1="4" y1="9" x2="44" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#81D4FA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#01579B" stopOpacity="0.65" />
            </linearGradient>

            {/* 2. Front Flap Glass Perimeter Border */}
            <linearGradient id="frontGlassBorder" x1="4" y1="14" x2="4" y2="39.5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="12%" stopColor="#E1F5FE" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#4FC3F7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0277BD" stopOpacity="0.55" />
            </linearGradient>

            {/* 3. Subtle Glossy Specular Sheen across Front Face */}
            <linearGradient id="frontSheen" x1="4" y1="14" x2="44" y2="39.5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.24" />
              <stop offset="38%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="85%" stopColor="#0277BD" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#01579B" stopOpacity="0.16" />
            </linearGradient>

            {/* 4. Upper Bevel Highlight Line */}
            <linearGradient id="bevelLine" x1="4" y1="14" x2="44" y2="14" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.65" />
              <stop offset="85%" stopColor="#B3E5FC" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* ====================================================== */}
          {/* LAYER 1: REAR SHELL & TAB (#0277BD)                    */}
          {/* Exact original geometry, proportions & color identity   */}
          {/* ====================================================== */}
          <path
            d="M 6.5 9 H 14.5 C 15.3 9 16.1 9.3 16.8 9.8 L 19.2 11.5 C 19.6 11.8 20.1 12 20.6 12 H 41.5 C 42.9 12 44 13.1 44 14.5 V 37 C 44 38.7 42.7 40 41 40 H 7 C 5.3 40 4 38.7 4 37 V 11.5 C 4 10.1 5.1 9 6.5 9 Z"
            fill="#0277BD"
          />

          {/* Glassy boundary highlight on rear shell silhouette */}
          <path
            d="M 6.5 9 H 14.5 C 15.3 9 16.1 9.3 16.8 9.8 L 19.2 11.5 C 19.6 11.8 20.1 12 20.6 12 H 41.5 C 42.9 12 44 13.1 44 14.5 V 37 C 44 38.7 42.7 40 41 40 H 7 C 5.3 40 4 38.7 4 37 V 11.5 C 4 10.1 5.1 9 6.5 9 Z"
            fill="none"
            stroke="url(#tabGlassEdge)"
            strokeWidth="0.85"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Fine specular gleam along top tab edge */}
          <line
            x1="6.5"
            y1="9.4"
            x2="14.5"
            y2="9.4"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="0.85"
            strokeLinecap="round"
          />

          {/* ====================================================== */}
          {/* LAYER 2: FRONT COVER FLAP (#4FC3F7)                    */}
          {/* Exact original geometry, proportions & color identity   */}
          {/* ====================================================== */}
          <path
            d="M 6.5 14 H 41.5 C 42.9 14 44 15.1 44 16.5 V 37 C 44 38.7 42.7 40 41 40 H 7 C 5.3 40 4 38.7 4 37 V 16.5 C 4 15.1 5.1 14 6.5 14 Z"
            fill="#4FC3F7"
          />

          {/* Subtle glossy glass luster sheen across front face */}
          <path
            d="M 6.5 14 H 41.5 C 42.9 14 44 15.1 44 16.5 V 37 C 44 38.7 42.7 40 41 40 H 7 C 5.3 40 4 38.7 4 37 V 16.5 C 4 15.1 5.1 14 6.5 14 Z"
            fill="url(#frontSheen)"
          />

          {/* Glass-beveled border around front flap silhouette */}
          <path
            d="M 6.5 14 H 41.5 C 42.9 14 44 15.1 44 16.5 V 37 C 44 38.7 42.7 40 41 40 H 7 C 5.3 40 4 38.7 4 37 V 16.5 C 4 15.1 5.1 14 6.5 14 Z"
            fill="none"
            stroke="url(#frontGlassBorder)"
            strokeWidth="0.85"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Fine specular rim highlight along top seam of front flap */}
          <line
            x1="6.5"
            y1="14"
            x2="41.5"
            y2="14"
            stroke="url(#bevelLine)"
            strokeWidth="0.85"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
