import { forwardRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MacbookDevice } from "../devices/macbook-device";

export const BoostAIScene = forwardRef<HTMLDivElement>((props, ref) => {
  const customEase = [0.22, 1, 0.36, 1];

  const itemVariants = {
    enter: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: customEase } },
    exit: { opacity: 0, y: -40, transition: { duration: 0.6, ease: customEase } }
  };

  const containerVariants = {
    enter: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.55 } },
    exit: { transition: { staggerChildren: 0.05, staggerDirection: -1, delayChildren: 0 } }
  };

  return (
    <motion.div 
      ref={ref} 
      className="absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-0 z-10"
    >
      
      {/* LEFT: Typography (38-40% Territory) */}
      <motion.div 
        className="absolute md:relative top-0 left-0 w-full lg:w-[40vw] flex flex-col items-start justify-start lg:justify-center pt-[100px] lg:pt-0 px-6 lg:px-0 lg:pl-[8vw] xl:pl-[10vw] h-[340px] md:h-full z-30"
        initial="enter"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <motion.h2 
          variants={itemVariants}
          className="text-[3.5rem] md:text-6xl lg:text-[5rem] xl:text-[6.5rem] leading-none font-bold tracking-[-0.04em] text-foreground mb-4 md:mb-12 whitespace-nowrap"
        >
          BOOST AI
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-3xl lg:text-4xl text-muted-foreground mb-8 md:mb-[60px] leading-snug font-light max-w-lg text-left"
        >
          AI that works<br />alongside you.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-foreground/60 uppercase max-w-[260px] lg:max-w-[280px] leading-relaxed"
        >
          AI AUTOMATION · PRODUCT DEVELOPMENT · 2026
        </motion.div>
      </motion.div>

      {/* RIGHT/LOWER-RIGHT: Oversized Product Visual anchored at 42vw */}
      <motion.div 
        className="absolute top-[340px] bottom-0 left-0 right-0 lg:left-[42vw] lg:top-[12vh] xl:top-[15vh] w-full lg:w-auto md:h-full flex items-center justify-center lg:justify-start pointer-events-none z-10 max-md:overflow-hidden"
        initial={{ y: 70, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.8, ease: customEase, delay: 0.1 } }}
        exit={{ y: -70, opacity: 0, transition: { duration: 0.6, ease: customEase, delay: 0 } }}
      >
        <div className="scale-[0.9] md:scale-[0.7] lg:scale-[0.95] xl:scale-[1.1] origin-center lg:origin-top-left shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <MacbookDevice>
            <Image 
              src="/projects/boostai/boostai.png"
              alt="Boost AI Application"
              fill
              className="object-cover"
              priority
            />
          </MacbookDevice>
        </div>
      </motion.div>

    </motion.div>
  );
});
BoostAIScene.displayName = "BoostAIScene";
