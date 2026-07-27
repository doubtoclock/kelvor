import { forwardRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TabletDevice } from "../devices/tablet-device";

export const CafeMitraScene = forwardRef<HTMLDivElement>((props, ref) => {
  const customEase = [0.22, 1, 0.36, 1];

  return (
    <motion.div 
      ref={ref} 
      className="absolute inset-0 w-full h-full flex items-center justify-between px-6 lg:px-24 z-10"
    >
      
      {/* LEFT: Typography */}
      <motion.div 
        className="absolute top-0 left-0 max-md:w-full md:left-[6vw] lg:left-[8vw] md:top-1/2 md:-translate-y-[45%] md:w-[40vw] flex flex-col items-start justify-start pt-[100px] md:pt-0 px-6 md:px-0 h-[340px] md:h-auto z-30"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: customEase, delay: 0.1 } }}
        exit={{ opacity: 0, y: -40, transition: { duration: 0.6, ease: customEase, delay: 0 } }}
      >
        <h2 className="text-[2.5rem] md:text-7xl lg:text-[6rem] xl:text-[7rem] leading-none font-bold tracking-[-0.04em] text-foreground mb-4 md:mb-12 whitespace-nowrap">
          CAFEMITRA
        </h2>
        
        <p className="text-xl md:text-3xl lg:text-4xl text-muted-foreground mb-8 md:mb-[60px] leading-snug font-light max-w-lg">
          One system.<br />Two sides of the counter.
        </p>

        <div className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-foreground/60 uppercase">
          PRODUCT DESIGN · FULL-STACK DEVELOPMENT · 2026
        </div>
      </motion.div>

      {/* RIGHT: Devices layered */}
      <div className="absolute top-[340px] bottom-0 left-0 right-0 md:right-[4vw] md:left-auto md:bottom-auto md:top-1/2 md:-translate-y-[35%] md:w-[52vw] md:max-w-[850px] md:h-[60vh] max-md:flex max-md:items-center max-md:justify-center pointer-events-none z-10 max-md:overflow-hidden">
        
        {/* Tablet Device (Back) */}
        <motion.div 
          className="relative max-md:z-10 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 shadow-2xl origin-center"
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.8, ease: customEase, delay: 0.1 } }}
          exit={{ y: -70, opacity: 0, transition: { duration: 0.6, ease: customEase, delay: 0 } }}
        >
          <div className="scale-[0.75] md:scale-[0.8] lg:scale-[0.9] xl:scale-[1] origin-center md:origin-right max-md:translate-x-[15%] max-md:-translate-y-[5%]">
            <TabletDevice>
              <Image 
                src="/projects/cafemitra/cafe-erp.png"
                alt="CafeMitra Admin ERP"
                fill
                className="object-cover"
                priority
              />
            </TabletDevice>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
});
CafeMitraScene.displayName = "CafeMitraScene";
