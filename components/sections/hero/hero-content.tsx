"use client";

import { motion, useReducedMotion } from "framer-motion";

export function HeroContent() {
  const shouldReduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="hero-fade-group w-full flex flex-col items-start">
      {/* Eyebrow */}
      <motion.div 
        className="mb-10 md:mb-12 text-[10px] md:text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease, delay: 0.2 }}
      >
        DIGITAL PRODUCT STUDIO / INDIA
      </motion.div>

      {/* Headline */}
      <h1 className="mb-8 md:mb-10 text-5xl md:text-[64px] lg:text-[76px] xl:text-[84px] font-normal leading-[1.05] md:leading-[0.94] tracking-tight text-foreground">
        
        {/* Mobile Layout (unchanged visually) */}
        <motion.span 
          className="block md:hidden whitespace-pre-line"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
        >
          We build digital{"\n"}products worth{"\n"}remembering.
        </motion.span>
        
        {/* Desktop Layout - 2 Lines Reveal */}
        <span className="hidden md:flex flex-col whitespace-nowrap">
          <span className="overflow-hidden pt-2 pb-4 -mt-2 -mb-4">
            <motion.span 
              className="block"
              initial={{ y: shouldReduceMotion ? 0 : "120%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4, ease, delay: 0.3 }}
            >
              We build digital
            </motion.span>
          </span>
          <span className="overflow-hidden pt-2 pb-4 -mt-2 -mb-4">
            <motion.span 
              className="block"
              initial={{ y: shouldReduceMotion ? 0 : "120%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4, ease, delay: 0.4 }}
            >
              products worth remembering.
            </motion.span>
          </span>
        </span>
      </h1>

      {/* Supporting Copy */}
      <motion.p 
        className="mb-12 md:mb-14 text-sm md:text-base text-muted-foreground leading-relaxed max-w-[340px]"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease, delay: 0.6 }}
      >
        Strategy, design and engineering —{"\n"}from first idea to shipped product.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease, delay: 0.75 }}
      >
        <a 
          href="#work" 
          className="inline-flex items-center gap-3 text-[10px] md:text-xs font-semibold tracking-[0.15em] text-foreground uppercase border-b border-foreground pb-2 transition-colors group hover:opacity-80"
        >
          EXPLORE OUR WORK
          <svg 
            width="10" 
            height="10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            <path d="M7 17l9.2-9.2M17 16.5V7H7.5" />
          </svg>
        </a>
      </motion.div>
    </div>
  );
}
