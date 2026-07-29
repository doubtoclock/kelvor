import { motion, AnimatePresence, MotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { PhoneDevice } from "./devices/phone-device";
import { TabletDevice } from "./devices/tablet-device";
import { MedioScene } from "./projects/medio-scene";
import { CafeMitraScene } from "./projects/cafemitra-scene";
import { BoostAIScene } from "./projects/boost-ai-scene";
import { ProjectData } from "@/lib/constants/work-data";

interface WorkStageProps {
  activeProject: -1 | 0 | 1 | 2 | 3;
  onOpenGallery: (project: ProjectData) => void;
  cinematicProgress: MotionValue<number>;
}

// Easing Functions
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const linear = (t: number) => t;

export function WorkStage({ activeProject, onOpenGallery, cinematicProgress }: WorkStageProps) {

  // ----------------------------------------------------
  // PERSISTENT PHONE TRANSFORMS (Medio -> CafeMitra -> Exit)
  // ----------------------------------------------------
  const phoneRanges = [0, 0.23, 0.43, 0.56, 0.76, 1];
  const phoneEasing = [linear, easeInOut, linear, easeInOut, linear];

  const phoneX = useTransform(
    cinematicProgress, 
    phoneRanges, 
    ["18vw", "18vw", "50vw", "50vw", "48vw", "48vw"], 
    { ease: phoneEasing }
  );
  
  const phoneY = useTransform(
    cinematicProgress, 
    phoneRanges, 
    [
      "calc(55vh - 264px)", 
      "calc(55vh - 264px)", 
      "calc(59vh - 247.5px)", 
      "calc(59vh - 247.5px)", 
      "calc(59vh - 287.5px)", 
      "calc(59vh - 287.5px)"
    ], 
    { ease: phoneEasing }
  );

  const phoneScale = useTransform(
    cinematicProgress, 
    phoneRanges, 
    [1, 1, 0.75, 0.75, 0.73, 0.73], 
    { ease: phoneEasing }
  );

  const phoneOpacity = useTransform(
    cinematicProgress, 
    [0, 0.56, 0.76, 1], 
    [1, 1, 0, 0], 
    { ease: [linear, easeInOut, linear] }
  );

  // ----------------------------------------------------
  // PHONE SCREEN CONTENT CROSSFADE
  // ----------------------------------------------------
  const screenRanges = [0, 0.23, 0.43, 1];
  const screenEasing = [linear, easeInOut, linear];

  const medioScreenOpacity = useTransform(cinematicProgress, screenRanges, [1, 1, 0, 0], { ease: screenEasing });
  const cafeScreenOpacity = useTransform(cinematicProgress, screenRanges, [0, 0, 1, 1], { ease: screenEasing });

  // ----------------------------------------------------
  // CAFEMITRA IPAD / POS REVEAL & EXIT
  // ----------------------------------------------------
  const ipadRanges = [0, 0.23, 0.43, 0.56, 0.76, 1];
  const ipadEasing = [linear, easeInOut, linear, easeInOut, linear];

  const ipadOpacity = useTransform(cinematicProgress, ipadRanges, [0, 0, 1, 1, 0, 0], { ease: ipadEasing });
  const ipadX = useTransform(cinematicProgress, ipadRanges, ["40px", "40px", "0px", "0px", "60px", "60px"], { ease: ipadEasing });
  const ipadScale = useTransform(cinematicProgress, ipadRanges, [1.176, 1.176, 1.2, 1.2, 1.176, 1.176], { ease: ipadEasing });

  return (
    <div className="sticky top-0 w-full h-[100svh] overflow-hidden">
      {/* Persistent Section Metadata */}
      <motion.div 
        animate={{ opacity: activeProject === 3 ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute top-6 lg:top-10 left-6 lg:left-12 z-50 pointer-events-none flex flex-col gap-1"
      >
        <h2 className="text-xs lg:text-sm font-semibold tracking-[0.25em] text-muted-foreground uppercase leading-none">
          SELECTED WORK
        </h2>
        <div className="text-[10px] lg:text-xs font-semibold tracking-[0.2em] text-muted-foreground/50 uppercase leading-none mt-0.5">
          <div className="flex items-center mb-0.5">
            <div className="relative overflow-hidden h-[1.2em] w-[1.6em]">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={Math.min(3, Math.max(1, activeProject + 1))}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 block"
                >
                  0{Math.min(3, Math.max(1, activeProject + 1))}
                </motion.span>
              </AnimatePresence>
            </div>
            <span>&mdash; 03</span>
          </div>
          <span className="block">DIGITAL PRODUCTS</span>
        </div>
      </motion.div>

      <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
        
        {/* CAFEMITRA IPAD / POS (Renders behind the phone in the DOM) */}
        <div 
          className="absolute top-0 left-0 origin-top-left z-10"
          style={{ transform: "translate(50vw, calc(59vh - 247.5px)) scale(0.75)" }}
        >
          <motion.div
            className="absolute z-10 shadow-2xl origin-center"
            style={{ 
              opacity: ipadOpacity, 
              x: ipadX, 
              left: "calc(61vw - 640px)", 
              top: "100px", 
              scale: ipadScale 
            }}
          >
            <TabletDevice>
              <Image 
                src="/projects/cafemitra/cafe-erp.png"
                alt="CafeMitra Admin ERP"
                fill
                className="object-cover"
                priority
              />
            </TabletDevice>
          </motion.div>
        </div>

        {/* SINGLE PERSISTENT PHONE SHELL */}
        <motion.div 
          className="absolute top-0 left-0 origin-top-left z-20"
          style={{ 
            x: phoneX, 
            y: phoneY, 
            scale: phoneScale, 
            opacity: phoneOpacity 
          }}
        >
          <PhoneDevice>
            {/* Medio Screen Layer */}
            <motion.div
              className="absolute inset-0 w-full h-full origin-center"
              style={{ opacity: medioScreenOpacity }}
            >
              <Image 
                src="/projects/medio/medio.png"
                alt="Medio Mobile App"
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* CafeMitra Screen Layer */}
            <motion.div
              className="absolute inset-0 w-full h-full origin-center"
              style={{ opacity: cafeScreenOpacity }}
            >
              <Image 
                src="/projects/cafemitra/cafemitra-consumer-app.png"
                alt="CafeMitra Consumer App"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </PhoneDevice>
        </motion.div>

      </div>

      <AnimatePresence>
        {activeProject === 0 && <MedioScene key="0" onOpenGallery={onOpenGallery} cinematicProgress={cinematicProgress} />}
        {activeProject === 1 && <CafeMitraScene key="1" onOpenGallery={onOpenGallery} cinematicProgress={cinematicProgress} />}
        {activeProject === 2 && <BoostAIScene key="2" onOpenGallery={onOpenGallery} cinematicProgress={cinematicProgress} />}
      </AnimatePresence>
    </div>
  );
}
