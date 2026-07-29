"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";

export function Loader() {
  const [isRemoved, setIsRemoved] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [progressText, setProgressText] = useState("000");
  
  const progress = useMotionValue(0);
  const scaleX = useTransform(progress, (v) => v / 100);
  
  // Letter spacing goes from 3em down to -0.02em (or 0em). 
  // We apply negative right margin to counteract the extra space on the last letter to ensure perfect centering.
  const spacingValue = useTransform(progress, [0, 100], [3, 0]);
  const letterSpacing = useTransform(spacingValue, (v) => `${v}em`);
  const marginRight = useTransform(spacingValue, (v) => `-${v}em`);
  
  const shouldReduceMotion = useReducedMotion();

  // Scroll lock effect
  useEffect(() => {
    if (isRemoved) return;
    
    // Store original
    const originalOverflow = document.body.style.overflow;
    // Lock
    document.body.style.overflow = "hidden";
    
    // Cleanup
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isRemoved]);

  // Loading Logic
  useEffect(() => {
    let isFinished = false;
    
    // Start an initial slow animation up to 88% over 1300ms
    let activeAnimation = animate(progress, 88, { 
      duration: 1.3, 
      ease: "linear",
      onComplete: () => {
        if (!isFinished) {
          // If assets are STILL loading after 1300ms, creep up to 94%
          activeAnimation = animate(progress, 94, { duration: 2.2, ease: "easeOut" });
        }
      }
    });

    const checkReady = async () => {
      // 1. Wait for document to be fully loaded
      const pageLoadPromise = new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve(true);
        } else {
          window.addEventListener("load", resolve, { once: true });
        }
      });

      // 2. Wait for fonts
      const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();

      // 3. Minimum presentation duration of 1300ms
      const minDurationPromise = new Promise(resolve => setTimeout(resolve, 1300));

      // 4. Fallback timeout in case something hangs
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3500));

      // Wait for either the assets (and minimum time) OR the fallback timeout
      await Promise.race([
        Promise.all([pageLoadPromise, fontsPromise, minDurationPromise]),
        timeoutPromise
      ]);

      isFinished = true;
      activeAnimation.stop();
      
      // Animate smoothly to 100% over ~400ms (total min duration ~1700ms)
      animate(progress, 100, {
        duration: 0.4,
        ease: "circOut",
        onComplete: () => {
          // Hold for 150ms at 100% before pulling the curtain up
          setTimeout(() => setIsExited(true), 150);
        }
      });
    };

    checkReady();

    // Clean up animation on unmount
    return () => {
      isFinished = true;
      activeAnimation.stop();
    };
  }, [progress]);

  // Update text value manually to avoid frequent React renders if possible,
  // but framer motion's useMotionValueEvent or a simple useEffect is fine.
  useEffect(() => {
    return progress.on("change", (latest) => {
      const rounded = Math.round(latest);
      // Format as 000, 045, 100
      setProgressText(rounded.toString().padStart(3, '0'));
    });
  }, [progress]);

  if (isRemoved) return null;

  return (
    <motion.div
      initial={false}
      animate={
        isExited
          ? shouldReduceMotion
            ? { opacity: 0 }
            : { y: "-100%" }
          : { y: "0%", opacity: 1 }
      }
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (isExited) setIsRemoved(true);
      }}
      className="fixed inset-0 z-[9999] bg-[#070709] text-[#F5F5F5] flex flex-col justify-between p-6 md:p-8 overflow-hidden pointer-events-auto"
    >
      {/* Top Header */}
      <div className="flex justify-between items-start w-full relative z-10">
        <div className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
          KELVOR&reg; / SYSTEM 001
        </div>
        <div className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase text-right">
          INITIALIZING DIGITAL SYSTEM
        </div>
      </div>

      {/* Center Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[10px] sm:text-xs font-mono tracking-widest text-muted-foreground mb-6 tabular-nums">
          {progressText}%
        </div>
        <div className="overflow-hidden">
          <motion.h1 
            className="text-[clamp(3rem,12vw,9rem)] font-bold text-foreground leading-none uppercase tracking-normal"
            style={{ 
              letterSpacing,
              marginRight
            }}
          >
            KELVOR
          </motion.h1>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="w-full relative z-10">
        {/* Progress Line */}
        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden mb-3">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-white origin-left"
            style={{ scaleX }}
          />
        </div>
        
        <div className="w-full flex justify-between items-end">
          <div className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            LOADING
          </div>
          <div className="text-[9px] sm:text-[10px] font-mono tracking-widest text-muted-foreground tabular-nums">
            {progressText}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}
