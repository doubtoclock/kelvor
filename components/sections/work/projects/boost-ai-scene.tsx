import { forwardRef } from "react";
import Image from "next/image";
import { motion, useTransform, MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MacbookDevice } from "../devices/macbook-device";
import { ProjectData, PROJECTS } from "@/lib/constants/work-data";

interface BoostAISceneProps {
  onOpenGallery?: (project: ProjectData) => void;
  cinematicProgress: MotionValue<number>;
}

export const BoostAIScene = forwardRef<HTMLDivElement, BoostAISceneProps>(({ onOpenGallery, cinematicProgress, ...props }, ref) => {
  const projectData = PROJECTS.find(p => p.internalId === "boostai")!;

  const textOpacity = useTransform(cinematicProgress, [0.65, 0.76], [0, 1]);
  const textY = useTransform(cinematicProgress, [0.65, 0.76], [40, 0]);
  const pointerEvents = useTransform(textOpacity, (v) => v > 0.1 ? "auto" : "none");

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  // Boost Device Entry
  const boostOpacity = useTransform(cinematicProgress, [0.69, 0.84], [0, 1]);
  const boostY = useTransform(cinematicProgress, [0.69, 0.84], ["40px", "0px"]);
  const boostScale = useTransform(cinematicProgress, [0.69, 0.84], [0.985, 1]);



  return (
    <motion.div 
      ref={ref} 
      {...props}
      className="absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-0 z-10"
    >
      
      {/* LEFT: Typography (38-40% Territory) */}
      <motion.div 
        style={{ opacity: textOpacity, y: textY, pointerEvents: pointerEvents as any }}
        className="absolute md:relative top-0 left-0 w-full lg:w-[40vw] flex flex-col items-start justify-start lg:justify-center pt-[100px] lg:pt-0 px-6 lg:px-0 lg:pl-[8vw] xl:pl-[10vw] h-[340px] md:h-full z-30"
      >
        <h2 
          className="text-[3.5rem] md:text-6xl lg:text-[5rem] xl:text-[6.5rem] leading-none font-bold tracking-[-0.04em] text-foreground mb-4 md:mb-12 whitespace-nowrap"
        >
          {projectData.title}
        </h2>
        
        <p 
          className="text-xl md:text-3xl lg:text-4xl text-muted-foreground mb-8 md:mb-[60px] leading-snug font-light max-w-lg text-left"
        >
          {projectData.tagline}
        </p>

        <div 
          className="flex flex-col items-start gap-6"
        >
          <div className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-foreground/60 uppercase max-w-[260px] lg:max-w-[280px] leading-relaxed">
            {projectData.meta}
          </div>
          <button
            onClick={() => onOpenGallery?.(projectData)}
            className="group inline-flex items-center gap-3 py-3 text-base md:text-lg font-medium text-white/90 hover:text-white border-b border-white/30 hover:border-white transition-colors duration-300 cursor-pointer"
          >
            VIEW PROJECT
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </motion.div>

      {/* RIGHT/LOWER-RIGHT: Oversized Product Visual anchored at 42vw */}
      <motion.div 
        className="absolute top-[340px] bottom-0 left-0 right-0 lg:left-[42vw] lg:top-[12vh] xl:top-[15vh] w-full lg:w-auto md:h-full flex items-center justify-center lg:justify-start pointer-events-none z-10 max-md:overflow-hidden"
        style={{ opacity: boostOpacity, y: boostY, scale: boostScale }}
      >
        <div className="scale-[0.9] md:scale-[0.7] lg:scale-[0.95] xl:scale-[1.1] origin-center lg:origin-top-left shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <MacbookDevice>
            <Image 
              src="/projects/boostai/boostai.webp"
              alt={`${projectData.title} Application`}
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
