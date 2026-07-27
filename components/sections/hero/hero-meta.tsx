"use client";

import { motion, useReducedMotion } from "framer-motion";

export function HeroMeta() {
  const shouldReduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="hero-fade-group flex flex-col md:flex-row md:items-end justify-between w-[calc(100vw-3rem)] lg:w-[calc(100vw-6rem)] max-w-full text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase gap-6 pb-2 md:pb-0">
      {/* Left Metadata Removed as per request */}
      <div />

      {/* Right Metadata */}
      <motion.div 
        className="flex items-center gap-4 group cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease, delay: 0.9 }}
      >
        <span>SCROLL TO EXPLORE</span>
        <svg 
          width="12" 
          height="40" 
          viewBox="0 0 12 40" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="transition-transform group-hover:translate-y-1"
        >
          <path d="M6 0v39M2 35l4 4 4-4" />
        </svg>
      </motion.div>
    </div>
  );
}
