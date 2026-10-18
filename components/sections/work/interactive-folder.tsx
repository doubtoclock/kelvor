"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { ProjectData, PROJECTS } from "@/lib/constants/work-data";

export interface DossierCard {
  id: string;
  projectId: string;
  title: string;
  category: string;
  image: string;
  // Peeking coordinates in initial closed state (px relative to folder center)
  peek: {
    x: number;
    y: number;
    rot: number;
    scale: number;
  };
  mobilePeek: {
    x: number;
    y: number;
    rot: number;
    scale: number;
  };
  // Intermediate upward emergence exit position out of open pocket mouth (px relative to center)
  desktopExit: {
    x: number;
    y: number;
    rot: number;
  };
  mobileExit: {
    x: number;
    y: number;
    rot: number;
  };
  // Final settled scattered quadrant positions (px relative to folder center)
  desktopScatter: {
    x: number;
    y: number;
    rot: number;
  };
  tabletScatter: {
    x: number;
    y: number;
    rot: number;
  };
  mobileScatter: {
    x: number;
    y: number;
    rot: number;
  };
}

export const DOSSIER_CARDS: DossierCard[] = [
  {
    id: "card-medio",
    projectId: "medio",
    title: "MEDIO",
    category: "PRODUCT DESIGN · DEV",
    image: "/projects/medio/medio.png",
    // Peeks out on the left side of the pocket opening
    peek: { x: -110, y: -72, rot: -5, scale: 0.72 },
    mobilePeek: { x: -38, y: -26, rot: -5, scale: 0.58 },
    desktopExit: { x: -180, y: -210, rot: -7 },
    mobileExit: { x: -44, y: -64, rot: -5 },
    desktopScatter: { x: -440, y: -155, rot: -5 },
    tabletScatter: { x: -240, y: -150, rot: -4 },
    mobileScatter: { x: -74, y: -148, rot: -5 },
  },
  {
    id: "card-cafemitra-app",
    projectId: "cafemitra",
    title: "CAFEMITRA",
    category: "CONSUMER APP · POS",
    image: "/projects/cafemitra/cafemitra-consumer-app.png",
    // Peeks out on the right side of the pocket opening
    peek: { x: 125, y: -68, rot: 6, scale: 0.72 },
    mobilePeek: { x: 38, y: -24, rot: 5, scale: 0.58 },
    desktopExit: { x: 180, y: -210, rot: 6 },
    mobileExit: { x: 44, y: -64, rot: 5 },
    desktopScatter: { x: 440, y: -155, rot: 5 },
    tabletScatter: { x: 240, y: -150, rot: 5 },
    mobileScatter: { x: 74, y: -138, rot: 4 },
  },
  {
    id: "card-boostai",
    projectId: "boostai",
    title: "BOOST AI",
    category: "AI AUTOMATION · DEV",
    image: "/projects/boostai/boostai.webp",
    // Peeks out in the center, slightly taller
    peek: { x: 5, y: -82, rot: 1.5, scale: 0.74 },
    mobilePeek: { x: 0, y: -30, rot: 1.5, scale: 0.60 },
    desktopExit: { x: -190, y: -190, rot: -4 },
    mobileExit: { x: -44, y: -56, rot: -3 },
    desktopScatter: { x: -440, y: 165, rot: -4 },
    tabletScatter: { x: -240, y: 150, rot: -4 },
    mobileScatter: { x: -76, y: 144, rot: -4 },
  },
  {
    id: "card-cafemitra-erp",
    projectId: "cafemitra",
    title: "CAFEMITRA ERP",
    category: "CLOUD PLATFORM",
    image: "/projects/cafemitra/cafe-erp.png",
    // Tucked neatly into the stack between MEDIO and BOOST AI
    peek: { x: -35, y: -45, rot: -2, scale: 0.68 },
    mobilePeek: { x: -14, y: -18, rot: -2, scale: 0.54 },
    desktopExit: { x: 190, y: -190, rot: 5 },
    mobileExit: { x: 44, y: -56, rot: 4 },
    desktopScatter: { x: 440, y: 170, rot: 6 },
    tabletScatter: { x: 240, y: 150, rot: 5 },
    mobileScatter: { x: 76, y: 152, rot: 3 },
  },
];

export function getCardPeek(card: DossierCard) {
  if (typeof window === "undefined") return card.peek;
  const w = window.innerWidth;
  if (w < 360) {
    return {
      x: Math.round(card.mobilePeek.x * 0.8),
      y: Math.round(card.mobilePeek.y * 0.85),
      rot: card.mobilePeek.rot,
      scale: card.mobilePeek.scale * 0.9,
    };
  }
  return w < 768 ? card.mobilePeek : card.peek;
}

