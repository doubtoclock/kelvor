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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const cinematicProgress = useMotionValue(0);
  const animRef = useRef<AnimationPlaybackControls | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 7. Cancel previous follow animation
    if (animRef.current) {
      animRef.current.stop();
      animRef.current = null;
    }

    const current = cinematicProgress.get();
    const delta = Math.abs(latest - current);

    // 11. Sticky Section End Safeguard
    if (latest >= 0.97 || latest <= 0.03) {
      if (delta >= 0.08) {
        cinematicProgress.set(latest);
      } else {
        animRef.current = animate(cinematicProgress, latest, { type: "tween", duration: 0.08, ease: "easeOut" });
      }
      return;
    }

    if (delta >= 0.20) {
      // 6. Extreme Jump (e.g. scrollbar drag) -> Snap instantly
      cinematicProgress.set(latest);
    } else if (delta >= 0.08) {
      // 5. Large Delta -> Aggressive Catch-up Tween
      animRef.current = animate(cinematicProgress, latest, { type: "tween", duration: 0.12, ease: "easeOut" });
    } else if (delta >= 0.025) {
      // 4. Medium Delta -> Responsive catch-up spring
      animRef.current = animate(cinematicProgress, latest, { type: "spring", stiffness: 220, damping: 32, mass: 0.3 });
    } else {
      // 3. Normal Scrolling -> Cinematic spring
      animRef.current = animate(cinematicProgress, latest, { type: "spring", stiffness: 90, damping: 28, mass: 0.35, restDelta: 0.001 });
    }

    // 16. Auto-complete transitions if user stops scrolling mid-animation
    if ((window as any).scrollTimeout) {
      clearTimeout((window as any).scrollTimeout);
    }

    (window as any).scrollTimeout = setTimeout(() => {
      // Do not run desktop auto-snap logic on mobile
      if (!isDesktop) return;

      // Check if we are parked inside Transition 1 (Medio -> CafeMitra)
      if (latest > 0.18 && latest < 0.48) {
        const targetProgress = latest < 0.33 ? 0.10 : 0.50;
        const containerTop = containerRef.current?.offsetTop || 0;
        const scrollDistance = (containerRef.current?.offsetHeight || 0) - window.innerHeight;
        window.scrollTo({ top: containerTop + (targetProgress * scrollDistance), behavior: "smooth" });
      } 
      // Check if we are parked inside Transition 2 (CafeMitra -> BoostAI)
      else if (latest > 0.51 && latest < 0.81) {
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
