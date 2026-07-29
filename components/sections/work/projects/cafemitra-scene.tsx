import { forwardRef } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProjectData, PROJECTS } from "@/lib/constants/work-data";

interface CafeMitraSceneProps {
  onOpenGallery?: (project: ProjectData) => void;
  cinematicProgress: MotionValue<number>;
}

export const CafeMitraScene = forwardRef<HTMLDivElement, CafeMitraSceneProps>(({ onOpenGallery, cinematicProgress, ...props }, ref) => {
  const projectData = PROJECTS.find(p => p.internalId === "cafemitra")!;

  const textOpacity = useTransform(cinematicProgress, [0.20, 0.33, 0.60, 0.70], [0, 1, 1, 0]);
  const textY = useTransform(cinematicProgress, [0.20, 0.33, 0.60, 0.70], [40, 0, 0, -40]);
  const pointerEvents = useTransform(textOpacity, (v) => v > 0.1 ? "auto" : "none");

  return (
    <motion.div 
      ref={ref} 
      {...props}
      className="absolute inset-0 w-full h-full flex items-center justify-between px-6 lg:px-24 z-10"
    >
      
      {/* LEFT: Typography */}
      <motion.div 
        style={{ opacity: textOpacity, y: textY, pointerEvents: pointerEvents as any }}
        className="absolute top-0 left-0 max-md:w-full md:left-[6vw] lg:left-[8vw] md:top-1/2 md:-translate-y-[45%] md:w-[40vw] h-[340px] md:h-auto z-30"
      >
        <div 
          className="w-full h-full flex flex-col items-start justify-start pt-[100px] md:pt-0 px-6 md:px-0"
        >
          <h2 className="text-[2.5rem] md:text-7xl lg:text-[6rem] xl:text-[7rem] leading-none font-bold tracking-[-0.04em] text-foreground mb-4 md:mb-12 whitespace-nowrap">
            {projectData.title}
          </h2>
          
          <p className="text-xl md:text-3xl lg:text-4xl text-muted-foreground mb-8 md:mb-[60px] leading-snug font-light max-w-lg">
            {projectData.tagline}
          </p>

          <div className="flex flex-col items-start gap-6">
            <div className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-foreground/60 uppercase">
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
        </div>
      </motion.div>



    </motion.div>
  );
});
CafeMitraScene.displayName = "CafeMitraScene";