export function getCardTarget(card: DossierCard) {
  if (typeof window === "undefined") return card.desktopScatter;
  const w = window.innerWidth;
  if (w < 360) {
    return {
      x: Math.round(card.mobileScatter.x * 0.76),
      y: Math.round(card.mobileScatter.y * 0.82),
      rot: card.mobileScatter.rot,
    };
  }
  if (w < 768) return card.mobileScatter;
  if (w < 1024) return card.tabletScatter;
  return card.desktopScatter;
}

export function getCardExit(card: DossierCard) {
  if (typeof window === "undefined") return card.desktopExit;
  const w = window.innerWidth;
  if (w < 360) {
    return {
      x: Math.round(card.mobileExit.x * 0.78),
      y: Math.round(card.mobileExit.y * 0.84),
      rot: card.mobileExit.rot,
    };
  }
  return w < 768 ? card.mobileExit : card.desktopExit;
}

interface InteractiveFolderProps {
  onOpenProject: (project: ProjectData) => void;
  isFolderOpen?: boolean;
  onToggleFolder?: () => void;
  isAnimating?: boolean;
}

export function InteractiveFolder({
  onOpenProject,
  isFolderOpen = false,
  onToggleFolder,
  isAnimating = false,
}: InteractiveFolderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Card click handler: open modal
  const handleCardClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (isAnimating) return;
    const found = PROJECTS.find((p) => p.internalId === projectId);
    if (found) {
      onOpenProject(found);
    }
  };

  // Folder click handler: toggle open/close
  const handleFolderClick = () => {
    if (isAnimating) return;
    if (onToggleFolder) onToggleFolder();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isAnimating) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onToggleFolder) onToggleFolder();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* ======================================================== */}
      {/* 3D PERSPECTIVE DOSSIER CENTERPIECE                       */}
      {/* Scaled to ~1.5x (clamp(340px, min(75vw, 88vh), 820px))  */}
      {/* Acts as the prominent visual centerpiece of the section  */}
      {/* ======================================================== */}
      <div
        ref={containerRef}
        role="button"
        tabIndex={0}
        aria-label={
          isFolderOpen
            ? "Kelvor Project Dossier — Click folder to gather project cards"
            : "Kelvor Project Dossier — Translucent glass folder with interactive digital products"
        }
        title={
          isFolderOpen
            ? "Click folder to gather archive"
            : "Click folder to open archive"
        }
        onClick={handleFolderClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative select-none flex items-center justify-center transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#176B56]/60 rounded-3xl cursor-pointer ${
          !isFolderOpen ? "group" : ""
        } ${isAnimating ? "pointer-events-none" : ""} w-[245px] min-[360px]:w-[260px] min-[400px]:w-[275px] md:w-[clamp(480px,min(75vw,88vh),820px)]`}
        style={{
          aspectRatio: "1536 / 1024",
          perspective: "1200px",
          transform: !isFolderOpen && isHovered ? "translateY(-3px)" : "translateY(0)",
        }}
      >
        {/* ======================================================== */}
        {/* AMBIENT CONTACT SHADOW & MINT/JADE PERIMETER DISPERSION  */}
        {/* ======================================================== */}
        <div
          className="absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 w-[88%] h-16 md:h-22 pointer-events-none -z-10 rounded-full transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(8, 107, 85, 0.28) 0%, rgba(119, 203, 165, 0.16) 45%, rgba(247, 245, 237, 0) 75%)",
            filter: "blur(18px)",
            opacity: isHovered && !isFolderOpen ? 1 : 0.85,
          }}
          aria-hidden="true"
        />

        {/* ======================================================== */}
        {/* LAYER 1: GLASS REAR SHELL & TAB (z-[1])                  */}
        {/* Solid-looking but glossy translucent mint-glass back wall*/}
        {/* Sits BEHIND project cards (cards at z-[10])              */}
        {/* ======================================================== */}
        <div className="absolute inset-0 z-[1] pointer-events-none select-none">
          <Image
            src="/images/green_folder_back_shell.png"
            alt="Glossy Mint Glass Folder Back"
            fill
            priority
            sizes="(max-width: 768px) 340px, (max-width: 1200px) 680px, 820px"
            className="object-contain pointer-events-none select-none drop-shadow-[0_22px_44px_rgba(8,107,85,0.22)]"
          />
        </div>

        {/* ======================================================== */}
        {/* LAYER 2: PROJECT CARDS (z-[10] inside, z-[35] out)       */}
        {/* Physically stored between the back shell and front flap  */}
        {/* Upper portions peek out above front flap from the start! */}
        {/* ======================================================== */}
        {DOSSIER_CARDS.map((card, index) => {
          const peek = card.peek;
          return (
            <div
              key={card.id}
              data-dossier-card={index}
              role="button"
              tabIndex={isFolderOpen ? 0 : -1}
              aria-label={`Project: ${card.title} - ${card.category}`}
              onClick={(e) => handleCardClick(e, card.projectId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCardClick(e as unknown as React.MouseEvent, card.projectId);
                }
              }}
              style={{
                transform: `translate3d(${peek.x}px, ${peek.y}px, 0) rotate(${peek.rot}deg) scale(${peek.scale})`,
                opacity: 1,
                zIndex: 10,
                pointerEvents: isFolderOpen && !isAnimating ? "auto" : "none",
              }}
              className={`absolute will-change-transform rounded-xl bg-[#FFFCF7]/95 backdrop-blur-md border border-[#DEDCD2] p-1.5 sm:p-2 md:p-2.5 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.16),0_4px_12px_rgba(16,75,61,0.14)] transition-shadow duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#176B56] w-[112px] min-[360px]:w-[124px] min-[400px]:w-[132px] sm:w-[170px] md:w-[245px] lg:w-[275px] ${
                isFolderOpen
                  ? "cursor-pointer hover:shadow-[0_22px_45px_-6px_rgba(0,0,0,0.22),0_6px_16px_rgba(23,107,86,0.20)] hover:border-[#176B56]/40"
                  : "pointer-events-none"
              }`}
            >
              {/* Project Screenshot Thumbnail */}
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-[#102D25] mb-1.5 sm:mb-2 md:mb-2.5 border border-[#DEDCD2]/40">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 140px, 275px"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                {/* Subtle glass reflection stripe across thumbnail */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
                  }}
                />
              </div>

              {/* Editorial Typography & Metadata */}
              <div className="flex items-center justify-between px-0.5">
                <div className="flex flex-col">
                  <span className="font-bold tracking-tight text-[10px] sm:text-[11px] md:text-[12.5px] text-[#171C19]">
                    {card.title}
                  </span>
                  <span className="text-[7px] sm:text-[8px] md:text-[9px] font-mono tracking-wider text-[#5E6962] uppercase">
                    {card.category}
                  </span>
                </div>

                {isFolderOpen && (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#176B56]/10 flex items-center justify-center text-[#176B56] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight strokeWidth={2.2} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* ======================================================== */}
        {/* LAYER 3: 3D FRONT GLASS FLAP (z-[20])                    */}
        {/* Translucent jade-mint glass flap in FRONT of cards       */}
        {/* Lower portions of cards are seen through the glass       */}
        {/* Rotates outward in 3D perspective when opening           */}
        {/* ======================================================== */}
        <div
          data-folder-flap="true"
          className="absolute inset-0 z-[20] pointer-events-none select-none will-change-transform"
          style={{
            transformOrigin: "50% 86.4%",
            transformStyle: "preserve-3d",
            transform: "rotateX(0deg)",
          }}
        >
          <Image
            src="/images/green_folder_front_flap.png"
            alt="Glossy Mint Glass Folder Front Flap"
            fill
            priority
            sizes="(max-width: 768px) 340px, (max-width: 1200px) 680px, 820px"
            className="object-contain pointer-events-none select-none drop-shadow-[0_12px_28px_rgba(8,107,85,0.18)]"
          />

          {/* Dynamic specular light reflection that glints as flap tilts forward */}
          <div
            data-folder-gleam="true"
            className="absolute inset-0 pointer-events-none opacity-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 25%, rgba(255,255,255,0.35) 48%, rgba(255,255,255,0.55) 52%, transparent 75%)",
              mixBlendMode: "overlay",
            }}
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* CONTEXTUAL STATUS & REVEAL CONTROLS                      */}
      {/* Editorial, understated interactive cue                   */}
      {/* ======================================================== */}
      <div className={`absolute left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-auto whitespace-nowrap transition-all duration-300 ${
        isFolderOpen ? "bottom-2 md:-bottom-12" : "-bottom-14 md:-bottom-12"
      }`}>
        {!isFolderOpen ? (
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171C19]/[0.06] border border-[#DEDCD2] text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] text-[#171C19] uppercase transition-all duration-300 hover:bg-[#171C19]/10 shadow-sm ${
              isAnimating ? "pointer-events-none opacity-60" : "cursor-pointer"
            }`}
            onClick={!isAnimating ? onToggleFolder : undefined}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#176B56] animate-pulse" />
            <span>SCROLL OR CLICK TO OPEN ARCHIVE</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={!isAnimating ? onToggleFolder : undefined}
            disabled={isAnimating}
            className={`group flex items-center gap-2 px-4 py-2 rounded-full bg-[#176B56] hover:bg-[#0B493C] text-[#FFFFFF] text-[9.5px] sm:text-[10.5px] font-medium tracking-wider uppercase transition-transform duration-200 shadow-md ${
              isAnimating
                ? "opacity-60 cursor-not-allowed pointer-events-none"
                : "cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
            }`}
            aria-label="Gather project cards back into dossier"
          >
            <RotateCcw
              className={`w-3 h-3 transition-transform duration-300 ${
                isAnimating ? "animate-spin" : "group-hover:-rotate-90"
              }`}
            />
            <span>GATHER ARCHIVE</span>
          </button>
        )}
      </div>
    </div>
  );
}
