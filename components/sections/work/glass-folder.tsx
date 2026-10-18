"use client";

import React from "react";

interface GlassFolderProps {
  className?: string;
}

export function GlassFolder({ className = "" }: GlassFolderProps) {
  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width: "clamp(320px, min(64vw, 78vh), 760px)",
        height: "clamp(230px, min(38vw, 46vh), 440px)",
      }}
    >
      {/* ======================================================== */}
      {/* AMBIENT CONTACT SHADOW & REFRACTIVE DISPERSION           */}
      {/* ======================================================== */}
      <div 
        className="absolute -bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-10 md:h-14 pointer-events-none -z-10 rounded-full"
        style={{
          background: "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(150, 180, 235, 0.38) 0%, rgba(190, 215, 255, 0.12) 45%, rgba(248, 247, 243, 0) 75%)",
          filter: "blur(12px)",
        }}
        aria-hidden="true"
      />

      {/* ======================================================== */}
      {/* BACK SHELL: FOLDER TAB + REAR BODY                       */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-0">
        {/* Top Left Folder Tab */}
        <div 
          className="absolute top-0 left-0 h-[32px] md:h-[40px] w-[34%] md:w-[28%] rounded-t-2xl flex items-center px-3.5 md:px-5"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(218, 234, 255, 0.4) 50%, rgba(240, 248, 255, 0.5) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1.5px solid rgba(255, 255, 255, 0.9)",
            borderLeft: "1.2px solid rgba(255, 255, 255, 0.75)",
            borderRight: "1px solid rgba(255, 255, 255, 0.45)",
            boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(180, 208, 250, 0.2)",
          }}
        >
          <span className="text-[8px] md:text-[10px] font-semibold tracking-[0.22em] text-[#111111]/55 uppercase whitespace-nowrap">
            ARCHIVE // 01
          </span>
        </div>

        {/* Back Cover Body */}
        <div 
          className="absolute left-0 right-0 bottom-0 rounded-b-2xl rounded-tr-2xl"
          style={{
            top: "31px",
            background: "linear-gradient(140deg, rgba(255, 255, 255, 0.48) 0%, rgba(210, 228, 255, 0.24) 40%, rgba(232, 243, 255, 0.32) 75%, rgba(255, 255, 255, 0.48) 100%)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            border: "1px solid rgba(255, 255, 255, 0.65)",
            borderTop: "1.2px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.85), inset 0 -2px 4px rgba(175, 205, 245, 0.25), 0 20px 45px -15px rgba(20, 45, 95, 0.08)",
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* INTERIOR LAYER: TRANSLUCENT PROJECT INDEX DOSSIER        */}
      {/* ======================================================== */}
      <div 
        className="absolute inset-x-3 md:inset-x-4 bottom-3 md:bottom-4 rounded-xl z-10 flex flex-col justify-between p-3.5 md:p-5 overflow-hidden pointer-events-none"
        style={{
          top: "42px",
          background: "linear-gradient(145deg, rgba(255, 255, 255, 0.62) 0%, rgba(244, 248, 255, 0.38) 50%, rgba(234, 244, 255, 0.48) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 6px 18px -6px rgba(25, 50, 95, 0.06)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        {/* Header Metadata */}
        <div>
          <div className="flex items-center justify-between text-[8px] md:text-[9.5px] font-semibold tracking-[0.2em] text-[#111111]/60 uppercase">
            <span>KELVOR TECHNOLOGIES</span>
            <span className="hidden sm:inline">SELECTED COMMISSIONS // 2024–2026</span>
            <span>INDEX: 01—03</span>
          </div>
          <div className="w-full h-[1px] bg-[#111111]/10 mt-2 mb-2.5 md:mb-3" />
        </div>

        {/* Project Index Rows */}
        <div className="flex flex-col gap-1.5 md:gap-2.5 py-0.5">
          <div className="flex items-baseline justify-between text-[9px] md:text-[11.5px] font-medium text-[#111111]/80">
            <span className="font-semibold tracking-[0.16em] text-[#111111]/90">01 / MEDIO</span>
            <span className="text-[8px] md:text-[10px] tracking-[0.12em] text-[#55545A]/70 uppercase hidden sm:inline">Healthcare Platform & Mobile App</span>
            <span className="text-[8px] md:text-[9.5px] tracking-[0.14em] text-[#111111]/50 font-mono">PRODUCT DESIGN</span>
          </div>

          <div className="w-full h-[1px] bg-[#111111]/5" />

          <div className="flex items-baseline justify-between text-[9px] md:text-[11.5px] font-medium text-[#111111]/80">
            <span className="font-semibold tracking-[0.16em] text-[#111111]/90">02 / CAFEMITRA</span>
            <span className="text-[8px] md:text-[10px] tracking-[0.12em] text-[#55545A]/70 uppercase hidden sm:inline">Hospitality POS & Cloud ERP</span>
            <span className="text-[8px] md:text-[9.5px] tracking-[0.14em] text-[#111111]/50 font-mono">SYSTEM ARCHITECTURE</span>
          </div>

          <div className="w-full h-[1px] bg-[#111111]/5" />

          <div className="flex items-baseline justify-between text-[9px] md:text-[11.5px] font-medium text-[#111111]/80">
            <span className="font-semibold tracking-[0.16em] text-[#111111]/90">03 / BOOST AI</span>
            <span className="text-[8px] md:text-[10px] tracking-[0.12em] text-[#55545A]/70 uppercase hidden sm:inline">Autonomous Agent Workflows</span>
            <span className="text-[8px] md:text-[9.5px] tracking-[0.14em] text-[#111111]/50 font-mono">ENTERPRISE AI</span>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="pt-1.5 flex items-center justify-between text-[7.5px] md:text-[8.5px] tracking-[0.18em] text-[#55545A]/50 uppercase font-mono">
          <span>PORTFOLIO DOSSIER</span>
          <span>KELVOR PRODUCT STUDIO</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FRONT SHELL: OVERLAPPING FROSTED GLASS FLAP              */}
      {/* ======================================================== */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[76%] md:h-[78%] rounded-2xl z-20 overflow-hidden pointer-events-none"
        style={{
          background: "linear-gradient(130deg, rgba(255, 255, 255, 0.68) 0%, rgba(220, 235, 255, 0.3) 35%, rgba(238, 246, 255, 0.4) 70%, rgba(255, 255, 255, 0.58) 100%)",
          backdropFilter: "blur(24px) saturate(140%)",
          WebkitBackdropFilter: "blur(24px) saturate(140%)",
          border: "1.2px solid rgba(255, 255, 255, 0.75)",
          borderTop: "1.8px solid rgba(255, 255, 255, 0.95)",
          boxShadow: "inset 0 1.8px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(165, 195, 245, 0.3), 0 24px 50px -15px rgba(20, 45, 95, 0.12)",
        }}
      >
        {/* Subtle Top Notch Contour / Scoop Shadow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-28 h-[2.5px] rounded-b-full bg-white/70"
          style={{ boxShadow: "0 1px 3px rgba(180, 205, 245, 0.4)" }}
        />

        {/* Diagonal Specular Sheen Sweep */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.4) 42%, rgba(255, 255, 255, 0.08) 54%, transparent 75%)",
          }}
        />

        {/* Debossed Studio Monogram / Mark on Front Face */}
        <div className="absolute bottom-3 md:bottom-5 right-4 md:right-6 flex items-center gap-1.5 md:gap-2">
          <span 
            className="text-[9px] md:text-[11px] font-extrabold tracking-[0.26em] text-[#111111]/30 uppercase select-none"
            style={{
              textShadow: "0 1px 1px rgba(255, 255, 255, 0.8)",
            }}
          >
            KELVOR
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#9EB4F5]/60" />
        </div>
      </div>
    </div>
  );
}
