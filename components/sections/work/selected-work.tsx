"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent, useMotionValue, animate, AnimationPlaybackControls } from "framer-motion";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/use-media-query";

const WorkStage = dynamic(() => import("./work-stage").then(mod => mod.WorkStage));
const MobileWorkStage = dynamic(() => import("./mobile-work-stage").then(mod => mod.MobileWorkStage));
import { ProjectGallery } from "./project-gallery";
import { ProjectData } from "@/lib/constants/work-data";

export function SelectedWorkSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState<-1 | 0 | 1 | 2 | 3>(-1);
  const [activeGalleryProject, setActiveGalleryProject] = useState<ProjectData | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isInteracting = useRef(false);

  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout;
    
    const handleInteractStart = () => { isInteracting.current = true; };
    const handleInteractEnd = () => { isInteracting.current = false; };
    const handleWheel = () => {
      isInteracting.current = true;
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => { isInteracting.current = false; }, 200);
    };

    window.addEventListener("touchstart", handleInteractStart, { passive: true });
    window.addEventListener("touchend", handleInteractEnd, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    
    return () => {
      window.removeEventListener("touchstart", handleInteractStart);
      window.removeEventListener("touchend", handleInteractEnd);
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(wheelTimeout);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const cinematicProgress = useMotionValue(0);
  const animRef = useRef<AnimationPlaybackControls | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 1. Direct 1:1 mapping (removes the "spring" effect that causes input lag)
    cinematicProgress.set(latest);

    // 2. Auto-complete transitions if user stops scrolling mid-animation
    if ((window as any).scrollTimeout) {
      clearTimeout((window as any).scrollTimeout);
    }

    (window as any).scrollTimeout = setTimeout(() => {
      // Do not auto-snap if user is physically interacting (holding touch or actively wheeling)
      if (isInteracting.current) return;

      if (!isDesktop) {
        // Mobile auto-snap logic (Target points: 0.0, 0.5, 1.0)
        if (latest > 0.15 && latest < 0.35) {
          const targetProgress = latest < 0.25 ? 0.0 : 0.50;
          const containerTop = containerRef.current?.offsetTop || 0;
          const scrollDistance = (containerRef.current?.offsetHeight || 0) - window.innerHeight;
          window.scrollTo({ top: containerTop + (targetProgress * scrollDistance), behavior: "smooth" });
        } else if (latest > 0.65 && latest < 0.85) {
          const targetProgress = latest < 0.75 ? 0.50 : 1.0;
          const containerTop = containerRef.current?.offsetTop || 0;
          const scrollDistance = (containerRef.current?.offsetHeight || 0) - window.innerHeight;
          window.scrollTo({ top: containerTop + (targetProgress * scrollDistance), behavior: "smooth" });
        }
        return;
      }

      // Desktop auto-snap logic
      if (latest > 0.18 && latest < 0.48) {
        const targetProgress = latest < 0.33 ? 0.10 : 0.50;
        const containerTop = containerRef.current?.offsetTop || 0;
        const scrollDistance = (containerRef.current?.offsetHeight || 0) - window.innerHeight;
        window.scrollTo({ top: containerTop + (targetProgress * scrollDistance), behavior: "smooth" });
      } else if (latest > 0.51 && latest < 0.81) {
        const targetProgress = latest < 0.66 ? 0.50 : 0.90;
        const containerTop = containerRef.current?.offsetTop || 0;
        const scrollDistance = (containerRef.current?.offsetHeight || 0) - window.innerHeight;
        window.scrollTo({ top: containerTop + (targetProgress * scrollDistance), behavior: "smooth" });
      }
    }, 150);
  });

  // 15. Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animRef.current) {
        animRef.current.stop();
      }
    };
  }, []);

  // 9. activeProject must use cinematicProgress
  useMotionValueEvent(cinematicProgress, "change", (latest) => {
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

  const handleCloseGallery = () => setActiveGalleryProject(null);

  if (isDesktop === null) {
    return <section ref={containerRef} id="work" className="relative w-full min-h-screen" />;
  }

  if (!isDesktop) {
    return (
      <>
        <section ref={containerRef} id="work" className="relative w-full h-[300svh]">
          <MobileWorkStage onOpenGallery={setActiveGalleryProject} mobileProgress={scrollYProgress} />
        </section>
        <ProjectGallery project={activeGalleryProject} onClose={handleCloseGallery} />
      </>
    );
  }

  return (
    <>
      <section ref={containerRef} className="relative w-full h-[600vh]" id="work">
        <WorkStage activeProject={activeProject} onOpenGallery={setActiveGalleryProject} cinematicProgress={cinematicProgress} />
      </section>
      <ProjectGallery project={activeGalleryProject} onClose={handleCloseGallery} />
    </>
  );
}
