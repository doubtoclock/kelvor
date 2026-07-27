import { forwardRef } from "react";
import { motion } from "framer-motion";

export const MedioScene = forwardRef<HTMLDivElement>((props, ref) => {
  const customEase = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div 
      ref={ref} 
      className="absolute inset-0 w-full h-full flex items-center justify-between px-6 lg:px-24 z-10"
    >
      
      {/* LEFT: Empty space for shared phone */}
      {/* Handled by global work-stage layout */}

      {/* RIGHT: Typography */}
      <motion.div 
        className="absolute top-0 left-0 max-md:w-full md:right-[6vw] lg:right-[8vw] md:left-auto md:top-1/2 md:-translate-y-1/2 md:w-[40vw] flex flex-col items-start justify-start pt-[100px] md:pt-0 px-6 md:px-0 h-[340px] md:h-auto z-30"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: customEase, delay: 0.1 } }}
        exit={{ opacity: 0, y: -40, transition: { duration: 0.6, ease: customEase, delay: 0 } }}
      >
        <h2 className="text-[3.5rem] md:text-7xl lg:text-[10rem] leading-none font-bold tracking-[-0.04em] text-foreground mb-4 md:mb-12">
          MEDIO
        </h2>
        
        <p className="text-xl md:text-3xl lg:text-4xl text-muted-foreground mb-8 md:mb-[60px] leading-snug font-light">
          Meet somewhere<br />in the middle.
        </p>

        <div className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-foreground/60 uppercase">
          PRODUCT DESIGN · DEVELOPMENT · 2026
        </div>
      </motion.div>

    </motion.div>
  );
});
MedioScene.displayName = "MedioScene";
