"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [isLettersSettled, setIsLettersSettled] = useState(false);
  const heroWordRef = useRef<HTMLDivElement>(null);
  const isAnimationComplete = useRef(false);

  // Persistent folder element behind KELVOR typography (Layer B, z-[5])
  const heroFolderRef = useRef<HTMLDivElement>(null);
  const isFolderAnimationDone = useRef(false);
  const folderTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Prime letters at their initial staging coordinates on mount to prevent any flash/jump
  useEffect(() => {
    if (!heroWordRef.current || shouldReduceMotion) return;
    const heroWord = heroWordRef.current;
    const letterK = heroWord.querySelector(".hero-letter--k");
    const letterE = heroWord.querySelector(".hero-letter--e");
    const letterL = heroWord.querySelector(".hero-letter--l");
    const letterV = heroWord.querySelector(".hero-letter--v");
    const letterO = heroWord.querySelector(".hero-letter--o");
    const letterR = heroWord.querySelector(".hero-letter--r");
    if (!letterK || !letterE || !letterL || !letterV || !letterO || !letterR) return;

    gsap.set([letterK, letterE, letterL], { yPercent: -120, x: 0, opacity: 0 });
    gsap.set([letterV, letterO, letterR], { yPercent: 120, x: 0, opacity: 0 });
  }, [shouldReduceMotion]);

  useEffect(() => {
    // If no fullscreen loader overlay is present, trigger entrance immediately
    const loaderOverlay = document.querySelector('[class*="z-[9999]"]');
    if (!loaderOverlay) {
      setIsHeroReady(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("kelvor-hero-navbar-enter"));
      }
      // Fallback: if loader was absent, show folder centered behind KELVOR wordmark
      if (heroFolderRef.current && !isFolderAnimationDone.current) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const wordEl = document.querySelector(".hero-word") as HTMLElement | null;
        let targetCenterX = vw * 0.5;
        let cy = vh * 0.44;
        if (wordEl) {
          const rect = wordEl.getBoundingClientRect();
          targetCenterX = rect.left + rect.width / 2;
          cy = rect.top + rect.height / 2;
        }
        gsap.set(heroFolderRef.current, {
          x: targetCenterX,
          y: cy,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          opacity: 1,
          willChange: "auto",
        });
        isFolderAnimationDone.current = true;
      }
      return;
    }

    // Trigger strictly after brightness reveal and loading-screen exit have completed
    const handleLoaderExit = () => setIsHeroReady(true);
    window.addEventListener("kelvor-loader-removed", handleLoaderExit, { once: true });

    // Fallback: trigger after 3.2s in case loader event is missed
    const fallbackTimer = setTimeout(() => {
      setIsHeroReady(true);
    }, 3200);

    return () => {
      window.removeEventListener("kelvor-loader-removed", handleLoaderExit);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Coordinated Folder Animation Timeline:
  // 1. Fall directly below the letter R on the right side
  // 2. Smooth clockwise curved journey sweeping underneath O and V toward the space between L and V
  // 3. Gracefully decelerate, arrive and settle between L and V
  // 4. Smooth continuous enlargement into permanent background element centered behind L and V
  useEffect(() => {
    const handleStartFolderJourney = (e: Event) => {
      const customEvent = e as CustomEvent<{
        startX: number;
        startY: number;
        iconWidth: number;
        iconHeight: number;
      }>;
      const detail = customEvent.detail;
      if (!detail || !heroFolderRef.current || !heroWordRef.current) return;

      const folderEl = heroFolderRef.current;
      const heroWord = heroWordRef.current;
      const { startX, startY, iconWidth } = detail;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // 1. Precise Geometry of KELVOR Typography and Letter Wrappers
      const wordRect = heroWord.getBoundingClientRect();
      const wordCenterY = wordRect.top + wordRect.height / 2;
      const wordWidth = wordRect.width;
      const wordBottom = wordRect.bottom;

      const wrapperL = heroWord.querySelector(".hero-letter-wrapper--l") as HTMLElement | null;
      const wrapperV = heroWord.querySelector(".hero-letter-wrapper--v") as HTMLElement | null;
      const wrapperR = heroWord.querySelector(".hero-letter-wrapper--r") as HTMLElement | null;

      const rectWrapperL = wrapperL?.getBoundingClientRect();
      const rectWrapperV = wrapperV?.getBoundingClientRect();
      const rectWrapperR = wrapperR?.getBoundingClientRect();

      // Right side: Horizontal center of Letter R
      const rCenterX = rectWrapperR 
        ? rectWrapperR.left + rectWrapperR.width / 2 
        : wordRect.right - wordWidth * 0.09;

      // Destination: Exact horizontal center of the entire KELVOR wordmark
      const wordCenterX = wordRect.left + wordWidth / 2;

      // Dimensions matching clamp(220px, 46vw, 720px) for enlargement
      const targetDiameter = Math.min(Math.max(220, vw < 768 ? vw * 0.68 : vw * 0.46), 720);
      const iconW = iconWidth || 138;
      const baseWidth = folderEl.offsetWidth || targetDiameter;
      const initialScale = iconW / baseWidth;

      // Final enlarged center: precisely aligned with the horizontal center of KELVOR
      const finalCenterX = wordCenterX;
      const finalCenterY = wordCenterY;

      if (shouldReduceMotion) {
        gsap.set(folderEl, {
          x: finalCenterX,
          y: finalCenterY,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          rotation: 0,
          opacity: 1,
          willChange: "auto",
        });
        isFolderAnimationDone.current = true;
        return;
      }

      // ========================================================
      // 1. FALL DESTINATION DIRECTLY BELOW THE LETTER R
      // ========================================================
      const fallDropMargin = Math.min(50, Math.max(38, vh * 0.07));
      const P0_x = rCenterX;
      const P0_y = wordBottom + fallDropMargin;

      // ========================================================
      // 2. SETTLE & ENLARGE DESTINATION CENTERED BEHIND KELVOR
      // ========================================================
      const P3_x = wordCenterX;
      const P3_y = wordCenterY;

      // ========================================================
      // 3. CLOCKWISE CURVED TRAJECTORY CONTROL POINTS
      // Curves underneath letters O and V in a clockwise arc
      // ========================================================
      // C1 sweeps horizontally left underneath letter R and O
      const C1_x = P0_x - (P0_x - P3_x) * 0.35;
      const C1_y = Math.max(P0_y + 35, wordBottom + 55);

      // C2 holds underneath letter V before curving upward into the gap
      const C2_x = P3_x + (P0_x - P3_x) * 0.18;
      const C2_y = Math.max(P0_y + 12, wordBottom + 45);

      // Animation Durations & Pacing
      const fallDuration = 0.65;
      const curveDuration = 1.75; // Slower, graceful, premium movement
      const settleDuration = 0.40; // Visibly settles before enlargement
      const enlargeDuration = 1.35; // Smooth continuous scaling

      // Prime folder element at exact loading endpoint with identical size and opacity
      gsap.set(folderEl, {
        x: startX,
        y: startY,
        xPercent: -50,
        yPercent: -50,
        scale: initialScale,
        rotation: 0,
        opacity: 1,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          isFolderAnimationDone.current = true;
          gsap.set(folderEl, { willChange: "auto" });
        },
      });
      folderTimelineRef.current = tl;

      // ========================================================
      // STAGE 1: NATURAL FALL BELOW THE LETTER R
      // Starts directly at loading bar endpoint
      // Accelerates downward with gravity (power2.in: y ~ t^2)
      // Ends directly below letter R on the right side of the hero
      // Size remains strictly 1.0x, subtle sense of weight
      // ========================================================
      tl.to(folderEl, {
        y: P0_y,
        duration: fallDuration,
        ease: "power2.in",
      }, 0);

      tl.to(folderEl, {
        x: P0_x,
        duration: fallDuration,
        ease: "power1.out",
      }, 0);

      tl.to(folderEl, {
        rotation: 5,
        duration: fallDuration,
        ease: "power1.in",
      }, 0);

      // ========================================================
      // STAGE 2: CLOCKWISE CURVED MOVEMENT TOWARD GAP BETWEEN L & V
      // Starts below letter R on the right side
      // Moves in a smooth CLOCKWISE curve underneath O and V
      // Curves upward directly into the space between L and V
      // Decelerates gracefully as it approaches destination (power2.out)
      // ========================================================
      const curveStart = fallDuration;
      const curveProxy = { t: 0 };

      tl.to(curveProxy, {
        t: 1,
        duration: curveDuration,
        ease: "power2.out",
        onUpdate: () => {
          const t = curveProxy.t;
          const inv = 1 - t;
          // Cubic Bezier: B(t) = (1-t)^3*P0 + 3(1-t)^2*t*C1 + 3(1-t)*t^2*C2 + t^3*P3
          const bx = inv * inv * inv * P0_x + 3 * inv * inv * t * C1_x + 3 * inv * t * t * C2_x + t * t * t * P3_x;
          const by = inv * inv * inv * P0_y + 3 * inv * inv * t * C1_y + 3 * inv * t * t * C2_y + t * t * t * P3_y;
          // Prevent horizontal overflow
          const ox = Math.max(iconW / 2 + 10, Math.min(vw - iconW / 2 - 10, bx));
          gsap.set(folderEl, { x: ox, y: by });
        },
      }, curveStart);

      // Subtle dynamic banking: tilts gently into the curve, returns to 0deg as it settles
      tl.to(folderEl, {
        keyframes: [
          { rotation: -4, duration: curveDuration * 0.45, ease: "sine.inOut" },
          { rotation: 0, duration: curveDuration * 0.55, ease: "sine.out" },
        ],
      }, curveStart);

      // ========================================================
      // STAGE 3: STOP AND VISIBLY SETTLE BETWEEN L AND V
      // Stationary pause at 1.0x scale between L and V before enlargement
      // ========================================================
      const settleStart = curveStart + curveDuration;
      tl.to({}, { duration: settleDuration }, settleStart);

      // ========================================================
      // STAGE 4: ENLARGE INTO BACKGROUND ELEMENT BEHIND L AND V
      // Centered horizontally at the gap between L and V (gapLV_X)
      // Scales smoothly into native 1.0x layout dimensions
      // Remains permanently visible behind KELVOR text (z-[5])
      // ========================================================
      const enlargeStart = settleStart + settleDuration;
      tl.to(folderEl, {
        scale: 1,
        duration: enlargeDuration,
        ease: "power2.out",
      }, enlargeStart);
    };

    window.addEventListener("kelvor-start-folder-journey", handleStartFolderJourney);
    return () => {
      window.removeEventListener("kelvor-start-folder-journey", handleStartFolderJourney);
      if (folderTimelineRef.current) {
        folderTimelineRef.current.kill();
      }
    };
  }, [shouldReduceMotion]);

  // Window resize handler: keeps enlarged folder precisely centered behind the KELVOR wordmark
  useEffect(() => {
    const handleResize = () => {
      if (!isFolderAnimationDone.current || !heroFolderRef.current) return;
      const wordEl = document.querySelector(".hero-word") as HTMLElement | null;
      let targetX = window.innerWidth * 0.5;
      let targetY = window.innerHeight * 0.44;
      if (wordEl) {
        const rect = wordEl.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      }
      gsap.set(heroFolderRef.current, {
        x: targetX,
        y: targetY,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  // 3-STAGE CINEMATIC LETTER CONVERGENCE EFFECT
  // Stage 1: K (Top-Left) & R (Bottom-Left)
  // Stage 2: E (Top-Left) & O (Bottom-Right)
  // Stage 3: L (Top-Left) & V (Bottom-Right)
  useEffect(() => {
    if (!isHeroReady || !heroWordRef.current) return;

    const heroWord = heroWordRef.current;
    const letterK = heroWord.querySelector(".hero-letter--k") as HTMLElement | null;
    const letterE = heroWord.querySelector(".hero-letter--e") as HTMLElement | null;
    const letterL = heroWord.querySelector(".hero-letter--l") as HTMLElement | null;
    const letterV = heroWord.querySelector(".hero-letter--v") as HTMLElement | null;
    const letterO = heroWord.querySelector(".hero-letter--o") as HTMLElement | null;
    const letterR = heroWord.querySelector(".hero-letter--r") as HTMLElement | null;

    if (!letterK || !letterE || !letterL || !letterV || !letterO || !letterR) return;

    const allLetters = [letterK, letterE, letterL, letterV, letterO, letterR];

    // Respect reduced motion preference: assemble immediately with no movement
    if (shouldReduceMotion) {
      gsap.set(allLetters, { x: 0, y: 0, opacity: 1 });
      isAnimationComplete.current = true;
      setIsLettersSettled(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("kelvor-hero-navbar-enter"));
      }
      return;
    }

    // Restore original initial-transition positions and trajectories:
    // K, E, L start above (-120% translateY)
    // V, O, R start below (120% translateY)
    gsap.set([letterK, letterE, letterL], { yPercent: -120, x: 0, opacity: 0 });
    gsap.set([letterV, letterO, letterR], { yPercent: 120, x: 0, opacity: 0 });

    const tl = gsap.timeline({
      defaults: {
        duration: 1.15,
        ease: "power2.inOut",
      },
      onComplete: () => {
        isAnimationComplete.current = true;
        setIsLettersSettled(true);
        // Clear transform properties so pure responsive CSS rules govern reflow upon resize
        gsap.set(allLetters, { clearProps: "transform" });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("kelvor-hero-navbar-enter"));
        }
      },
    });

    // Start smoothly right after loading screen exit has completed
    tl.addLabel("stage1", "+=0.04");

    // --------------------------------------------------------
    // PAIR 1 — K AND R:
    // K: slides downward from original above position (-120% -> 0%)
    // R: slides upward from original below position (120% -> 0%)
    // Both start simultaneously and arrive at precisely the same time.
    // --------------------------------------------------------
    tl.set([letterK, letterR], { opacity: 1 }, "stage1");
    tl.to(letterK, { yPercent: 0 }, "stage1");
    tl.to(letterR, { yPercent: 0 }, "stage1");

    // --------------------------------------------------------
    // PAIR 2 — E AND O:
    // Begins at ~0.25D while K and R are still in motion.
    // E: slides downward from original above position (-120% -> 0%)
    // O: slides upward from original below position (120% -> 0%)
    // Both start simultaneously and arrive at precisely the same time.
    // --------------------------------------------------------
    tl.set([letterE, letterO], { opacity: 1 }, "stage1+=0.28");
    tl.to(letterE, { yPercent: 0 }, "stage1+=0.28");
    tl.to(letterO, { yPercent: 0 }, "stage1+=0.28");

    // --------------------------------------------------------
    // PAIR 3 — L AND V:
    // Begins at ~0.50D while both prior pairs are still in motion.
    // L: slides downward from original above position (-120% -> 0%)
    // V: slides upward from original below position (120% -> 0%)
    // Both start simultaneously and arrive at precisely the same time.
    // --------------------------------------------------------
    tl.set([letterL, letterV], { opacity: 1 }, "stage1+=0.56");
    tl.to(letterL, { yPercent: 0 }, "stage1+=0.56");
    tl.to(letterV, { yPercent: 0 }, "stage1+=0.56");

    tl.call(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("kelvor-hero-navbar-enter"));
      }
    }, undefined, "stage1+=0.56");

    return () => {
      tl.kill();
    };
  }, [isHeroReady, shouldReduceMotion]);

  // Micro-repaint guard for WebKit background-clip texture persistence on scroll
  useEffect(() => {
    const heroWord = heroWordRef.current;
    if (!heroWord) return;
    const letters = heroWord.querySelectorAll<HTMLElement>(".hero-letter");
    if (letters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isAnimationComplete.current) {
            letters.forEach((letter) => {
              letter.style.transform = "translate3d(0, 0, 0.01px)";
            });
            requestAnimationFrame(() => {
              letters.forEach((letter) => {
                letter.style.transform = "translate3d(0, 0, 0)";
              });
            });
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(heroWord);
    return () => observer.disconnect();
  }, []);

  const handleScrollClick = () => {
    const nextSection = document.getElementById("work");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      data-nav-theme="cream"
      className="relative w-full h-[100svh] min-h-[580px] overflow-hidden bg-[#F7F5ED] text-[#171C19] flex flex-col justify-between px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 md:pt-28 pb-6 md:pb-8 lg:pb-9 select-none"
    >
      {/* ======================================================== */}
      {/* LAYER A: ATMOSPHERIC BACKGROUND GRAPHICS (CSS & SVG)     */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Subtle Mint & Soft Peach Ambient Radial Illumination */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, rgba(205, 235, 221, 0.55) 0%, rgba(221, 239, 226, 0.32) 34%, rgba(244, 198, 168, 0.08) 52%, rgba(247, 245, 237, 0) 72%), #F7F5ED",
          }}
        />

        {/* Flowing Misty Mint/Jade Landscape Dunes along Bottom (Inline SVG) */}
        {/* Raised starting positions on both left and right edges */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
          style={{ height: "42%" }}
          viewBox="0 0 1440 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="leftDuneGrad" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#CDEBDD" stopOpacity="0.48" />
              <stop offset="45%" stopColor="#77CBA5" stopOpacity="0.28" />
              <stop offset="80%" stopColor="#DDEFE2" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#F7F5ED" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rightDuneGrad" x1="30%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#086B55" stopOpacity="0.32" />
              <stop offset="40%" stopColor="#77CBA5" stopOpacity="0.24" />
              <stop offset="75%" stopColor="#CDEBDD" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#F7F5ED" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Left Dune Wave - raised higher on the left edge */}
          <path
            d="M 0 75 C 160 65, 300 145, 480 215 C 640 275, 780 345, 920 380 L 0 380 Z"
            fill="url(#leftDuneGrad)"
          />

          {/* Right Sweeping Dune Wave - raised higher on the right edge */}
          <path
            d="M 520 380 C 690 380, 840 295, 1040 195 C 1210 110, 1340 60, 1440 65 L 1440 380 Z"
            fill="url(#rightDuneGrad)"
          />
        </svg>
      </div>

      {/* ======================================================== */}
      {/* LAYER B: PERSISTENT HERO FOLDER ELEMENT (z-[5])          */}
      {/* Positioned BEHIND KELVOR Typography (z-10)               */}
      {/* Centered precisely behind KELVOR with soft mint glow     */}
      {/* ======================================================== */}
      <div
        ref={heroFolderRef}
        className="hero-persistent-folder absolute top-0 left-0 pointer-events-none z-[5] select-none w-[clamp(220px,min(68vw,48vh),720px)] sm:w-[clamp(340px,46vw,720px)] aspect-[1536/1024] flex items-center justify-center opacity-0"
        style={{ transformOrigin: "center center", willChange: "transform, opacity" }}
        aria-hidden="true"
      >
        {/* Layer 1: Broad diffused soft mint ambient aura (#CDEBDD) */}
        <div
          className="absolute inset-[-28%] pointer-events-none -z-20 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(205, 235, 221, 0.75) 0%, rgba(119, 203, 165, 0.35) 44%, rgba(8, 107, 85, 0.12) 66%, rgba(247, 245, 237, 0) 82%)",
            filter: "blur(44px)",
          }}
          aria-hidden="true"
        />

        {/* Layer 2: Core luminous mint green illumination hugging folder perimeter (#77CBA5 & #086B55) */}
        <div
          className="absolute inset-[-12%] pointer-events-none -z-10 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 48%, rgba(119, 203, 165, 0.90) 0%, rgba(8, 107, 85, 0.40) 48%, rgba(119, 203, 165, 0.18) 68%, rgba(247, 245, 237, 0) 80%)",
            filter: "blur(24px)",
          }}
          aria-hidden="true"
        />

        {/* Layer 3: Warm peach reflection accent at the lower edge */}
        <div
          className="absolute inset-[10%] pointer-events-none -z-10 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 64%, rgba(244, 198, 168, 0.25) 0%, rgba(247, 245, 237, 0) 65%)",
            filter: "blur(20px)",
          }}
          aria-hidden="true"
        />

        <Image
          src="/images/Glossy Mint Glass Folder Icon.png"
          alt="Glossy Mint Glass Folder Icon"
          width={1536}
          height={1024}
          priority
          unoptimized
          className="w-full h-full object-contain shrink-0 drop-shadow-[0_22px_48px_rgba(8,107,85,0.25)] drop-shadow-[0_6px_18px_rgba(119,203,165,0.30)] select-none pointer-events-none"
        />
      </div>

      {/* ======================================================== */}
      {/* LAYER C: EDITORIAL LABELS (ABOVE OVERSIZED TYPOGRAPHY)   */}
      {/* ======================================================== */}
      <motion.div
        className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#171C19]"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -6 }}
        animate={{ opacity: isHeroReady || shouldReduceMotion ? 1 : 0, y: isHeroReady || shouldReduceMotion ? 0 : -6 }}
        transition={{ duration: 1, ease, delay: 0.12 }}
      >
        {/* Left Label + Divider Line */}
        <div className="flex items-center gap-4">
          <span className="font-semibold text-[#171C19] whitespace-nowrap">
            DIGITAL PRODUCT STUDIO
          </span>
          <span className="hidden sm:inline-block w-20 md:w-28 h-[1px] bg-[#DEDCD2]" />
        </div>
      </motion.div>

      {/* ======================================================== */}
      {/* LAYER D: MAIN TYPOGRAPHY — 3-STAGE CINEMATIC CONVERGENCE */}
      {/* Stage 1: K (Top-Left) & R (Bottom-Left)                  */}
      {/* Stage 2: E (Top-Left) & O (Bottom-Right)                 */}
      {/* Stage 3: L (Top-Left) & V (Bottom-Right)                 */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full my-auto flex items-center justify-center py-2">
        <h1 className="w-full m-0 p-0 flex justify-center">
          <div ref={heroWordRef} className="hero-word" aria-label="Kelvor">
            <span className="hero-letter-wrapper hero-letter-wrapper--k">
              <span className="hero-letter hero-letter--k" data-letter="K">K</span>
            </span>
            <span className="hero-letter-wrapper hero-letter-wrapper--e">
              <span className="hero-letter hero-letter--e" data-letter="E">E</span>
            </span>
            <span className="hero-letter-wrapper hero-letter-wrapper--l">
              <span className="hero-letter hero-letter--l" data-letter="L">L</span>
            </span>
            <span className="hero-letter-wrapper hero-letter-wrapper--v">
              <span className="hero-letter hero-letter--v" data-letter="V">V</span>
            </span>
            <span className="hero-letter-wrapper hero-letter-wrapper--o">
              <span className="hero-letter hero-letter--o" data-letter="O">O</span>
            </span>
            <span className="hero-letter-wrapper hero-letter-wrapper--r">
              <span className="hero-letter hero-letter--r" data-letter="R">R</span>
            </span>
          </div>
        </h1>
      </div>

      {/* ======================================================== */}
      {/* LAYER F: SUPPORTING COPY BELOW THE MAIN WORD             */}
      {/* ======================================================== */}
      <motion.div
        className="relative z-10 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6 pt-2"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={{ opacity: isLettersSettled || shouldReduceMotion ? 1 : 0, y: isLettersSettled || shouldReduceMotion ? 0 : 8 }}
        transition={{ duration: 1.1, ease, delay: 0.1 }}
      >
        {/* On mobile: Top item is CTA button & label */}
        <div className="flex md:hidden items-center gap-3 w-full pb-1">
          <a
            href="#contact"
            className="group w-9 h-9 rounded-full bg-[#176B56] hover:bg-[#0B493C] text-[#FFFFFF] shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
            aria-label="Let's build something meaningful"
          >
            <ArrowUpRight
              strokeWidth={2}
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <a
            href="#contact"
            className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#171C19] hover:text-[#176B56] transition-colors leading-[1.5]"
          >
            LET&apos;S BUILD SOMETHING MEANINGFUL
          </a>
        </div>

        {/* Bottom 2-col row on mobile, 3-col on desktop */}
        <div className="grid grid-cols-2 md:flex md:flex-row items-end justify-between w-full gap-4 md:gap-6">
          {/* Bottom Left: Strategy Statement */}
          <div className="flex flex-col items-start max-w-[280px] md:pl-10 lg:pl-12">
            <p className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-[0.16em] uppercase leading-[1.7] text-[#5E6962]">
              STRATEGY, DESIGN AND<br />
              DEVELOPMENT FOR A<br />
              BETTER TOMORROW.
            </p>
            <div className="w-16 sm:w-20 md:w-28 h-[1px] bg-[#DEDCD2] mt-2 sm:mt-3" />
          </div>

          {/* Desktop Center-Right: Interactive Build Pill & CTA */}
          <div className="hidden md:flex items-center gap-3.5 my-1 md:my-0">
            <a
              href="#contact"
              className="group w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#176B56] hover:bg-[#0B493C] text-[#FFFFFF] shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 shrink-0"
              aria-label="Let's build something meaningful"
            >
              <ArrowUpRight
                strokeWidth={2}
                className="w-4 h-4 md:w-4.5 md:h-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#contact"
              className="text-[10px] md:text-[11px] font-semibold tracking-[0.18em] uppercase text-[#171C19] hover:text-[#176B56] transition-colors leading-[1.6]"
            >
              LET&apos;S BUILD<br />
              SOMETHING MEANINGFUL
            </a>
          </div>

          {/* Bottom Right: Independent by Design */}
          <div className="flex flex-col items-end md:items-end text-right">
            <p className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase leading-[1.6] text-[#5E6962]">
              INDEPENDENT<br />
              BY DESIGN
            </p>
            <div className="w-14 sm:w-16 md:w-20 h-[1px] bg-[#DEDCD2] mt-2 sm:mt-3" />
          </div>
        </div>
      </motion.div>

      {/* ======================================================== */}
      {/* LAYER G: MINIMAL VERTICAL SCROLL INDICATOR (BOTTOM-LEFT) */}
      {/* Indented beside Strategy Statement on Desktop            */}
      {/* ======================================================== */}
      <motion.button
        type="button"
        onClick={handleScrollClick}
        className="hidden md:flex absolute bottom-8 left-6 lg:left-12 z-20 flex-col items-center gap-2 group cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
        aria-label="Scroll to explore work"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLettersSettled || shouldReduceMotion ? 1 : 0 }}
        transition={{ duration: 1, ease, delay: 0.2 }}
      >
        {/* Vertical line with circular marker */}
        <div className="relative w-[1px] h-9 bg-[#DEDCD2] flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#176B56] shadow-xs transition-transform duration-300 group-hover:scale-125" />
        </div>
        {/* Vertical text label */}
        <span 
          className="text-[8px] font-semibold tracking-[0.25em] text-[#5E6962] uppercase group-hover:text-[#176B56] transition-colors pt-1"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          SCROLL
        </span>
      </motion.button>
    </section>
  );
}
