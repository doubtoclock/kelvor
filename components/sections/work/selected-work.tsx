"use client";

import React, { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import {
  InteractiveFolder,
  DOSSIER_CARDS,
  getCardPeek,
  getCardTarget,
  getCardExit,
} from "./interactive-folder";
import { ProjectGallery } from "./project-gallery";
import { ProjectData } from "@/lib/constants/work-data";
import { BinaryTrail } from "./binary-trail";
import { ProcessTypewriterHeading } from "./process-typewriter-heading";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Compute responsive initial circle scale so starting radius is ~12-14% of viewport width
const getInitialCircleScale = () => {
  if (typeof window === "undefined") return 0.44;
  const ratio = window.innerWidth / Math.max(1, window.innerHeight);
  // Base circle size: 100vh x 100vh -> base radius = 0.5 * H
  // Target radius = 0.13 * W => scale = 0.26 * (W / H)
  const scale = 0.26 * ratio;
  // Clamped between 0.35 and 0.55 for balanced visual presentation across desktop, ultrawide & mobile
  return Math.min(Math.max(scale, 0.35), 0.55);
};

// Compute dynamic maximum circle scale to guarantee full coverage of all 4 corners across any screen ratio
const getMaxCircleScale = () => {
  if (typeof window === "undefined") return 4.6;
  const ratio = window.innerWidth / Math.max(1, window.innerHeight);
  // Distance from bottom-center (0.5 W, H) to furthest corner (0, 0): sqrt((0.5 W)^2 + H^2)
  // Scale relative to base radius (0.5 H): sqrt(ratio^2 + 4)
  const minRequired = Math.sqrt(ratio * ratio + 4);
  return Math.max(4.5, minRequired * 1.45);
};

export function SelectedWorkSection() {
  const pinnedContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const projectsContentRef = useRef<HTMLDivElement>(null);
  const folderWrapperRef = useRef<HTMLDivElement>(null);
  const circleTransitionRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);

  // Process Circular Transition Refs
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const capabilitiesBgRef = useRef<HTMLDivElement>(null);
  const capabilitiesContentRef = useRef<HTMLDivElement>(null);
  const processTransitionStageRef = useRef<HTMLDivElement>(null);
  const processCircleRef = useRef<HTMLDivElement>(null);
  const processHeadingRef = useRef<HTMLDivElement>(null);

  const [activeGalleryProject, setActiveGalleryProject] = useState<ProjectData | null>(null);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isProcessHeadingActive, setIsProcessHeadingActive] = useState(false);
  const isAnimatingRef = useRef(false);
  const masterTlRef = useRef<gsap.core.Timeline | null>(null);

  // ========================================================
  // MASTER SCROLL-COORDINATED ANIMATION ARCHITECTURE
  // Single coordinated timeline controlling:
  // Phase 1 (0.00 -> 0.12): Folder physical descent into center (cards peeking inside)
  // Phase 2 (0.12 -> 0.18): 3D glass flap opens outward away from cards
  // Phase 3 (0.15 -> 0.32): Project cards emerge from pocket & scatter to quadrants
  // Phase 4 (0.32 -> 0.44): Settled interactive archive buffer (clickable cards + GATHER ARCHIVE)
  // Phase 5 (0.44 -> 0.88): COORDINATED UPWARD SECTION DEPARTURE & SLOW CIRCULAR EXPANSION
  //         - Entire Projects section moves smoothly UPWARD out of viewport.
  //         - Blue circle emerges from bottom center behind departing projects, expanding to scale 4.2.
  // Phase 6 (0.65 -> 0.85): INTRODUCTORY STATEMENT REVEAL INSIDE EXPANDING CIRCLE
  //         - Text fades in and moves upward into center as circle approaches full coverage.
  // Phase 7 (0.85 -> 1.00): FULL-SCREEN BLUE SURFACE WITH CENTERED INTRODUCTORY STATEMENT
  //         - When user continues scrolling past 1.00, stage naturally unpins:
  //           the introductory statement scrolls up out of view, and Services 01-04
  //           enter naturally in normal document flow without any fade-in/out animations!
  // ========================================================
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // 1. REDUCED MOTION PREFERENCE
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (!pinnedContainerRef.current || !folderWrapperRef.current) return;
        gsap.set(folderWrapperRef.current, {
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
        });

        const flap = pinnedContainerRef.current.querySelector('[data-folder-flap]');
        if (flap) {
          gsap.set(flap, { rotateX: -26 });
        }

        const cards = pinnedContainerRef.current.querySelectorAll<HTMLElement>('[data-dossier-card]');
        cards.forEach((cardEl, index) => {
          const card = DOSSIER_CARDS[index];
          if (!card) return;
          const target = getCardTarget(card);
          gsap.set(cardEl, {
            x: target.x,
            y: target.y,
            rotation: target.rot,
            scale: 1,
            opacity: 1,
            zIndex: 35,
          });
        });

        if (projectsContentRef.current) {
          gsap.set(projectsContentRef.current, { y: 0, opacity: 1 });
        }
        if (circleTransitionRef.current) {
          gsap.set(circleTransitionRef.current, { autoAlpha: 0 });
        }
        if (statementRef.current) {
          gsap.set(statementRef.current, { autoAlpha: 1, y: 0 });
        }

        setIsFolderOpen(true);
      });

      // 2. DESKTOP CINEMATIC SCROLL EXPERIENCE (768px+)
      // Desktop parameters, timing, and coordinates are 100% PRESERVED
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        if (!pinnedContainerRef.current || !folderWrapperRef.current) return;

        const flap = pinnedContainerRef.current.querySelector<HTMLElement>('[data-folder-flap]');
        const gleam = pinnedContainerRef.current.querySelector<HTMLElement>('[data-folder-gleam]');
        const cardEls = pinnedContainerRef.current.querySelectorAll<HTMLElement>('[data-dossier-card]');

        // Initialize state: folder closed, cards in their peeking stack behind front flap (z-10)
        if (flap) gsap.set(flap, { rotateX: 0 });
        cardEls.forEach((cardEl, index) => {
          const card = DOSSIER_CARDS[index];
          if (!card) return;
          gsap.set(cardEl, {
            x: card.peek.x,
            y: card.peek.y,
            rotation: card.peek.rot,
            scale: card.peek.scale,
            opacity: 1,
            zIndex: 10,
          });
        });

        // Initialize transition elements
        if (projectsContentRef.current) {
          gsap.set(projectsContentRef.current, { y: 0, opacity: 1 });
        }
        if (stageRef.current) {
          gsap.set(stageRef.current, { backgroundColor: "transparent" });
        }
        if (circleTransitionRef.current) {
          gsap.set(circleTransitionRef.current, {
            xPercent: -50,
            yPercent: 50,
            scale: getInitialCircleScale(),
            autoAlpha: 0,
            transformOrigin: "50% 50%",
          });
        }
        if (statementRef.current) {
          gsap.set(statementRef.current, { autoAlpha: 0, y: 30 });
        }

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35, // Responsive 1:1 scroll tracking
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const prog = self.progress;
              if (prog >= 0.28 && prog < 0.44) {
                setIsFolderOpen(true);
              } else if (prog < 0.12 || prog >= 0.44) {
                setIsFolderOpen(false);
              }
            },
          },
        });
        masterTlRef.current = masterTl;

        // ----------------------------------------------------
        // PHASE 1 — FOLDER ARRIVES (Timeline 0.00 -> 0.12)
        // ----------------------------------------------------
        masterTl.fromTo(
          folderWrapperRef.current,
          {
            y: () => -window.innerHeight * 1.15,
            rotation: -1.8,
            scale: 0.94,
            opacity: 0.7,
          },
          {
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            duration: 0.12,
          },
          0
        );

        // ----------------------------------------------------
        // PHASE 2 — GLASS FLAP OPENS (Timeline 0.12 -> 0.18)
        // ----------------------------------------------------
        if (flap) {
          masterTl.to(
            flap,
            {
              rotateX: -26,
              duration: 0.06,
              ease: "power1.inOut",
            },
            0.12
          );
        }

        if (gleam) {
          masterTl.fromTo(
            gleam,
            { opacity: 0 },
            { opacity: 0.45, duration: 0.06, ease: "power1.inOut" },
            0.12
          );
        }

        // ----------------------------------------------------
        // PHASE 3 — PROJECTS EMERGE & SCATTER (Timeline 0.15 -> 0.32)
        // ----------------------------------------------------
        DOSSIER_CARDS.forEach((card, index) => {
          const cardEl = cardEls[index];
          if (!cardEl) return;
          const exit = card.desktopExit;
          const target = window.innerWidth < 1024 ? card.tabletScatter : card.desktopScatter;
          const startTime = 0.15 + index * 0.02;

          // Rise upward out of pocket behind front flap
          masterTl.to(
            cardEl,
            {
              x: exit.x,
              y: exit.y,
              rotation: exit.rot,
              scale: 0.88,
              opacity: 1,
              duration: 0.08,
              ease: "power2.out",
            },
            startTime
          );

          // Clear flap: elevate zIndex to 35
          masterTl.set(cardEl, { zIndex: 35 }, startTime + 0.06);

          // Arc outward to scattered quadrant position
          masterTl.to(
            cardEl,
            {
              x: target.x,
              y: target.y,
              rotation: target.rot,
              scale: 1,
              duration: 0.11,
              ease: "power2.out",
            },
            startTime + 0.07
          );
        });

        // ----------------------------------------------------
        // PHASE 4 — SETTLED BUFFER (Timeline 0.32 -> 0.44)
        // Cards settled in quadrants, interactive, Gather Archive active
        // Circle is completely hidden (autoAlpha: 0)
        // ----------------------------------------------------
        masterTl.to({}, { duration: 0.12 }, 0.32);

        // ----------------------------------------------------
        // PHASE 5 — CIRCLE BEGINS EXPANDING & PROJECTS MOVE UPWARD (Timeline 0.44 -> 0.88)
        // ----------------------------------------------------
        const initialScale = getInitialCircleScale();

        if (circleTransitionRef.current) {
          // 1. Circle emerges at 0.44 right as transition begins, never prematurely
          masterTl.fromTo(
            circleTransitionRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.02, ease: "power1.in", immediateRender: false },
            0.44
          );

          // 2. Circle expands smoothly from initialScale (~12-14% viewport width) to full coverage (scale: 4.2)
          masterTl.fromTo(
            circleTransitionRef.current,
            { scale: initialScale },
            {
              scale: 4.2,
              ease: "power1.inOut",
              duration: 0.44,
              immediateRender: false,
            },
            0.44
          );
        }

        // 3. Outgoing Projects section moves UPWARD, physically propelled by rising circle beneath it
        if (projectsContentRef.current) {
          masterTl.fromTo(
            projectsContentRef.current,
            { y: 0 },
            {
              y: () => -window.innerHeight * 1.15,
              duration: 0.42,
              ease: "power1.inOut",
              immediateRender: false,
            },
            0.44
          );

          // Smoothly fade out as it reaches the top
          masterTl.to(
            projectsContentRef.current,
            { opacity: 0, duration: 0.14, ease: "power1.in" },
            0.58
          );
        }

        // ----------------------------------------------------
        // PHASE 6 — INTRODUCTORY STATEMENT INSIDE EXPANDING CIRCLE (Timeline 0.65 -> 0.85)
        // ----------------------------------------------------
        if (statementRef.current) {
          masterTl.fromTo(
            statementRef.current,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.15, ease: "power1.out", immediateRender: false },
            0.65
          );
        }

        // Phase 7: Settled hold at 1.00 — ensure stage background seamlessly matches before unpinning
        if (stageRef.current) {
          masterTl.to(
            stageRef.current,
            { backgroundColor: "#BCE8D5", duration: 0.1, immediateRender: false },
            0.85
          );
        }
        masterTl.to({}, { duration: 0.15 }, 0.85);
      });

      // 3. MOBILE CINEMATIC SCROLL EXPERIENCE (<768px)
      // Dedicated mobile timeline: cards remain visible, accessible, and interactive
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        if (!pinnedContainerRef.current || !folderWrapperRef.current) return;

        const flap = pinnedContainerRef.current.querySelector<HTMLElement>('[data-folder-flap]');
        const gleam = pinnedContainerRef.current.querySelector<HTMLElement>('[data-folder-gleam]');
        const cardEls = pinnedContainerRef.current.querySelectorAll<HTMLElement>('[data-dossier-card]');

        // Initialize state: folder closed, cards in their peeking stack behind front flap (z-10)
        if (flap) gsap.set(flap, { rotateX: 0 });
        cardEls.forEach((cardEl, index) => {
          const card = DOSSIER_CARDS[index];
          if (!card) return;
          const peek = getCardPeek(card);
          gsap.set(cardEl, {
            x: peek.x,
            y: peek.y,
            rotation: peek.rot,
            scale: peek.scale,
            opacity: 1,
            zIndex: 10,
          });
        });

        // Initialize transition elements
        if (projectsContentRef.current) {
          gsap.set(projectsContentRef.current, { y: 0, opacity: 1 });
        }
        if (stageRef.current) {
          gsap.set(stageRef.current, { backgroundColor: "transparent" });
        }
        if (circleTransitionRef.current) {
          gsap.set(circleTransitionRef.current, {
            xPercent: -50,
            yPercent: 50,
            scale: getInitialCircleScale(),
            autoAlpha: 0,
            transformOrigin: "50% 50%",
          });
        }
        if (statementRef.current) {
          gsap.set(statementRef.current, { autoAlpha: 0, y: 20 });
        }

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const prog = self.progress;
              // On mobile, keep folder open and cards interactive throughout the extended settled buffer
              if (prog >= 0.20 && prog < 0.58) {
                setIsFolderOpen(true);
              } else if (prog < 0.10 || prog >= 0.58) {
                setIsFolderOpen(false);
              }
            },
          },
        });
        masterTlRef.current = masterTl;

        // ----------------------------------------------------
        // PHASE 1 — FOLDER ARRIVES (Timeline 0.00 -> 0.10)
        // ----------------------------------------------------
        masterTl.fromTo(
          folderWrapperRef.current,
          {
            y: () => -window.innerHeight * 1.15,
            rotation: -1.5,
            scale: 0.94,
            opacity: 0.7,
          },
          {
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            duration: 0.10,
          },
          0
        );

        // ----------------------------------------------------
        // PHASE 2 — GLASS FLAP OPENS (Timeline 0.10 -> 0.16)
        // ----------------------------------------------------
        if (flap) {
          masterTl.to(
            flap,
            {
              rotateX: -26,
              duration: 0.06,
              ease: "power1.inOut",
            },
            0.10
          );
        }

        if (gleam) {
          masterTl.fromTo(
            gleam,
            { opacity: 0 },
            { opacity: 0.45, duration: 0.06, ease: "power1.inOut" },
            0.10
          );
        }

        // ----------------------------------------------------
        // PHASE 3 — PROJECTS EMERGE & SETTLE IN MOBILE POSITIONS (Timeline 0.13 -> 0.25)
        // ----------------------------------------------------
        DOSSIER_CARDS.forEach((card, index) => {
          const cardEl = cardEls[index];
          if (!cardEl) return;
          const exit = getCardExit(card);
          const target = getCardTarget(card);
          const startTime = 0.13 + index * 0.02;

          // Rise upward out of pocket behind front flap
          masterTl.to(
            cardEl,
            {
              x: exit.x,
              y: exit.y,
              rotation: exit.rot,
              scale: 0.82,
              opacity: 1,
              duration: 0.06,
              ease: "power2.out",
            },
            startTime
          );

          // Clear flap: elevate zIndex to 35
          masterTl.set(cardEl, { zIndex: 35 }, startTime + 0.05);

          // Move smoothly to visible mobile positions
          masterTl.to(
            cardEl,
            {
              x: target.x,
              y: target.y,
              rotation: target.rot,
              scale: 1,
              duration: 0.07,
              ease: "power2.out",
            },
            startTime + 0.05
          );
        });

        // ----------------------------------------------------
        // PHASE 4 — EXTENDED SETTLED BUFFER ON MOBILE (Timeline 0.25 -> 0.58)
        // Generous viewing time where all cards remain visible and interactive
        // ----------------------------------------------------
        masterTl.to({}, { duration: 0.33 }, 0.25);

        // ----------------------------------------------------
        // PHASE 5 — CIRCLE EXPANDS & PROJECTS MOVE UPWARD (Timeline 0.58 -> 0.88)
        // ----------------------------------------------------
        const initialScale = getInitialCircleScale();

        if (circleTransitionRef.current) {
          masterTl.fromTo(
            circleTransitionRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.02, ease: "power1.in", immediateRender: false },
            0.58
          );

          masterTl.fromTo(
            circleTransitionRef.current,
            { scale: initialScale },
            {
              scale: 4.2,
              ease: "power1.inOut",
              duration: 0.30,
              immediateRender: false,
            },
            0.58
          );
        }

        if (projectsContentRef.current) {
          masterTl.fromTo(
            projectsContentRef.current,
            { y: 0 },
            {
              y: () => -window.innerHeight * 1.15,
              duration: 0.28,
              ease: "power1.inOut",
              immediateRender: false,
            },
            0.58
          );

          masterTl.to(
            projectsContentRef.current,
            { opacity: 0, duration: 0.12, ease: "power1.in" },
            0.68
          );
        }

        // ----------------------------------------------------
        // PHASE 6 — INTRODUCTORY STATEMENT INSIDE CIRCLE (Timeline 0.72 -> 0.86)
        // ----------------------------------------------------
        if (statementRef.current) {
          masterTl.fromTo(
            statementRef.current,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.14, ease: "power1.out", immediateRender: false },
            0.72
          );
        }

        // Phase 7: Settled hold before unpinning
        if (stageRef.current) {
          masterTl.to(
            stageRef.current,
            { backgroundColor: "#BCE8D5", duration: 0.08, immediateRender: false },
            0.88
          );
        }
        masterTl.to({}, { duration: 0.12 }, 0.88);
      });

      return () => {
        mm.revert();
      };
    },
    { scope: pinnedContainerRef }
  );

  // ========================================================
  // PROCESS CIRCULAR TRANSITION ARCHITECTURE
  // Smoothly bridges Service 05 (What We Do) into Our Process:
  // 1. Begins at the END of Service 05 & buffer (start: "bottom bottom")
  // 2. Glossy blue circle emerges from bottom-center at initialScale
  // 3. Circle gradually expands, physically propelling Service 05 upward
  // 4. Our Process heading appears inside the expanding circle (0.55 -> 0.80)
  // 5. Circle covers entire viewport and seamlessly crossfades into #070709
  // 6. Seamlessly unpins directly into Our Process section
  // 7. Fully reversible when scrolling upward with 1:1 responsive tracking (scrub: 0.35)
  // ========================================================
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // REDUCED MOTION PREFERENCE
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (processCircleRef.current) {
          gsap.set(processCircleRef.current, { autoAlpha: 0 });
        }
        if (processTransitionStageRef.current) {
          gsap.set(processTransitionStageRef.current, { autoAlpha: 0 });
        }
        if (processHeadingRef.current) {
          gsap.set(processHeadingRef.current, { autoAlpha: 0 });
        }
        if (capabilitiesContentRef.current) {
          gsap.set(capabilitiesContentRef.current, { y: 0, opacity: 1 });
        }
      });

      // NORMAL MOTION
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!capabilitiesRef.current || !processCircleRef.current) return;

        const initialScale = getInitialCircleScale();

        // Initial state of the transition elements
        gsap.set(processCircleRef.current, {
          autoAlpha: 0,
          xPercent: -50,
          yPercent: 50,
          scale: initialScale,
          transformOrigin: "50% 50%",
        });

        if (processHeadingRef.current) {
          gsap.set(processHeadingRef.current, { autoAlpha: 0, y: 30 });
        }

        if (capabilitiesContentRef.current) {
          gsap.set(capabilitiesContentRef.current, { y: 0, opacity: 1 });
        }
        if (capabilitiesBgRef.current) {
          gsap.set(capabilitiesBgRef.current, { opacity: 1 });
        }
        if (capabilitiesRef.current) {
          gsap.set(capabilitiesRef.current, { backgroundColor: "transparent" });
        }

        // Generous scroll distance (~185vh desktop, ~140vh mobile) so expansion is gradual & cinematic
        const isMobile = window.innerWidth < 768;
        const scrollDistance = isMobile
          ? window.innerHeight * 1.4
          : window.innerHeight * 1.85;

        // Single coordinated timeline matching the proven Projects transition architecture
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: capabilitiesRef.current,
            start: "bottom bottom",
            end: () => `+=${scrollDistance}`,
            pin: true,
            scrub: 0.35, // Responsive 1:1 scroll tracking matching working Projects transition
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Trigger typewriter ONLY AFTER green circle has completely covered the viewport (progress >= 0.68)
              if (self.progress >= 0.68) {
                setIsProcessHeadingActive(true);
              }
            },
            onRefresh: (self) => {
              // Ensure active state if refreshed after full-screen coverage
              if (self.progress >= 0.68) {
                setIsProcessHeadingActive(true);
              }
            },
          },
        });

        // 1. Circle emerges at bottom-center at initialScale right as transition begins (0.00 -> 0.02)
        tl.fromTo(
          processCircleRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.02, ease: "power1.in", immediateRender: false },
          0.0
        );

        // 2. Circle expands smoothly from initialScale to full coverage (0.00 -> 0.68)
        // Reaches full 4-corner coverage before the atmospheric wash begins, eliminating any rectangular edge artifacts
        tl.fromTo(
          processCircleRef.current,
          { scale: initialScale },
          {
            scale: () => getMaxCircleScale(),
            ease: "power1.inOut",
            duration: 0.68,
            immediateRender: false,
          },
          0.0
        );

        // 3. Outgoing What We Do content (Service 05 & stopped Binary Trail) moves UPWARD (0.00 -> 0.65),
        // physically propelled by the rising circle beneath it
        if (capabilitiesContentRef.current) {
          tl.fromTo(
            capabilitiesContentRef.current,
            { y: 0 },
            {
              y: () => -window.innerHeight * 1.15,
              duration: 0.65,
              ease: "power1.inOut",
              immediateRender: false,
            },
            0.0
          );

          // Fade out cleanly as the green transition starts (0.02 -> 0.20)
          tl.fromTo(
            capabilitiesContentRef.current,
            { opacity: 1 },
            {
              opacity: 0,
              duration: 0.18,
              ease: "power1.in",
              immediateRender: false,
            },
            0.02
          );
        }

        // 4. "Our Process..." heading appears ONLY AFTER the green circle has completely covered the entire viewport (0.68 -> 0.71)
        if (processHeadingRef.current) {
          tl.fromTo(
            processHeadingRef.current,
            { autoAlpha: 0, y: 15 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.03,
              ease: "power1.out",
              immediateRender: false,
            },
            0.68
          );
        }

        // Trigger typewriter animation immediately once the circle has completely covered the viewport
        tl.call(() => {
          setIsProcessHeadingActive(true);
        }, undefined, 0.68);

        // 5. Match capabilities background seamlessly to #102D25 before unpinning (0.85 -> 0.94)
        if (capabilitiesBgRef.current) {
          tl.fromTo(
            capabilitiesBgRef.current,
            { opacity: 1 },
            { opacity: 0, duration: 0.09, immediateRender: false },
            0.85
          );
        }
        tl.fromTo(
          capabilitiesRef.current,
          { backgroundColor: "transparent" },
          { backgroundColor: "#102D25", duration: 0.09, immediateRender: false },
          0.85
        );

        // 6. Generous settled hold on full-screen continuous circle before unpinning cleanly into Our Process (0.88 -> 1.00)
        tl.to({}, { duration: 0.12 }, 0.88);
      });

      return () => {
        mm.revert();
      };
    },
    { scope: capabilitiesRef }
  );

  // Smooth cinematic click toggle handler for both folder & button
  const handleToggleFolder = useCallback(() => {
    if (isAnimatingRef.current || !pinnedContainerRef.current) return;

    // 1. Reduced Motion handling: immediate state toggle without motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const flap = pinnedContainerRef.current.querySelector<HTMLElement>('[data-folder-flap]');
      const cardEls = pinnedContainerRef.current.querySelectorAll<HTMLElement>('[data-dossier-card]');

      if (isFolderOpen) {
        if (flap) gsap.set(flap, { rotateX: 0 });
        cardEls.forEach((cardEl, index) => {
          const card = DOSSIER_CARDS[index];
          if (!card) return;
          const peek = getCardPeek(card);
          gsap.set(cardEl, {
            x: peek.x,
            y: peek.y,
            rotation: peek.rot,
            scale: peek.scale,
            zIndex: 10,
          });
        });
        setIsFolderOpen(false);
      } else {
        if (flap) gsap.set(flap, { rotateX: -26 });
        cardEls.forEach((cardEl, index) => {
          const card = DOSSIER_CARDS[index];
          if (!card) return;
          const target = getCardTarget(card);
          gsap.set(cardEl, {
            x: target.x,
            y: target.y,
            rotation: target.rot,
            scale: 1,
            zIndex: 35,
          });
        });
        setIsFolderOpen(true);
      }
      return;
    }

    // 2. Full Cinematic Animation
    const st = masterTlRef.current?.scrollTrigger;
    const startY = st ? st.start : pinnedContainerRef.current.offsetTop;
    const endY = st ? st.end : (startY + window.innerHeight * 5.0);
    const scrollRange = endY - startY;

    // Lock interactions against overlapping clicks
    isAnimatingRef.current = true;
    setIsAnimating(true);

    if (isFolderOpen) {
      // GATHER ARCHIVE: All project cards smoothly return to folder pocket (progress 0.10)
      const targetScroll = startY + scrollRange * 0.10;

      gsap.to(window, {
        scrollTo: { y: targetScroll, autoKill: false },
        duration: 1.25,
        ease: "power2.inOut",
        onComplete: () => {
          setIsFolderOpen(false);
          isAnimatingRef.current = false;
          setIsAnimating(false);
        },
      });
    } else {
      // OPEN ARCHIVE: Front flap opens (-26deg), cards emerge and scatter to quadrants
      const isMobile = window.innerWidth < 768;
      const targetProgress = isMobile ? 0.36 : 0.38;
      const targetScroll = startY + scrollRange * targetProgress;

      gsap.to(window, {
        scrollTo: { y: targetScroll, autoKill: false },
        duration: 1.25,
        ease: "power2.inOut",
        onComplete: () => {
          setIsFolderOpen(true);
          isAnimatingRef.current = false;
          setIsAnimating(false);
        },
      });
    }
  }, [isFolderOpen]);

  return (
    <section id="work" data-nav-theme="cream" className="relative w-full bg-[#F7F5ED] text-[#171C19]">
      {/* ======================================================== */}
      {/* PART 1: PINNED PROJECTS & CIRCULAR TRANSITION CONTAINER  */}
      {/* Pinned sticky stage for folder archive, expanding circle  */}
      {/* and centered introductory statement                     */}
      {/* ======================================================== */}
      <div
        ref={pinnedContainerRef}
        className="relative w-full h-[600vh]"
      >
        {/* Continuous Hero-to-Projects Atmospheric Top Wash */}
        <div
          className="absolute top-0 left-0 right-0 h-[60vh] pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 45% at 50% 0%, rgba(205, 235, 221, 0.22) 0%, rgba(221, 239, 226, 0.08) 55%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Center Ambient Light Diffusion behind Folder */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1200px] h-[75vh] pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(205, 235, 221, 0.24) 0%, rgba(119, 203, 165, 0.08) 50%, transparent 75%)",
          }}
          aria-hidden="true"
        />

        {/* ======================================================== */}
        {/* PINNED STAGE VIEWPORT (CSS STICKY 100vh)                 */}
        {/* ======================================================== */}
        <div
          ref={stageRef}
          className="sticky top-0 w-full h-[100vh] min-h-[100svh] overflow-hidden select-none z-10"
        >
          {/* ======================================================== */}
          {/* LAYER 1: CINEMATIC CIRCULAR TRANSITION (z-[15])          */}
          {/* Emerges from BOTTOM CENTER of viewport                   */}
          {/* Expands to cover full viewport and becomes background    */}
          {/* ======================================================== */}
          <div
            ref={circleTransitionRef}
            className="absolute left-1/2 bottom-0 pointer-events-none z-[15] opacity-0 invisible will-change-transform rounded-full flex items-center justify-center overflow-hidden"
            style={{
              visibility: "hidden",
              opacity: 0,
              width: "100vh",
              height: "100vh",
              background:
                "linear-gradient(135deg, #104B3D 0%, #176B55 34%, #64A98E 68%, #BCE8D5 100%)",
              boxShadow:
                "0 -14px 60px rgba(23, 107, 85, 0.30), inset 0 2px 14px rgba(188, 232, 213, 0.40)",
            }}
            aria-hidden="true"
          >
            {/* Specular curved highlight evoking glossy glass folder finish */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[35%] rounded-[100%] pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.65) 0%, rgba(188, 232, 213, 0.20) 45%, transparent 75%)",
              }}
            />
          </div>

          {/* ======================================================== */}
          {/* LAYER 2: OUTGOING PROJECTS SECTION CONTENT (z-[20])      */}
          {/* Positioned at z-[20], IN FRONT OF the rising circle      */}
          {/* Moves UPWARD (y: 0 -> -115vh) during transition          */}
          {/* Folder, cards, and header remain untouched together!     */}
          {/* ======================================================== */}
          <div
            ref={projectsContentRef}
            className="relative w-full h-full flex flex-col justify-between px-6 lg:px-12 pt-14 md:pt-16 pb-8 md:pb-10 z-[20] will-change-transform"
          >
            {/* Editorial Section Header */}
            <div className="relative z-20 w-full flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.24em] text-[#171C19] uppercase">
                  SELECTED WORK
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] md:text-[10px] font-mono font-medium tracking-[0.2em] text-[#5E6962] uppercase">
                    PROJECT ARCHIVE &nbsp;—&nbsp; 01 // 03
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#176B56]" />
                </div>
              </div>

              <div className="text-[9px] md:text-[10px] font-mono font-medium tracking-[0.22em] text-[#5E6962] uppercase hidden sm:block">
                DIGITAL PRODUCTS &nbsp;—&nbsp; DESIGN &amp; ENGINEERING
              </div>
            </div>

            {/* Center: The Interactive Glossy Glass Folder Experience */}
            <div className="relative z-20 w-full flex-1 flex items-center justify-center">
              <div
                ref={folderWrapperRef}
                className="will-change-transform flex items-center justify-center"
              >
                <InteractiveFolder
                  isFolderOpen={isFolderOpen}
                  isAnimating={isAnimating}
                  onToggleFolder={handleToggleFolder}
                  onOpenProject={(proj) => setActiveGalleryProject(proj)}
                />
              </div>
            </div>

            {/* Editorial Bottom Status Indicator */}
            <div className="relative z-20 w-full flex items-center justify-between text-[9px] md:text-[10px] tracking-[0.2em] text-[#5E6962] uppercase">
              <div className="flex items-center gap-3">
                <span className="w-16 h-[1px] bg-[#DEDCD2] hidden sm:inline-block" />
                <span>SCROLL TO EXPLORE DOSSIER</span>
              </div>

              <span className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] text-[#5E6962]">
                EST. 2024 / PROPRIETARY
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* LAYER 3: INTRODUCTORY STATEMENT (z-[25])                 */}
          {/* Appears inside the expanding jade circle as it nears     */}
          {/* full coverage; holds centered on full-screen circle      */}
          {/* Moves out of view naturally when pinned stage unpins!    */}
          {/* ======================================================== */}
          <div
            ref={statementRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none opacity-0 invisible z-[25]"
          >
            <div className="flex flex-col items-center justify-center text-center max-w-[960px] pointer-events-auto">
              <span className="text-[10px] md:text-xs font-mono font-semibold tracking-[0.24em] text-[#102D25] uppercase mb-6 md:mb-8">
                WHAT WE DO
              </span>
              <h2 className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl lg:text-[62px] xl:text-[72px] font-display font-medium leading-[1.08] tracking-tight text-[#102D25] whitespace-pre-line">
                We turn ambitious{"\n"}ideas into products{"\n"}people want to use.
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PART 2: NATURAL SCROLLING SERVICES SECTION               */}
      {/* Normal document flow: reveals each service naturally as  */}
      {/* user scrolls down, with NO fade-in/fade-out animations.   */}
      {/* Once in viewport, each service remains visible.          */}
      {/* ======================================================== */}
      <div
        id="capabilities"
        ref={capabilitiesRef}
        className="relative w-full z-20 text-[#222722]"
      >
        {/* Continuous Background: Gradient E from Mint to Ivory */}
        <div
          ref={capabilitiesBgRef}
          className="absolute -top-[2px] left-0 right-0 bottom-0 pointer-events-none z-0 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #BCE8D5 0%, #D0EDE0 18%, #E2F2E9 42%, #F0F4EC 68%, #F7F4ED 100%)",
          }}
          aria-hidden="true"
        >
          {/* Soft Atmospheric Wash over ivory area */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[120vh] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 75% 45% at 50% 30%, rgba(188, 232, 213, 0.35) 0%, rgba(226, 242, 233, 0.12) 55%, transparent 100%)",
            }}
          />
        </div>

        {/* Outgoing What We Do content: lifts upward during circular transition */}
        <div
          ref={capabilitiesContentRef}
          className="relative z-20 w-full will-change-transform"
        >
          {/* Cinematic Animated Binary Trail following the service layout */}
          <BinaryTrail />

          {/* Natural Document Content Container */}
          <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-12 md:px-20 lg:px-28 xl:px-36 py-8 md:py-14 flex flex-col">
          
          {/* 01 — Product Strategy & Design (LEFT) */}
          <div
            data-service-index="01"
            className="w-full min-h-[50vh] md:min-h-[58vh] flex items-center justify-start py-8 md:py-12"
          >
            <div className="flex flex-col items-start text-left max-w-[80%] min-[400px]:max-w-[82%] md:max-w-[620px]">
              <div data-service-heading className="flex flex-col items-start text-left will-change-transform">
                <span className="text-xs md:text-sm font-mono font-medium tracking-[0.24em] text-[#176B55] uppercase mb-4 md:mb-6">
                  01
                </span>
                <h3 className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-display font-semibold md:font-medium tracking-tight text-[#222722] leading-[1.08] whitespace-pre-line mb-6 md:mb-8">
                  Product Strategy{"\n"}&amp; Design
                </h3>
              </div>
              <p data-service-desc className="text-base sm:text-lg md:text-xl font-body text-[#39473F] leading-relaxed max-w-[480px] will-change-transform">
                From early ideas to clear product direction, intuitive UX, and polished interfaces.
              </p>
            </div>
          </div>

          {/* 02 — Web & Creative Development (RIGHT) */}
          <div
            data-service-index="02"
            className="w-full min-h-[50vh] md:min-h-[58vh] flex items-center justify-end py-8 md:py-12"
          >
            <div className="flex flex-col items-end text-right max-w-[80%] min-[400px]:max-w-[82%] md:max-w-[620px]">
              <div data-service-heading className="flex flex-col items-end text-right will-change-transform">
                <span className="text-xs md:text-sm font-mono font-medium tracking-[0.24em] text-[#176B55] uppercase mb-4 md:mb-6">
                  02
                </span>
                <h3 className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-display font-semibold md:font-medium tracking-tight text-[#222722] leading-[1.08] whitespace-pre-line mb-6 md:mb-8">
                  Web &amp; Creative{"\n"}Development
                </h3>
              </div>
              <p data-service-desc className="text-base sm:text-lg md:text-xl font-body text-[#39473F] leading-relaxed max-w-[480px] will-change-transform">
                High-performance websites and digital experiences built with motion, interaction, and attention to detail.
              </p>
            </div>
          </div>

          {/* 03 — Full-Stack Engineering (LEFT) */}
          <div
            data-service-index="03"
            className="w-full min-h-[50vh] md:min-h-[58vh] flex items-center justify-start py-8 md:py-12"
          >
            <div className="flex flex-col items-start text-left max-w-[80%] min-[400px]:max-w-[82%] md:max-w-[620px]">
              <div data-service-heading className="flex flex-col items-start text-left will-change-transform">
                <span className="text-xs md:text-sm font-mono font-medium tracking-[0.24em] text-[#176B55] uppercase mb-4 md:mb-6">
                  03
                </span>
                <h3 className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-display font-semibold md:font-medium tracking-tight text-[#222722] leading-[1.08] whitespace-pre-line mb-6 md:mb-8">
                  Full-Stack{"\n"}Engineering
                </h3>
              </div>
              <p data-service-desc className="text-base sm:text-lg md:text-xl font-body text-[#39473F] leading-relaxed max-w-[480px] will-change-transform">
                Reliable applications and scalable systems engineered from frontend to backend.
              </p>
            </div>
          </div>

          {/* 04 — MVP Build & Launch (RIGHT) */}
          <div
            data-service-index="04"
            className="w-full min-h-[50vh] md:min-h-[58vh] flex items-center justify-end py-8 md:py-12"
          >
            <div className="flex flex-col items-end text-right max-w-[80%] min-[400px]:max-w-[82%] md:max-w-[620px]">
              <div data-service-heading className="flex flex-col items-end text-right will-change-transform">
                <span className="text-xs md:text-sm font-mono font-medium tracking-[0.24em] text-[#176B55] uppercase mb-4 md:mb-6">
                  04
                </span>
                <h3 className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-display font-semibold md:font-medium tracking-tight text-[#222722] leading-[1.08] whitespace-pre-line mb-6 md:mb-8">
                  MVP Build{"\n"}&amp; Launch
                </h3>
              </div>
              <p data-service-desc className="text-base sm:text-lg md:text-xl font-body text-[#39473F] leading-relaxed max-w-[480px] will-change-transform">
                From concept to a working product — designed, engineered, tested, and ready to ship.
              </p>
            </div>
          </div>

          {/* 05 — AI Automation & Integrations (LEFT) */}
          <div
            data-service-index="05"
            className="w-full min-h-[50vh] md:min-h-[58vh] flex items-center justify-start py-8 md:py-12 pb-20 md:pb-28"
          >
            <div className="flex flex-col items-start text-left max-w-[80%] min-[400px]:max-w-[82%] md:max-w-[620px]">
              <div data-service-heading className="flex flex-col items-start text-left will-change-transform">
                <span className="text-xs md:text-sm font-mono font-medium tracking-[0.24em] text-[#176B55] uppercase mb-4 md:mb-6">
                  05
                </span>
                <h3 className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-display font-semibold md:font-medium tracking-tight text-[#222722] leading-[1.08] whitespace-pre-line mb-6 md:mb-8">
                  AI <span data-trail-target className="inline">Automation</span>{"\n"}&amp; Integrations
                </h3>
              </div>
              <p data-service-desc className="text-base sm:text-lg md:text-xl font-body text-[#39473F] leading-relaxed max-w-[480px] will-change-transform">
                Intelligent workflows and seamless integrations that automate repetitive tasks and help businesses work smarter.
              </p>
            </div>
          </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* SCROLL BUFFER (110–135px)                                */}
        {/* Deliberate pause between binary trail reaching endpoint   */}
        {/* beside 'Automation' and the circular transition starting. */}
        {/* During this buffer: trail stays stopped, circle hidden.  */}
        {/* ======================================================== */}
        <div
          className="relative w-full h-[110px] md:h-[135px] pointer-events-none"
          aria-hidden="true"
        />

        {/* ======================================================== */}
        {/* SCROLL-CONTROLLED CIRCULAR TRANSITION INTO OUR PROCESS    */}
        {/* Emerges at bottom-center after Service 05, pushes section */}
        {/* upward, covers viewport, seamlessly reveals Our Process   */}
        {/* ======================================================== */}
        <div
          ref={processTransitionStageRef}
          data-nav-theme="green"
          className="absolute left-0 right-0 bottom-0 h-screen pointer-events-none overflow-hidden z-30 select-none"
          aria-hidden="true"
        >
          {/* LAYER 1: Expanding Transition Circle with Gradient C (z-10) */}
          <div
            ref={processCircleRef}
            data-nav-theme="green"
            className="absolute left-1/2 bottom-0 pointer-events-none z-10 opacity-0 invisible will-change-transform rounded-full flex items-center justify-center overflow-hidden"
            style={{
              visibility: "hidden",
              opacity: 0,
              width: "100vh",
              height: "100vh",
              background:
                "linear-gradient(135deg, #104B3D 0%, #176B55 34%, #64A98E 68%, #BCE8D5 100%)",
              boxShadow: "0 -14px 60px rgba(16, 45, 37, 0.30)",
            }}
          />

          {/* LAYER 2: CINEMATIC OUR PROCESS TYPEWRITER HEADING (z-20) */}
          {/* Appears in center of screen ONLY AFTER the green circle has completely covered the screen! */}
          <div
            ref={processHeadingRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none opacity-0 invisible z-20"
          >
            <ProcessTypewriterHeading active={isProcessHeadingActive} />
          </div>
        </div>
      </div>

      {/* Flagship Project Gallery Modal */}
      <ProjectGallery
        project={activeGalleryProject}
        onClose={() => setActiveGalleryProject(null)}
        onSelectProject={(proj) => setActiveGalleryProject(proj)}
      />
    </section>
  );
}
