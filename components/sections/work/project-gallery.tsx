"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectData } from "@/lib/constants/work-data";

interface ProjectGalleryProps {
  project: ProjectData | null;
  onClose: () => void;
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0
  })
};

export function ProjectGallery({ project, onClose }: ProjectGalleryProps) {
  const [[page, direction], setPage] = useState([0, 0]);

  // Derived current index that wraps around safely
  const imageCount = project?.galleryImages.length || 0;
  const currentIndex = imageCount === 0 ? 0 : ((page % imageCount) + imageCount) % imageCount;

  // Reset index when opening a new project
  useEffect(() => {
    if (project) setPage([0, 0]);
  }, [project]);

  const paginate = useCallback((newDirection: number) => {
    if (imageCount <= 1) return;
    setPage([page + newDirection, newDirection]);
  }, [page, imageCount]);

  // Lock body scroll and listen for Keyboard events
  useEffect(() => {
    if (!project) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose, paginate]);

  const prefetchIndices = imageCount > 1 
    ? Array.from(new Set([
        (currentIndex + 1) % imageCount,
        (currentIndex - 1 + imageCount) % imageCount
      ]))
    : [];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Project Gallery`}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-background text-foreground overflow-hidden"
          onClick={onClose}
        >
          {/* Hidden Adjacent Images Prefetch */}
          {prefetchIndices.length > 0 && (
            <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
              {prefetchIndices.map(idx => (
                <Image
                  key={`preload-${idx}`}
                  src={project.galleryImages[idx]}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 75vw, 100vw"
                  priority={true}
                />
              ))}
            </div>
          )}

          {/* Top Bar */}
          <div 
            className="w-full flex items-center justify-between px-6 py-8 md:px-12 md:py-10 z-10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase">{project.title}</h2>
            
            <div className="flex items-center gap-12 md:gap-24">
              <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {(currentIndex + 1).toString().padStart(2, "0")} / {imageCount.toString().padStart(2, "0")}
              </div>
              
              <button 
                onClick={onClose} 
                className="text-xs font-semibold tracking-[0.2em] uppercase hover:text-white/70 transition-colors focus:outline-none focus:underline underline-offset-4"
                aria-label="Close Gallery"
              >
                Close
              </button>
            </div>
          </div>

          {/* Center Stage */}
          <div 
            className="w-full flex-1 min-h-0 flex flex-col md:flex-row items-center justify-center px-6 md:px-12 relative py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Desktop Prev */}
            {imageCount > 1 && (
              <button 
                className="hidden md:block text-xs font-semibold tracking-[0.2em] uppercase hover:text-white/70 transition-colors absolute left-12 z-20 focus:outline-none focus:underline underline-offset-4" 
                onClick={() => paginate(-1)}
                aria-label="Previous Image"
              >
                Previous
              </button>
            )}

            {/* Image Container */}
            <div className="relative w-full md:w-[75vw] h-full min-h-0 flex items-center justify-center overflow-hidden touch-pan-y">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "tween", duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.4 }
                  }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center"
                  drag={imageCount > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) paginate(1);
                    else if (swipe > swipeConfidenceThreshold) paginate(-1);
                  }}
                >
                  <motion.div 
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={project.galleryImages[currentIndex]}
                      alt={`${project.title} Gallery Image ${currentIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="(min-width: 768px) 75vw, 100vw"
                      priority
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop Next */}
            {imageCount > 1 && (
              <button 
                className="hidden md:block text-xs font-semibold tracking-[0.2em] uppercase hover:text-white/70 transition-colors absolute right-12 z-20 focus:outline-none focus:underline underline-offset-4" 
                onClick={() => paginate(1)}
                aria-label="Next Image"
              >
                Next
              </button>
            )}
          </div>

          {/* Bottom Info Row */}
          <div 
            className="w-full flex flex-col md:flex-row items-start md:items-end justify-between px-6 py-8 md:px-12 md:py-10 z-10 shrink-0 gap-8 md:gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Navigation */}
            {imageCount > 1 && (
              <div className="flex md:hidden items-center justify-between w-full border-b border-white/10 pb-6 mb-2">
                <button 
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase focus:outline-none focus:underline underline-offset-4" 
                  onClick={() => paginate(-1)}
                >
                  Previous
                </button>
                <button 
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase focus:outline-none focus:underline underline-offset-4" 
                  onClick={() => paginate(1)}
                >
                  Next
                </button>
              </div>
            )}

            <p className="text-xl md:text-2xl font-light text-foreground whitespace-pre-line leading-snug max-w-xl">
              {project.tagline}
            </p>

            <div className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-foreground/60 uppercase">
              {project.meta}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
