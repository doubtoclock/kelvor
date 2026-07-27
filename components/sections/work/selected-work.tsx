"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { WorkStage } from "./work-stage";

export function SelectedWorkSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState<-1 | 0 | 1 | 2 | 3>(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.01 && activeProject !== -1) {
      setActiveProject(-1);
    } else if (latest >= 0.01 && latest < 0.33 && activeProject !== 0) {
      setActiveProject(0);
    } else if (latest >= 0.33 && latest < 0.66 && activeProject !== 1) {
      setActiveProject(1);
    } else if (latest >= 0.66 && activeProject !== 2) {
      setActiveProject(2);
    }
  });

  return (
    <section ref={containerRef} className="relative w-full h-[250vh] md:h-[400vh]" id="work">
      <WorkStage activeProject={activeProject} />
    </section>
  );
}
