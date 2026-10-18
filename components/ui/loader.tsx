"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import gsap from "gsap";

export function Loader() {
  const [isRemoved, setIsRemoved] = useState(false);
  
  const progress = useMotionValue(0);
  const scaleX = useTransform(progress, (v) => v / 100);
  // Indicator icon position aligned with the current leading progress point (0% to 100%)
  const iconLeft = useTransform(progress, (v) => `${v}%`);
  // Natural organic wobbling motion along the loading bar:
  // Combines a primary wave and secondary harmonic, smoothly dampened to 0 at both endpoints (0% and 100%)
  const wobbleY = useTransform(progress, (v) => {
    if (v <= 0 || v >= 100) return 0;
    const p = v / 100;
    const envelope = Math.sin(p * Math.PI);
    const wave = Math.sin(p * Math.PI * 8.5) + Math.sin(p * Math.PI * 13.2) * 0.35;
    return (wave / 1.35) * 9.5 * envelope; // ~ -9.5px to +9.5px
  });

  const wobbleRotate = useTransform(progress, (v) => {
    if (v <= 0 || v >= 100) return 0;
    const p = v / 100;
    const envelope = Math.sin(p * Math.PI);
    const wave = Math.cos(p * Math.PI * 7.8) + Math.sin(p * Math.PI * 12.4) * 0.3;
    return (wave / 1.3) * 7.5 * envelope; // ~ -7.5deg to +7.5deg
  });

  // Brightness reveal: black overlay fades from 1 (pitch black at 0%) down to 0 (fully revealed at 100%)
  const overlayOpacity = useTransform(progress, [0, 100], [1, 0]);
  
  const shouldReduceMotion = useReducedMotion();
  const folderIconRef = useRef<HTMLDivElement>(null);
  const folderAnimRef = useRef<HTMLDivElement>(null);
  const folderImgRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const barLineRef = useRef<HTMLDivElement>(null);

  // Center folderAnimRef relative to its iconLeft anchor and lock non-shrinking transform origin
  useEffect(() => {
    if (folderAnimRef.current) {
      gsap.set(folderAnimRef.current, { xPercent: -50, yPercent: -50, scale: 1 });
    }
  }, []);

  // Scroll lock effect - active strictly during initial loading screen
  useEffect(() => {
    if (isRemoved) return;
    
    // Ensure viewport is at Hero (0, 0) before locking overflow
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } catch {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }

    // Store original
    const originalOverflow = document.body.style.overflow;
    // Lock
    document.body.style.overflow = "hidden";
    
    // Cleanup
    return () => {
      document.body.style.overflow = originalOverflow;
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } catch {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
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
          // If reduced motion is preferred, complete cleanly with no animation
          if (shouldReduceMotion) {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("kelvor-loader-removed"));
            }
            document.body.style.overflow = "";
            setIsRemoved(true);
            return;
          }

          const folderEl = folderAnimRef.current;
          if (!folderEl) {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("kelvor-loader-removed"));
            }
            document.body.style.overflow = "";
            setIsRemoved(true);
            return;
          }

          // 1. Measure the exact starting endpoint of the loading bar
          const iconRect = folderEl.getBoundingClientRect();
          const startX = iconRect.left + iconRect.width / 2;
          const startY = iconRect.top + iconRect.height / 2;
          const iconWidth = iconRect.width;
          const iconHeight = iconRect.height;

          // 2. Hand off directly and synchronously to HeroSection (Layer B, z-[5])
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("kelvor-start-folder-journey", {
                detail: { startX, startY, iconWidth, iconHeight },
              })
            );
          }

          // 3. Immediately hide loader icon in the same paint frame for a seamless handoff
          if (folderIconRef.current) {
            gsap.set(folderIconRef.current, { opacity: 0 });
          }

          // 4. Smoothly fade out loading bar line and HUD chrome
          const chromeElements = [barLineRef.current].filter(Boolean);
          if (chromeElements.length > 0) {
            gsap.to(chromeElements, {
              opacity: 0,
              duration: 0.28,
              ease: "power2.out",
              onComplete: () => {
                document.body.style.overflow = "";
                setIsRemoved(true);
              },
            });
          } else {
            document.body.style.overflow = "";
            setIsRemoved(true);
          }

          // 5. Trigger hero letter convergence in synchrony with the cinematic fall
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("kelvor-loader-removed"));
          }
        }
      });
    };

    checkReady();

    // Clean up animation on unmount
    return () => {
      isFinished = true;
      activeAnimation.stop();
    };
  }, [progress, shouldReduceMotion]);

  if (isRemoved) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto overflow-hidden"
    >
      {/* Deep Forest Dimming Overlay for Cinematic Brightness Reveal */}
      <motion.div 
        className="absolute inset-0 bg-[#062D25] pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* Center Display: Horizontal Loading Bar with Moving Indicator Icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 overflow-visible">
        <div className="relative w-[min(88vw,405px)] sm:w-[min(80vw,635px)] md:w-[min(54vw,815px)]">
          {/* Moving Indicator Icon directly on the horizontal centerline of the loading bar */}
          <motion.div
            ref={folderIconRef}
            className="absolute top-1/2 pointer-events-none z-20 flex items-center justify-center"
            style={{ left: iconLeft }}
          >
            {/* GSAP Trajectory, Enlargement & Merge Container: Strict Non-Shrinking Dimensions */}
            <div
              ref={folderAnimRef}
              className="w-[72px] h-[48px] sm:w-[102px] sm:h-[68px] md:w-[138px] md:h-[92px] shrink-0 relative flex items-center justify-center"
              style={{ transformOrigin: "center center", willChange: "transform" }}
            >
              {/* Organic Mint & Jade Glow Aura */}
              <div
                ref={auraRef}
                className="absolute inset-0 rounded-full pointer-events-none opacity-0"
                style={{
                  background:
                    "radial-gradient(circle at 48% 45%, rgba(205, 235, 221, 0.90) 0%, rgba(119, 203, 165, 0.50) 48%, rgba(8, 107, 85, 0.22) 72%, transparent 78%)",
                  filter: "blur(6px)",
                }}
              />

              {/* Nested layer for natural organic wobbling: vertical wave & alternating rotation */}
              <motion.div
                style={{
                  y: shouldReduceMotion ? 0 : wobbleY,
                  rotate: shouldReduceMotion ? 0 : wobbleRotate,
                }}
                className="w-full h-full shrink-0 flex items-center justify-center"
              >
                {/* Dissolving Folder Image */}
                <div ref={folderImgRef} className="w-full h-full shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/Glossy Mint Glass Folder Icon.png"
                    alt="Loading"
                    width={1536}
                    height={1024}
                    unoptimized
                    priority
                    className="w-full h-full object-contain shrink-0 drop-shadow-[0_6px_20px_rgba(8,107,85,0.35)]"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Horizontal Loading Bar */}
          <div ref={barLineRef} className="w-full h-[2.85px] sm:h-[3.45px] bg-[rgba(247,245,237,0.18)] rounded-full overflow-hidden relative transition-opacity">
            <motion.div 
              className="h-full w-full bg-gradient-to-r from-[#086B55] via-[#77CBA5] to-[#CDEBDD] rounded-full origin-left"
              style={{ scaleX, transformOrigin: "left" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
