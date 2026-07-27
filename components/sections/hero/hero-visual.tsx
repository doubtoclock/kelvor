"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function HeroVisual() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "center" }}
      >
        <Image 
          src="/images/hero.png" 
          alt="Abstract glass and light waves" 
          fill
          className="object-cover object-[60%_center] md:object-[75%_center] lg:object-right opacity-90"
          priority
          sizes="100vw"
          quality={90}
        />
        {/* Dark overlay to ensure white text is highly readable */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent md:w-3/4" />
      </motion.div>
    </div>
  );
}
