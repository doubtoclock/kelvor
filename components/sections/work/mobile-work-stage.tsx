"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, MotionValue, useTransform, useReducedMotion, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PhoneDevice } from "./devices/phone-device";
import { TabletDevice } from "./devices/tablet-device";
import { MacbookDevice } from "./devices/macbook-device";
import { PROJECTS, ProjectData } from "@/lib/constants/work-data";

interface MobileWorkStageProps {
  onOpenGallery: (p: ProjectData) => void;
  mobileProgress: MotionValue<number>;
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const linear = (t: number) => t;

export function MobileWorkStage({ onOpenGallery, mobileProgress }: MobileWorkStageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // State to conditionally unmount elements outside their active ranges
  const [visibility, setVisibility] = useState({
    medioText: true,
    cafeText: false,
    boostText: false,
    medioScreen: true,
    cafeScreen: false,
    tablet: false,
    macbook: false,
  });

  // Switch counter based on visual dominance and track visibility thresholds
  useMotionValueEvent(mobileProgress, "change", (latest) => {
    // 1. Update Counter
    if (latest < 0.30) {
      if (activeProjectIndex !== 0) setActiveProjectIndex(0);
    } else if (latest >= 0.30 && latest < 0.70) {
      if (activeProjectIndex !== 1) setActiveProjectIndex(1);
    } else if (latest >= 0.70) {
      if (activeProjectIndex !== 2) setActiveProjectIndex(2);
    }

    // 2. Update Conditional Unmounting
    setVisibility((prev) => {
      // Text boundaries guarantee absolutely zero overlap
      const medioText = latest < 0.25;
      const cafeText = latest > 0.25 && latest < 0.65;
      const boostText = latest > 0.65;

      // Visual boundaries (extended slightly beyond transition zones to be safe)
      const medioScreen = latest < 0.35;
      const cafeScreen = latest > 0.20 && latest < 0.75;
      const tablet = latest > 0.20 && latest < 0.75;
      const macbook = latest > 0.65;

      if (
        prev.medioText !== medioText ||
        prev.cafeText !== cafeText ||
        prev.boostText !== boostText ||
        prev.medioScreen !== medioScreen ||
        prev.cafeScreen !== cafeScreen ||
        prev.tablet !== tablet ||
        prev.macbook !== macbook
      ) {
        return { medioText, cafeText, boostText, medioScreen, cafeScreen, tablet, macbook };
      }
      return prev;
    });
  });

  const medioData = PROJECTS.find(p => p.internalId === "medio")!;
  const cafeData = PROJECTS.find(p => p.internalId === "cafemitra")!;
  const boostData = PROJECTS.find(p => p.internalId === "boostai")!;

  // ----------------------------------------------------
  // TEXT ANIMATIONS
  // ----------------------------------------------------
  
  // Medio Text (Hold 0.00-0.18 -> Exit by 0.24)
  const medioTextOpacity = useTransform(mobileProgress, [0, 0.05, 0.18, 0.24], [0, 1, 1, 0]);
  const medioTextY = useTransform(mobileProgress, [0, 0.05, 0.18, 0.24], [16, 0, 0, -16]);

  // CafeMitra Text (Enter 0.30-0.34 -> Hold 0.34-0.58 -> Exit by 0.64)
  const cafeTextOpacity = useTransform(mobileProgress, [0.24, 0.30, 0.34, 0.58, 0.64], [0, 0, 1, 1, 0]);
  const cafeTextY = useTransform(mobileProgress, [0.24, 0.30, 0.34, 0.58, 0.64], [16, 16, 0, 0, -16]);

  // Boost AI Text (Enter 0.70-0.76 -> Hold)
  const boostTextOpacity = useTransform(mobileProgress, [0.64, 0.70, 0.76, 1.0], [0, 0, 1, 1]);
  const boostTextY = useTransform(mobileProgress, [0.64, 0.70, 0.76, 1.0], [16, 16, 0, 0]);

  // ----------------------------------------------------
  // DEVICE ANIMATIONS
  // ----------------------------------------------------
  
  // Phone Wrapper (Medio 0.00-0.18 -> CafeMitra 0.34-0.64 -> Exit by 0.70)
  const phoneRanges = [0, 0.05, 0.18, 0.34, 0.64, 0.70];
  const phoneEasing = [linear, easeInOut, easeInOut, easeInOut, linear];
  
  const phoneOpacity = useTransform(mobileProgress, phoneRanges, [0, 1, 1, 1, 1, 0], { ease: phoneEasing });
  const phoneX = useTransform(mobileProgress, phoneRanges, [0, 0, 0, -45, -45, -45], { ease: phoneEasing });
  const phoneY = useTransform(mobileProgress, phoneRanges, [50, 0, 0, 60, 60, 0], { ease: phoneEasing });
  const phoneScale = useTransform(mobileProgress, phoneRanges, [0.96, 1, 1, 0.85, 0.85, 0.80], { ease: phoneEasing });

  // Phone Screen Crossfade (0.24 to 0.30)
  const medioScreenOpacity = useTransform(mobileProgress, [0.24, 0.30], [1, 0]);
  const cafeScreenOpacity = useTransform(mobileProgress, [0.24, 0.30], [0, 1]);

  // Tablet Reveal (CafeMitra POS) (0.24 to 0.34 -> Hold 0.34-0.64 -> Exit by 0.70)
  const tabletRanges = [0.24, 0.34, 0.64, 0.70];
  const tabletOpacity = useTransform(mobileProgress, tabletRanges, [0, 1, 1, 0]);
  const tabletX = useTransform(mobileProgress, tabletRanges, [0, 45, 45, 45]);
  const tabletY = useTransform(mobileProgress, tabletRanges, [20, -10, -10, 20]);
  const tabletScale = useTransform(mobileProgress, tabletRanges, [0.96, 1, 1, 0.94]);

  // Macbook (Boost AI) (Enter 0.70 to 0.76)
  const macbookRanges = [0.70, 0.76];
  const macbookOpacity = useTransform(mobileProgress, macbookRanges, [0, 1]);
  const macbookY = useTransform(mobileProgress, macbookRanges, [40, 0]);
  const macbookScale = useTransform(mobileProgress, macbookRanges, [0.96, 1]);

  // Helper for applying reduced motion
  const safeY = (val: MotionValue<number>) => shouldReduceMotion ? 0 : val;
  const safeScale = (val: MotionValue<number>) => shouldReduceMotion ? 1 : val;

  // ----------------------------------------------------
  // POINTER EVENTS & INTERACTIVITY
  // ----------------------------------------------------
  
  // Only the strongly visible CTA receives pointer events
  const medioPointer = useTransform(medioTextOpacity, (v) => v > 0.1 ? "auto" : "none");
  const cafePointer = useTransform(cafeTextOpacity, (v) => v > 0.1 ? "auto" : "none");
  const boostPointer = useTransform(boostTextOpacity, (v) => v > 0.1 ? "auto" : "none");

  // Reusable CTA component
  const ProjectCTA = ({ project }: { project: ProjectData }) => (
    <button
      onClick={() => onOpenGallery(project)}
      className="group inline-flex items-center gap-3 py-3 text-base font-medium text-white/90 hover:text-white border-b border-white/30 hover:border-white transition-colors duration-300 cursor-pointer min-h-[44px]"
    >
      VIEW PROJECT
      <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
    </button>
  );

  return (
    <div className="sticky top-0 w-full h-[100svh] overflow-hidden bg-background">
      
      {/* PERSISTENT TOP HEADER */}
      <div className="absolute top-6 left-6 z-50 pointer-events-none flex flex-col gap-1">
        <h2 className="text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase leading-none">
          SELECTED WORK
        </h2>
        <div className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/50 uppercase leading-none mt-0.5 flex items-center">
          <div className="relative overflow-hidden h-[1.2em] w-[1.6em] inline-block mr-1">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={activeProjectIndex}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 block"
              >
                0{activeProjectIndex + 1}
              </motion.span>
            </AnimatePresence>
          </div>
          <span>&mdash; 03</span>
        </div>
        <div className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/50 uppercase leading-none mt-1">
          DIGITAL PRODUCTS
        </div>
      </div>

      {/* TEXT CONTAINERS */}
      <div className="absolute top-[110px] left-0 w-full px-6 z-40">
        
        {/* MEDIO TEXT */}
        {visibility.medioText && (
          <motion.div 
            style={{ opacity: medioTextOpacity, y: safeY(medioTextY), pointerEvents: medioPointer as any }}
            className="absolute top-0 left-0 w-full px-6 flex flex-col items-start"
          >
            <div className="flex flex-col items-start">
              <h3 className="text-[clamp(2.5rem,10vw,3.5rem)] leading-none font-bold tracking-[-0.04em] text-foreground mb-4">
                {medioData.title}
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-snug font-light whitespace-pre-line max-w-[280px]">
                {medioData.tagline}
              </p>
              <div className="text-[9px] font-semibold tracking-[0.3em] text-foreground/60 uppercase leading-relaxed mb-6">
                {medioData.meta}
              </div>
              <ProjectCTA project={medioData} />
            </div>
          </motion.div>
        )}

        {/* CAFEMITRA TEXT */}
        {visibility.cafeText && (
          <motion.div 
            style={{ opacity: cafeTextOpacity, y: safeY(cafeTextY), pointerEvents: cafePointer as any }}
            className="absolute top-0 left-0 w-full px-6 flex flex-col items-start"
          >
            <div className="flex flex-col items-start">
              <h3 className="text-[clamp(2.5rem,10vw,3.5rem)] leading-none font-bold tracking-[-0.04em] text-foreground mb-4 whitespace-nowrap">
                {cafeData.title}
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-snug font-light whitespace-pre-line max-w-[280px]">
                {cafeData.tagline}
              </p>
              <div className="text-[9px] font-semibold tracking-[0.3em] text-foreground/60 uppercase leading-relaxed mb-6">
                {cafeData.meta}
              </div>
              <ProjectCTA project={cafeData} />
            </div>
          </motion.div>
        )}

        {/* BOOST AI TEXT */}
        {visibility.boostText && (
          <motion.div 
            style={{ opacity: boostTextOpacity, y: safeY(boostTextY), pointerEvents: boostPointer as any }}
            className="absolute top-0 left-0 w-full px-6 flex flex-col items-start"
          >
            <div className="flex flex-col items-start">
              <h3 className="text-[clamp(2.5rem,10vw,3.5rem)] leading-none font-bold tracking-[-0.04em] text-foreground mb-4">
                {boostData.title}
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-snug font-light whitespace-pre-line max-w-[280px]">
                {boostData.tagline}
              </p>
              <div className="text-[9px] font-semibold tracking-[0.3em] text-foreground/60 uppercase leading-relaxed mb-6">
                {boostData.meta}
              </div>
              <ProjectCTA project={boostData} />
            </div>
          </motion.div>
        )}
      </div>

      {/* VISUALS CONTAINERS */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        
        {/* TABLET DEVICE (CAFEMITRA POS) - Renders behind phone */}
        {visibility.tablet && (
          <div className="absolute top-[46svh] left-1/2 -translate-x-1/2 z-10 flex justify-center">
            <motion.div
              style={{ opacity: tabletOpacity, x: tabletX, y: safeY(tabletY), scale: safeScale(tabletScale) }}
              className="origin-top"
            >
              <TabletDevice>
                <div className="absolute inset-0 w-full h-full origin-center">
                  <Image 
                    src="/projects/cafemitra/cafe-erp.png"
                    alt="CafeMitra Admin ERP"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </TabletDevice>
            </motion.div>
          </div>
        )}

        {/* PERSISTENT PHONE DEVICE (MEDIO -> CAFEMITRA) */}
        {(visibility.medioScreen || visibility.cafeScreen) && (
          <div className="absolute top-[42svh] left-1/2 -translate-x-1/2 z-20 flex justify-center">
            <motion.div
              style={{ opacity: phoneOpacity, x: phoneX, y: safeY(phoneY), scale: safeScale(phoneScale) }}
              className="origin-top shadow-2xl"
            >
              <PhoneDevice>
                {/* Medio Screen */}
                {visibility.medioScreen && (
                  <motion.div
                    style={{ opacity: medioScreenOpacity }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image 
                      src="/projects/medio/medio.png"
                      alt="Medio Mobile App"
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                )}
                
                {/* CafeMitra Screen */}
                {visibility.cafeScreen && (
                  <motion.div
                    style={{ opacity: cafeScreenOpacity }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image 
                      src="/projects/cafemitra/cafemitra-consumer-app.png"
                      alt="CafeMitra Consumer App"
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                )}
              </PhoneDevice>
            </motion.div>
          </div>
        )}

        {/* MACBOOK DEVICE (BOOST AI) */}
        {visibility.macbook && (
          <div className="absolute top-[54svh] left-1/2 -translate-x-1/2 z-30 flex justify-center">
            <motion.div
              style={{ opacity: macbookOpacity, y: safeY(macbookY), scale: safeScale(macbookScale) }}
              className="origin-top"
            >
              <MacbookDevice>
                <div className="absolute inset-0 w-full h-full origin-center">
                  <Image 
                    src="/projects/boostai/boostai.webp"
                    alt="Boost AI Application"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </MacbookDevice>
            </motion.div>
          </div>
        )}
        
      </div>
      
    </div>
  );
}
