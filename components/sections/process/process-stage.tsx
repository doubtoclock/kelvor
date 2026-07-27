"use client";

import { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface ProcessStageProps {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  isLast?: boolean;
  index?: number;
}

const STAGE_STYLES = [
  // 0: Discover (Most muted)
  {
    icon: "opacity-75",
    node: "border-[rgba(255,255,255,0.06)] bg-[#070709] shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
    title: "text-[rgba(250,250,250,0.65)]",
    desc: "text-[rgba(245,245,245,0.3)]",
    num: "text-[rgba(245,245,245,0.2)]",
    dash: "rgba(255,255,255,0.20)",
    track: "rgba(255,255,255,0.10)",
    halo: "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_70%)]"
  },
  // 1: Define
  {
    icon: "opacity-85",
    node: "border-[rgba(255,255,255,0.08)] bg-[#070709] shadow-[0_4px_20px_rgba(0,0,0,0.6)]",
    title: "text-[rgba(250,250,250,0.75)]",
    desc: "text-[rgba(245,245,245,0.35)]",
    num: "text-[rgba(245,245,245,0.25)]",
    dash: "rgba(255,255,255,0.25)",
    track: "rgba(255,255,255,0.12)",
    halo: "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]"
  },
  // 2: Design
  {
    icon: "opacity-95",
    node: "border-[rgba(255,255,255,0.10)] bg-[#070709] shadow-[0_4px_24px_rgba(0,0,0,0.7)]",
    title: "text-[rgba(250,250,250,0.85)]",
    desc: "text-[rgba(245,245,245,0.4)]",
    num: "text-[rgba(245,245,245,0.3)]",
    dash: "rgba(255,255,255,0.30)",
    track: "rgba(255,255,255,0.14)",
    halo: "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,transparent_70%)]"
  },
  // 3: Build
  {
    icon: "opacity-100",
    node: "border-[rgba(255,255,255,0.14)] bg-[#070709] shadow-[0_4px_24px_rgba(0,0,0,0.8)]",
    title: "text-[rgba(250,250,250,0.95)]",
    desc: "text-[rgba(245,245,245,0.45)]",
    num: "text-[rgba(245,245,245,0.35)]",
    dash: "rgba(255,255,255,0.35)",
    track: "rgba(255,255,255,0.16)",
    halo: "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]"
  },
  // 4: Launch (Strongest)
  {
    icon: "opacity-100",
    node: "border-[rgba(255,255,255,0.20)] bg-[#070709] shadow-[0_4px_24px_rgba(0,0,0,0.9)]",
    title: "text-[#FAFAFA]",
    desc: "text-[rgba(245,245,245,0.5)]",
    num: "text-[rgba(245,245,245,0.45)]",
    dash: "rgba(255,255,255,0.40)",
    track: "rgba(255,255,255,0.20)",
    halo: "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]"
  }
];

export const ProcessStage = forwardRef<HTMLDivElement, ProcessStageProps>(
  ({ number, title, description, isLast, index = 2 }, ref) => {
    
    // Fallback to middle style if index is out of bounds
    const style = STAGE_STYLES[Math.min(Math.max(index, 0), 4)];

    return (
      <div 
        ref={ref} 
        className={`process-stage-container relative flex flex-col group ${isLast ? "" : "flex-1"} w-full lg:w-auto`}
      >
        {/* Mobile: Vertical arrangement wrapper */}
        <div className="flex lg:block items-start gap-8 lg:gap-0 relative">
          
          {/* Node Wrapper */}
          <div className="relative shrink-0 flex items-center lg:mb-[24px] lg:w-full">
            
            {/* Minimal Circular Node */}
            <div className={`gsap-proc-node relative w-[8px] h-[8px] rounded-full flex items-center justify-center transition-all duration-300 z-10 opacity-0 bg-[#FAFAFA] ${style.icon}`}>
              {/* Halo Effect */}
              <div className={`process-halo absolute inset-[-20px] blur-[8px] opacity-0 pointer-events-none rounded-full transition-opacity duration-500 ${style.halo}`} />
            </div>

            {/* Desktop Connector */}
            {!isLast && (
              <div className="hidden lg:block absolute left-[8px] top-[4px] -translate-y-1/2 w-[calc(100%-8px)] h-[1px] pointer-events-none">
                <div 
                  className="process-connector w-0 h-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                />
              </div>
            )}
          </div>
          
          {/* Mobile Connector */}
          {!isLast && (
            <div className="lg:hidden absolute left-[3.5px] top-[8px] bottom-[-80px] w-[1px]">
              <div 
                className="process-connector-mobile w-full h-0"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              />
            </div>
          )}

          {/* Text Content */}
          <div className="process-text-content flex flex-col pt-1 lg:pt-0">
            <div className={`gsap-proc-num text-[10px] md:text-xs tracking-[0.2em] font-mono mb-3 lg:mb-4 uppercase transition-colors duration-300 opacity-0 ${style.num}`}>
              {number}
            </div>
            
            <h3 className={`gsap-proc-title text-xl md:text-2xl font-semibold tracking-tight mb-2 transition-colors duration-300 group-hover:text-[#FFFFFF] opacity-0 ${style.title}`}>
              {title}
            </h3>
            
            <p className={`gsap-proc-desc text-sm leading-relaxed max-w-[260px] lg:max-w-[240px] transition-colors duration-300 group-hover:text-[rgba(245,245,245,0.6)] opacity-0 ${style.desc}`}>
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

ProcessStage.displayName = "ProcessStage";
