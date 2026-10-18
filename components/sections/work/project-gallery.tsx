"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Compass
} from "lucide-react";
import { 
  ProjectData, 
  ProjectMediaItem, 
  PROJECTS,
  GalleryLayoutMode,
  getProjectGalleryLayout
} from "@/lib/constants/work-data";
import { GalleryParticles } from "./gallery-particles";

interface ProjectGalleryProps {
  project: ProjectData | null;
  onClose: () => void;
  onSelectProject?: (project: ProjectData) => void;
}

// Ease out cubic
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Calculates the exact 3D radius for the vertical rotunda such that adjacent
// top & bottom preview panels maintain a clean visual gap from the active panel
// without overlapping and with optimal preview visibility.
function calculateVerticalRotundaRadius(
  hRend: number,
  stepAngle: number,
  perspective: number,
  targetGap: number = 26
): number {
  const theta = (stepAngle * Math.PI) / 180;
  const sinT = Math.sin(theta);
  const cosT = Math.cos(theta);
  let low = 200;
  let high = 2500;
  for (let i = 0; i < 16; i++) {
    const mid = (low + high) / 2;
    const scale0 = perspective / (perspective + mid);
    const hPanel = hRend / scale0;
    const yInner3D = mid * sinT - (hPanel / 2) * cosT;
    const zInner3D = -(mid * cosT + (hPanel / 2) * sinT);
    const yInnerScreen = yInner3D * (perspective / (perspective - zInner3D));
    const gap = yInnerScreen - hRend / 2;
    if (gap < targetGap) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return Math.round((low + high) / 2);
}

function getGalleryDimensions(stepAngle: number, layoutMode: GalleryLayoutMode) {
  const isVertical = layoutMode === "vertical";

  if (typeof window === "undefined") {
    return {
      width: 1440,
      height: 900,
      isMobile: false,
      isTablet: false,
      panelWidth: isVertical ? 1350 : 440,
      panelHeight: isVertical ? 740 : 865,
      radius: isVertical ? 720 : 620,
      perspective: 1150,
      layoutMode,
    };
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;

  // Available height between header (~64px) and footer (~64px)
  const availHeight = Math.max(300, h - 140);
  const availWidth = w;

  let persp: number;
  let rad: number;
  let wRend: number;
  let hRend: number;

  if (layoutMode === "horizontal") {
    // ==========================================================
    // 1. VERTICAL/PORTRAIT PROJECTS — REFERENCE HORIZONTAL ROTUNDA
    // Left / Center / Right arrangement, strictly preserved
    // ==========================================================
    if (isMobile) {
      persp = 750;
      hRend = Math.min(availHeight * 0.72, 480);
      const mediaH = hRend - 72;
      wRend = Math.min(availWidth * 0.78, Math.round(mediaH * 0.54) + 24);
      rad = Math.max(360, Math.round((wRend / 2) / Math.tan((stepAngle * Math.PI) / 360) * 0.95));
    } else if (isTablet) {
      persp = 950;
      hRend = Math.min(availHeight * 0.72, 560);
      const mediaH = hRend - 76;
      wRend = Math.round(mediaH * 0.54) + 26;
      rad = Math.max(540, Math.round((wRend / 2) / Math.tan((stepAngle * Math.PI) / 360) * 0.96));
    } else {
      // Desktop (>= 1024px)
      persp = 1150;
      hRend = Math.min(Math.round(availHeight * 0.74), 650);
      const mediaH = hRend - 80;
      wRend = Math.round(mediaH * 0.535) + 28;
      rad = Math.max(620, Math.round((wRend / 2) / Math.tan((stepAngle * Math.PI) / 360) * 0.96));
    }
  } else {
    // ==========================================================
    // 2. HORIZONTAL/LANDSCAPE PROJECTS — TOP / CENTER / BOTTOM ROTUNDA
    // Vertical circular arrangement, curved previews above and below
    // ==========================================================
    if (isMobile) {
      persp = 750;
      wRend = Math.min(Math.round(availWidth * 0.92), 380);
      const mediaH = Math.round((wRend - 24) / 1.7);
      hRend = Math.min(Math.round(availHeight * 0.48), mediaH + 68);
      rad = calculateVerticalRotundaRadius(hRend, stepAngle, persp, 20);
    } else if (isTablet) {
      persp = 950;
      hRend = Math.min(Math.round(availHeight * 0.58), 440);
      const mediaH = hRend - 74;
      wRend = Math.min(Math.round(availWidth * 0.86), Math.max(640, Math.round(mediaH * 1.82) + 36));
      rad = calculateVerticalRotundaRadius(hRend, stepAngle, persp, 24);
    } else {
      // Desktop (>= 1024px):
      // Target: 75–85% of available width, 60–70% of available height
      persp = 1150;
      hRend = Math.min(Math.round(availHeight * 0.60), 500);
      const mediaH = hRend - 78;
      // Tailored to wide landscape screenshot (1.75 - 1.95 ratio)
      wRend = Math.min(Math.round(availWidth * 0.82), Math.max(760, Math.round(mediaH * 1.92) + 36));
      rad = calculateVerticalRotundaRadius(hRend, stepAngle, persp, 26);
    }
  }

  // Perspective scale factor at Z = -rad:
  const scale = persp / (persp + rad);
  const pWidth = Math.round(wRend / scale);
  const pHeight = Math.round(hRend / scale);

  return {
    width: w,
    height: h,
    isMobile,
    isTablet,
    panelWidth: pWidth,
    panelHeight: pHeight,
    radius: rad,
    perspective: persp,
    layoutMode,
  };
}

// Inner modal component keyed by project.internalId to avoid resetting state in effects
function InnerGalleryModal({
  project,
  onClose,
  onSelectProject,
}: {
  project: ProjectData;
  onClose: () => void;
  onSelectProject?: (project: ProjectData) => void;
}) {
  // Gallery lifecycle phases: "welcome" -> "entering" -> "interactive" -> "exiting"
  const [phase, setPhase] = useState<"welcome" | "entering" | "interactive" | "exiting">("welcome");

  // Camera & Cylinder 3D Coordinates
  // cameraZ: starts at -1400px (outside the ring), animates forward to 0px (inside center)
  const [cameraZ, setCameraZ] = useState(-1400);
  const [currentAngle, setCurrentAngle] = useState(0);
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);

  // Active front-facing panel index
  const [activeIndex, setActiveIndex] = useState(0);

  // Lightbox Expanded View State
  const [lightboxItem, setLightboxItem] = useState<ProjectMediaItem | null>(null);

  // Audio / Video states
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayingMap, setIsPlayingMap] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Touch / Drag tracking
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const dragStartAngleRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const hasDraggedSignificantlyRef = useRef(false);

  // ----------------------------------------------------
  // PREPARE MEDIA ITEMS
  // If project has mediaItems, use them; otherwise build from galleryImages
  // ----------------------------------------------------
  const mediaItems: ProjectMediaItem[] = useMemo(() => {
    if (project.mediaItems && project.mediaItems.length > 0) {
      return project.mediaItems;
    }
    return project.galleryImages.map((src, i) => {
      const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");
      return {
        id: `${project.internalId}-${i}`,
        type: isVideo ? "video" : "image",
        src,
        title: `${project.title} — Interface Study ${i + 1}`,
        caption: `High-resolution production asset documenting ${project.title} design and engineering.`,
        badge: isVideo ? "LIVE CAPTURE" : "PRODUCTION UI"
      };
    });
  }, [project]);

  const itemCount = mediaItems.length;
  const layoutMode = useMemo(() => getProjectGalleryLayout(project), [project]);
  const isVertical = layoutMode === "vertical";

  // Angular step per panel in degrees
  const stepAngle = useMemo(() => {
    if (itemCount === 0) return 45;
    return 360 / itemCount;
  }, [itemCount]);

  // Viewport / Responsive Dimensions
  const [dimensions, setDimensions] = useState(() => getGalleryDimensions(stepAngle, layoutMode));

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getGalleryDimensions(stepAngle, layoutMode));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [stepAngle, layoutMode]);

  // Next / Previous projects in dossier
  const { prevProject, nextProject } = useMemo(() => {
    const currentIndex = PROJECTS.findIndex(p => p.internalId === project.internalId);
    const prev = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
    const next = PROJECTS[(currentIndex + 1) % PROJECTS.length];
    return { prevProject: prev, nextProject: next };
  }, [project]);

  // ----------------------------------------------------
  // ROTATION CONTROLS (DECLARED EARLY)
  // ----------------------------------------------------
  const rotateToRelative = useCallback((dir: number) => {
    targetAngleRef.current += dir * stepAngle;
  }, [stepAngle]);

  const rotateToIndex = useCallback((targetIndex: number) => {
    const currentAng = targetAngleRef.current;
    const targetBase = -targetIndex * stepAngle;
    const revolutions = Math.round((currentAng - targetBase) / 360);
    targetAngleRef.current = targetBase + revolutions * 360;
  }, [stepAngle]);

  // Video play/pause toggle
  const togglePlayPause = useCallback((itemId: string) => {
    const video = videoRefs.current[itemId];
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlayingMap(prev => ({ ...prev, [itemId]: true }));
    } else {
      video.pause();
      setIsPlayingMap(prev => ({ ...prev, [itemId]: false }));
    }
  }, []);

  // Close Showcase
  const handleClose = useCallback(() => {
    setPhase("exiting");
    setTimeout(() => {
      onClose();
    }, 350);
  }, [onClose]);

  // Skip Intro directly to interactive
  const handleSkipIntro = useCallback(() => {
    setCameraZ(0);
    setPhase("interactive");
  }, []);

  // ----------------------------------------------------
  // LOCK BODY SCROLL & HANDLE KEYBOARD
  // ----------------------------------------------------
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxItem) {
          setLightboxItem(null);
        } else {
          handleClose();
        }
      } else if (e.key === "ArrowRight" || (isVertical && e.key === "ArrowDown")) {
        rotateToRelative(-1);
      } else if (e.key === "ArrowLeft" || (isVertical && e.key === "ArrowUp")) {
        rotateToRelative(1);
      } else if (e.key === " " && phase === "interactive") {
        const currentItem = mediaItems[activeIndex];
        if (currentItem && currentItem.type === "video") {
          e.preventDefault();
          togglePlayPause(currentItem.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxItem, phase, activeIndex, mediaItems, handleClose, rotateToRelative, togglePlayPause, isVertical]);

  // ----------------------------------------------------
  // CINEMATIC ENTRANCE TIMELINE
  // Welcome Phase (t = 0 -> 1050ms)
  // Camera Rush In (t = 1050 -> 2400ms)
  // Interactive Phase (t >= 2400ms)
  // ----------------------------------------------------
  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setPhase("entering");

      const startTime = performance.now();
      const duration = 1350;
      const startZ = -1400;
      const endZ = 0;

      const enterFrame = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(progress);
        const currentZ = startZ + (endZ - startZ) * eased;

        setCameraZ(currentZ);

        if (progress < 1) {
          requestAnimationFrame(enterFrame);
        } else {
          setCameraZ(0);
          setPhase("interactive");
        }
      };

      requestAnimationFrame(enterFrame);
    }, 1050);

    return () => clearTimeout(welcomeTimer);
  }, []);

  // ----------------------------------------------------
  // PHYSICS / LERP ROTATION LOOP
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== "interactive") return;

    let animId: number;

    const loop = () => {
      const diff = targetAngleRef.current - currentAngleRef.current;
      if (Math.abs(diff) > 0.005) {
        currentAngleRef.current += diff * 0.092;
        setCurrentAngle(currentAngleRef.current);
      }

      if (itemCount > 0) {
        const normAngle = ((-currentAngleRef.current % 360) + 360) % 360;
        const rawIdx = Math.round(normAngle / stepAngle) % itemCount;
        const safeIdx = ((rawIdx % itemCount) + itemCount) % itemCount;
        setActiveIndex(safeIdx);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [phase, itemCount, stepAngle]);

  // ----------------------------------------------------
  // VIDEO PLAYBACK MANAGEMENT ACCORDING TO VIEWPORT VISIBILITY
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== "interactive") return;

    mediaItems.forEach((item, index) => {
      if (item.type !== "video") return;
      const videoEl = videoRefs.current[item.id];
      if (!videoEl) return;

      const isCurrentActive = index === activeIndex;

      if (isCurrentActive) {
        videoEl.play().catch(() => {});
        setIsPlayingMap(prev => ({ ...prev, [item.id]: true }));
      } else {
        videoEl.pause();
        setIsPlayingMap(prev => ({ ...prev, [item.id]: false }));
      }
    });
  }, [activeIndex, phase, mediaItems]);

  // ----------------------------------------------------
  // WHEEL & SCROLL LISTENER (SCROLL-CONTROLLED ROTATION)
  // ----------------------------------------------------
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (phase !== "interactive" || lightboxItem) return;
    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY * 0.055;
    targetAngleRef.current -= delta;
  }, [phase, lightboxItem]);

  // ----------------------------------------------------
  // POINTER / TOUCH DRAG & SWIPE SUPPORT
  // ----------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    if (phase !== "interactive" || lightboxItem) return;
    isDraggingRef.current = true;
    const coord = isVertical ? e.clientY : e.clientX;
    startXRef.current = coord;
    lastXRef.current = coord;
    lastTimeRef.current = performance.now();
    dragStartAngleRef.current = targetAngleRef.current;
    velocityRef.current = 0;
    hasDraggedSignificantlyRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || phase !== "interactive" || lightboxItem) return;
    const coord = isVertical ? e.clientY : e.clientX;
    const delta = coord - startXRef.current;
    if (Math.abs(delta) > 6) {
      hasDraggedSignificantlyRef.current = true;
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const dCoord = coord - lastXRef.current;
    velocityRef.current = dCoord / dt;
    lastXRef.current = coord;
    lastTimeRef.current = now;

    const sensitivity = dimensions.isMobile ? 0.22 : 0.16;
    targetAngleRef.current = dragStartAngleRef.current + delta * sensitivity;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (Math.abs(velocityRef.current) > 0.3) {
      const inertia = velocityRef.current * 80;
      targetAngleRef.current += inertia * (dimensions.isMobile ? 0.18 : 0.12);
    }

    setTimeout(() => {
      if (!isDraggingRef.current) {
        const normAngle = ((-targetAngleRef.current % 360) + 360) % 360;
        const nearestIdx = Math.round(normAngle / stepAngle);
        rotateToIndex(nearestIdx % itemCount);
      }
    }, 180);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[120] flex flex-col justify-between overflow-hidden select-none bg-[#071410] text-[#F7F4ED]"
      style={{
        background: "radial-gradient(ellipse 90% 80% at 50% 50%, #0E2921 0%, #0A1C16 45%, #050D0A 100%)",
      }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Subtle Ambient Particle Atmosphere */}
      <GalleryParticles opacity={0.55} />

      {/* Subtle Ambient Radial Floor Flare */}
      <div 
        className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] h-[340px] pointer-events-none -z-10 rounded-full"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 70%, rgba(23, 107, 85, 0.22) 0%, rgba(188, 232, 213, 0.06) 40%, transparent 75%)",
          filter: "blur(32px)",
        }}
        aria-hidden="true"
      />

      {/* ======================================================== */}
      {/* PHASE 1: CINEMATIC WELCOME INTRODUCTION OVERLAY          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {phase === "welcome" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-[#071410]/94 backdrop-blur-xl px-6 text-center"
          >
            <div className="flex flex-col items-center max-w-2xl">
              {/* Eyebrow */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-xs md:text-sm font-mono font-semibold tracking-[0.35em] uppercase text-[#BCE8D5] mb-4 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#176B55] animate-pulse" />
                WELCOME TO
              </motion.div>

              {/* Hero Project Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl min-[360px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight mb-4 text-[#F7F4ED] drop-shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
              >
                {project.title}
              </motion.h1>

              {/* Project Tagline & Category */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" }}
                className="text-sm sm:text-base md:text-lg font-body text-[#E2F2E9] max-w-md mb-8 leading-relaxed font-light"
              >
                {project.subtitle || project.tagline.replace("\n", " ")}
              </motion.p>

              {/* Subtle Progress Bar & Skip Nudge */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.95, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-[#176B55] to-[#BCE8D5]"
                  />
                </div>

                <button
                  onClick={handleSkipIntro}
                  className="text-[10px] md:text-xs font-mono font-medium tracking-[0.25em] uppercase text-[#BCE8D5]/70 hover:text-[#FFCFB8] transition-colors py-2 px-4 rounded-full border border-white/5 hover:border-white/20 mt-2"
                >
                  ENTER EXHIBITION →
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* TOP EDITORIAL HEADER BAR                                 */}
      {/* ======================================================== */}
      <header 
        className="relative z-30 w-full flex items-center justify-between px-5 sm:px-8 md:px-12 py-5 md:py-7 border-b border-white/[0.07] bg-[#071410]/60 backdrop-blur-md shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT: Project Title, Subtitle, & Panel Counter */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="text-base sm:text-lg md:text-xl font-display font-bold tracking-tight text-[#F7F4ED]">
              {project.title}
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#176B55]" />
            <span className="hidden sm:inline-block text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-[#BCE8D5]">
              {project.category || project.meta}
            </span>
          </div>
          <div className="text-[10px] sm:text-xs font-mono font-medium tracking-[0.2em] text-[#BCE8D5]/80 mt-0.5">
            PANEL {(activeIndex + 1).toString().padStart(2, "0")} {" // "} {itemCount.toString().padStart(2, "0")}
          </div>
        </div>

        {/* CENTER: Project Switchers (Prev / Next Dossier Item) */}
        {onSelectProject && prevProject && nextProject && (
          <div className="hidden lg:flex items-center gap-6 text-xs font-mono font-semibold tracking-[0.2em] uppercase">
            <button
              onClick={() => onSelectProject(prevProject)}
              className="group flex items-center gap-1.5 text-white/60 hover:text-[#FFCFB8] transition-colors py-1.5 px-3 rounded-md hover:bg-white/5"
              title={`Switch to ${prevProject.title}`}
            >
              <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              {prevProject.title}
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => onSelectProject(nextProject)}
              className="group flex items-center gap-1.5 text-white/60 hover:text-[#FFCFB8] transition-colors py-1.5 px-3 rounded-md hover:bg-white/5"
              title={`Switch to ${nextProject.title}`}
            >
              {nextProject.title}
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}

        {/* RIGHT: Audio & Close Button */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Unmute media" : "Mute media"}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 hover:border-white/30 text-white/80 hover:text-[#FFCFB8] transition-all hover:bg-white/5"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#BCE8D5]" />}
          </button>

          <button
            onClick={handleClose}
            className="group flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-full border border-white/15 hover:border-[#FFCFB8]/60 bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-mono font-semibold tracking-[0.2em] uppercase text-[#F7F4ED] hover:text-[#FFCFB8] transition-all focus:outline-none focus:ring-2 focus:ring-[#176B55]"
            aria-label="Back to Projects"
          >
            <span className="hidden sm:inline">BACK TO ARCHIVE</span>
            <span className="sm:hidden">BACK</span>
            <X className="w-4 h-4 transition-transform group-hover:rotate-90 text-[#BCE8D5] group-hover:text-[#FFCFB8]" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* CENTER STAGE: THE CINEMATIC 3D PERSPECTIVE CYLINDER      */}
      {/* ======================================================== */}
      <div 
        className="relative w-full flex-1 flex items-center justify-center overflow-hidden touch-none"
        style={{
          perspective: `${dimensions.perspective}px`,
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Rotating 3D Cylindrical Container (Horizontal or Vertical Rotunda) */}
        <div
          className="relative w-0 h-0 will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: isVertical
              ? `translate3d(0, 0, ${cameraZ}px) rotateX(${currentAngle}deg)`
              : `translate3d(0, 0, ${cameraZ}px) rotateY(${currentAngle}deg)`,
            transition: phase === "entering" ? "none" : undefined,
          }}
        >
          {mediaItems.map((item, index) => {
            const theta = index * stepAngle;
            const offsetAngle = ((theta + currentAngle) % 360 + 540) % 360 - 180;
            const absOffset = Math.abs(offsetAngle);
            const isActive = index === activeIndex;

            // Active central panel is 100% sharp; preview panels have subtle, intentional depth blur
            const blurPx = absOffset < 12 
              ? 0 
              : isVertical
                ? Math.min(3.5, (absOffset - 10) * 0.07)
                : Math.min(4.5, (absOffset - 10) * 0.08);

            // Preview panels remain recognizable while subtly attenuated in distance
            const opacity = absOffset < 15
              ? 1
              : isVertical
                ? Math.max(0.60, 1 - absOffset / 140)
                : Math.max(0.35, 1 - absOffset / 110);

            // Active panel pops; preview panels have slightly reduced brightness
            const brightness = absOffset < 15
              ? 1.02
              : isVertical
                ? Math.max(0.72, 1 - (absOffset - 10) * 0.006)
                : Math.max(0.65, 1 - absOffset * 0.005);

            if (absOffset > 95) {
              return null;
            }

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasDraggedSignificantlyRef.current) return;
                  if (isActive) {
                    setLightboxItem(item);
                  } else {
                    rotateToIndex(index);
                  }
                }}
                className={`absolute will-change-transform rounded-2xl md:rounded-3xl overflow-hidden border transition-shadow duration-300 ${
                  isActive 
                    ? "border-[#BCE8D5]/50 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(23,107,85,0.32)] cursor-pointer" 
                    : "border-white/10 hover:border-white/30 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.7)] cursor-pointer"
                }`}
                style={{
                  width: `${dimensions.panelWidth}px`,
                  height: `${dimensions.panelHeight}px`,
                  left: `-${dimensions.panelWidth / 2}px`,
                  top: `-${dimensions.panelHeight / 2}px`,
                  transformStyle: "preserve-3d",
                  transform: isVertical
                    ? `rotateX(${theta}deg) translateZ(-${dimensions.radius}px)`
                    : `rotateY(${theta}deg) translateZ(-${dimensions.radius}px)`,
                  filter: `blur(${blurPx}px) brightness(${brightness})`,
                  opacity: opacity,
                  zIndex: Math.round(50 - absOffset),
                  background: "linear-gradient(145deg, rgba(16, 45, 37, 0.95) 0%, rgba(10, 24, 19, 0.98) 100%)",
                }}
              >
                {/* Internal Panel Chrome */}
                <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
                  
                  {/* Top Panel Glass Header */}
                  <div className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 bg-black/40 backdrop-blur-md border-b border-white/[0.08] z-20 shrink-0">
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.2em] text-[#BCE8D5] uppercase bg-[#176B55]/50 px-2 py-0.5 rounded border border-[#BCE8D5]/30">
                          {item.badge}
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-medium text-white/50 tracking-wider">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxItem(item);
                      }}
                      className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-semibold tracking-wider text-white/70 hover:text-[#FFCFB8] transition-colors p-1"
                      title="Expand panel in fullscreen"
                    >
                      <span className="hidden sm:inline">INSPECT</span>
                      <Maximize2 className="w-3.5 h-3.5 text-[#BCE8D5]" />
                    </button>
                  </div>

                  {/* Media Container */}
                  <div className="relative w-full flex-1 min-h-0 bg-[#050D0A] overflow-hidden flex items-center justify-center p-1.5 sm:p-2.5">
                    {item.type === "video" ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <video
                          ref={(el) => { videoRefs.current[item.id] = el; }}
                          src={item.src}
                          poster={item.poster}
                          playsInline
                          muted={isMuted}
                          loop
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlayPause(item.id);
                            }}
                            className="w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                            aria-label="Toggle Play Pause"
                          >
                            {isPlayingMap[item.id] ? (
                              <Pause className="w-3.5 h-3.5 text-[#BCE8D5]" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          sizes={isVertical ? "(max-width: 768px) 95vw, 1400px" : "(max-width: 768px) 80vw, 500px"}
                          priority={index === 0}
                          className="object-contain"
                        />
                      </div>
                    )}

                    <div 
                      className="absolute inset-0 pointer-events-none opacity-25"
                      style={{
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 55%)",
                      }}
                    />
                  </div>

                  {/* Bottom Metadata Bar */}
                  <div className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-black/60 backdrop-blur-md border-t border-white/[0.08] z-20 shrink-0 flex items-center justify-between">
                    <div className="flex flex-col overflow-hidden mr-3">
                      <span className="text-xs sm:text-sm font-display font-semibold text-[#F7F4ED] truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] sm:text-xs font-body text-[#BCE8D5]/80 line-clamp-1 font-light">
                        {item.caption}
                      </span>
                    </div>

                    {isActive && (
                      <span className="text-[9px] font-mono font-medium tracking-[0.2em] uppercase text-[#FFCFB8] shrink-0 hidden min-[400px]:inline-block">
                        CLICK TO INSPECT
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM NAVIGATION & STATUS CONTROLS                      */}
      {/* ======================================================== */}
      <footer 
        className="relative z-30 w-full flex flex-col md:flex-row items-center justify-between px-5 sm:px-8 md:px-12 py-4 md:py-6 border-t border-white/[0.07] bg-[#071410]/70 backdrop-blur-md shrink-0 gap-3 md:gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-display font-semibold text-[#F7F4ED]">
              {mediaItems[activeIndex]?.title || project.title}
            </span>
            <span className="text-[10px] sm:text-xs font-body text-[#BCE8D5]/70 max-w-sm sm:max-w-md line-clamp-1">
              {mediaItems[activeIndex]?.caption || project.tagline.replace("\n", " ")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono font-medium tracking-[0.25em] uppercase text-white/50">
          <span className="w-8 h-[1px] bg-white/20 hidden sm:inline-block" />
          <span className="flex items-center gap-2 text-[#BCE8D5]">
            <Compass className="w-3.5 h-3.5 text-[#FFCFB8] animate-spin" style={{ animationDuration: "12s" }} />
            {isVertical ? "SCROLL OR SWIPE VERTICALLY TO EXPLORE" : "SCROLL OR SWIPE TO ROTATE GALLERY"}
          </span>
          <span className="w-8 h-[1px] bg-white/20 hidden sm:inline-block" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {mediaItems.map((_, i) => (
            <button
              key={i}
              onClick={() => rotateToIndex(i)}
              aria-label={`Jump to panel ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === activeIndex
                  ? "w-6 sm:w-8 h-2 bg-[#BCE8D5] shadow-[0_0_12px_#BCE8D5]"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </footer>

      {/* ======================================================== */}
      {/* EXPANDED LIGHTBOX / FULLSCREEN INSPECTOR MODAL           */}
      {/* ======================================================== */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[150] flex flex-col items-center justify-between bg-black/95 backdrop-blur-2xl p-4 sm:p-8"
            onClick={() => setLightboxItem(null)}
          >
            <div 
              className="w-full flex items-center justify-between max-w-7xl z-20 shrink-0 pb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {lightboxItem.badge && (
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#BCE8D5] uppercase bg-[#176B55]/60 px-2 py-0.5 rounded">
                      {lightboxItem.badge}
                    </span>
                  )}
                  <span className="text-sm md:text-base font-display font-bold text-[#F7F4ED]">
                    {lightboxItem.title}
                  </span>
                </div>
                <span className="text-xs font-body text-[#BCE8D5]/80 mt-1">
                  {lightboxItem.caption}
                </span>
              </div>

              <button
                onClick={() => setLightboxItem(null)}
                className="flex items-center gap-2 py-2 px-4 rounded-full border border-white/20 hover:border-[#FFCFB8] text-xs font-mono font-semibold tracking-widest uppercase text-white hover:text-[#FFCFB8] transition-colors"
                aria-label="Close Preview"
              >
                <span>CLOSE PREVIEW</span>
                <X className="w-4 h-4 text-[#FFCFB8]" />
              </button>
            </div>

            <div 
              className="relative w-full flex-1 max-w-7xl min-h-0 flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItem.type === "video" ? (
                <video
                  src={lightboxItem.src}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <div className="relative w-full h-full max-w-6xl max-h-[82vh]">
                  <Image
                    src={lightboxItem.src}
                    alt={lightboxItem.title}
                    fill
                    priority
                    className="object-contain rounded-xl"
                  />
                </div>
              )}
            </div>

            <div 
              className="w-full max-w-7xl flex items-center justify-between text-xs font-mono text-white/50 pt-3"
              onClick={(e) => e.stopPropagation()}
            >
              <span>KELVOR ARCHIVE // HIGH-RESOLUTION INSPECTOR</span>
              <span className="hidden sm:inline">ESC OR CLICK OUTSIDE TO RETURN</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

export function ProjectGallery({ 
  project, 
  onClose,
  onSelectProject 
}: ProjectGalleryProps) {
  return (
    <AnimatePresence>
      {project && (
        <InnerGalleryModal
          key={project.internalId}
          project={project}
          onClose={onClose}
          onSelectProject={onSelectProject}
        />
      )}
    </AnimatePresence>
  );
}
