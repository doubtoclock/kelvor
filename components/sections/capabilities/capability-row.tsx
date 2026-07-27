"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CapabilityRowProps {
  number: string;
  title: string;
  description: string;
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CapabilityRow({ number, title, description }: CapabilityRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animations are now orchestrated by the parent CapabilitiesSection
  // to ensure perfectly staggered sequencing.

  return (
    <div ref={rowRef} className="w-full flex flex-col group cursor-default gsap-cap-row">
      {/* Thin top divider */}
      <div 
        ref={lineRef} 
        className="gsap-cap-line w-full h-px bg-white/10 transition-colors duration-300 ease-out group-hover:bg-white/25 scale-x-0"
        style={{ transformOrigin: "left" }}
      />
      
      {/* Row Content - Animates as one unit */}
      <div 
        ref={contentRef} 
        className="gsap-cap-content w-full flex flex-col md:flex-row md:items-start py-10 lg:py-16 gap-4 md:gap-6 lg:gap-8 xl:gap-12 opacity-0"
      >
        {/* Number */}
        <div className="text-xs md:text-sm font-mono text-muted/70 transition-colors duration-300 ease-out group-hover:text-foreground/80 md:w-8 lg:w-10 xl:w-12 shrink-0 pt-2 lg:pt-3">
          {number}
        </div>
        
        {/* Title */}
        <h3 className="text-3xl md:text-[34px] lg:text-[42px] font-semibold tracking-tight text-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover:translate-x-2 w-full md:w-[240px] lg:w-[260px] xl:w-[360px] shrink-0 whitespace-pre-line leading-[1.1]">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-base text-muted transition-colors duration-300 ease-out group-hover:text-foreground/70 leading-relaxed w-full md:flex-1 md:max-w-[330px] md:pt-2 lg:pt-3">
          {description}
        </p>
      </div>
    </div>
  );
}
