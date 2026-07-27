import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PhoneDevice } from "./devices/phone-device";
import { MedioScene } from "./projects/medio-scene";
import { CafeMitraScene } from "./projects/cafemitra-scene";
import { BoostAIScene } from "./projects/boost-ai-scene";

interface WorkStageProps {
  activeProject: -1 | 0 | 1 | 2 | 3;
}

export function WorkStage({ activeProject }: WorkStageProps) {
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

      {/* Shared Persistent Phone */}
      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-between px-6 lg:px-24 pointer-events-none z-20"
      >
        {/* Left Spacer for CafeMitra & Boost AI */}
        {/* Removed on desktop since we now use absolute positioning */}

        {/* Dynamic Wrapper */}
        <div className={`absolute top-[340px] bottom-0 left-0 right-0 max-md:flex max-md:items-center max-md:justify-center max-md:overflow-hidden ${activeProject === 1 ? 'md:absolute md:right-[4vw] md:left-auto md:bottom-auto md:top-1/2 md:-translate-y-[35%] md:w-[52vw] md:max-w-[850px] md:h-[60vh]' : 'md:absolute md:inset-0 md:w-full md:h-full'} pointer-events-none z-20`}>
          <motion.div 
            layout
            initial={false}
            animate={
              activeProject === -1 
                ? { x: "-45vw", opacity: 0, scale: 0.97 }
                : activeProject >= 2 
                ? { x: "45vw", opacity: 0, scale: 0.97 }
                : { x: 0, opacity: 1, scale: 1 }
            }
            transition={{
              layout: { type: "tween", duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
              x: { type: "tween", duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: activeProject >= 2 ? 0.15 : activeProject === -1 ? 0.0 : 0.08 },
              opacity: { type: "tween", duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: activeProject >= 2 ? 0.15 : activeProject === -1 ? 0.0 : 0.08 },
              scale: { type: "tween", duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: activeProject >= 2 ? 0.15 : activeProject === -1 ? 0.0 : 0.08 }
            }}
            className={
              activeProject <= 0 
                ? "max-md:scale-[0.8] md:absolute md:left-[15vw] lg:left-[18vw] md:top-[52%] lg:top-[55%] md:-translate-y-[35%] lg:-translate-y-[40%] origin-center md:origin-top-left z-20 md:scale-[0.85] lg:scale-[1]"
                : activeProject === 1
                ? "max-md:absolute max-md:top-1/2 max-md:left-1/2 max-md:-translate-x-[65%] max-md:-translate-y-[45%] max-md:scale-[0.6] md:absolute md:left-[10%] lg:left-[12%] xl:left-[15%] md:top-1/2 md:-translate-y-1/2 md:scale-[0.65] lg:scale-[0.75] origin-left z-30"
                : "max-md:absolute max-md:top-1/2 max-md:left-1/2 max-md:-translate-x-[65%] max-md:-translate-y-[45%] max-md:scale-[0.6] md:absolute md:-left-[20%] md:top-1/2 md:-translate-y-1/2 md:scale-[0.6] opacity-0 z-20"
            }
          >
            <PhoneDevice>
              <AnimatePresence>
                {activeProject <= 0 && (
                  <motion.div
                    key="medio-screen"
                    className="absolute inset-0 w-full h-full origin-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
                    exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                  >
                    <Image 
                      src="/projects/medio/medio.png"
                      alt="Medio Mobile App"
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                )}
                {activeProject === 1 && (
                  <motion.div
                    key="cafe-screen"
                    className="absolute inset-0 w-full h-full origin-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
                    exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                  >
                    <Image 
                      src="/projects/cafemitra/cafemitra-consumer-app.png"
                      alt="CafeMitra Consumer App"
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </PhoneDevice>
          </motion.div>
        </div>
      </div>

      {/* Project Scenes */}
      <AnimatePresence>
        {activeProject === 0 && <MedioScene key="0" />}
        {activeProject === 1 && <CafeMitraScene key="1" />}
        {activeProject === 2 && <BoostAIScene key="2" />}
      </AnimatePresence>
    </div>
  );
}
