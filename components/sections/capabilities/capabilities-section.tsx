"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CapabilityRow } from "./capability-row";

const CAPABILITIES = [
  {
    id: "01",
    title: "Product Strategy\n& Design",
    description: "From early ideas to clear product direction, intuitive UX, and polished interfaces."
  },
  {
    id: "02",
    title: "Web & Creative\nDevelopment",
    description: "High-performance websites and digital experiences built with motion, interaction, and attention to detail."
  },
  {
    id: "03",
    title: "Full-Stack\nEngineering",
    description: "Reliable applications and scalable systems engineered from frontend to backend."
  },
  {
    id: "04",
    title: "MVP Build\n& Launch",
    description: "From concept to a working product — designed, engineered, tested, and ready to ship."
  }
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CapabilitiesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%", // Trigger when section top enters viewport
        toggleActions: "play none none none" // Play once
      }
    });

    const ease = "power3.out"; // Premium smooth easing

    // 1. WHAT WE DO label
    tl.fromTo(".gsap-cap-label", 
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease }
    );

    // 2. Main statement
    tl.fromTo(".gsap-cap-statement",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease },
      "-=0.4" // Reveal shortly after label begins
    );

    // 3. Right-side Capability Rows (Sequenced)
    const rows = gsap.utils.toArray(".gsap-cap-row");
    
    rows.forEach((row: any, index) => {
      const line = row.querySelector(".gsap-cap-line");
      const content = row.querySelector(".gsap-cap-content");
      
      // Calculate start time: 
      // Row 1 overlaps statement. Subsequent rows overlap previous row by 0.55s (resulting in a ~0.15s stagger gap)
      const startTime = index === 0 ? "-=0.4" : "-=0.55";

      tl.to(line, 
        { scaleX: 1, duration: 0.7, ease }, 
        startTime
      );
      
      tl.fromTo(content,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease },
        "<" // Sync exactly with its own separator line
      );
    });

  }, { scope: containerRef });

  return (
    <section 
      id="capabilities"
      ref={containerRef}
      className="relative w-full min-h-screen px-6 lg:px-12 pt-24 md:pt-40 pb-40 lg:pb-64"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row gap-16 md:gap-8 lg:gap-12">
        
        {/* Left Column - Sticky on Desktop (approx 45%) */}
        <div className="w-full md:w-[45%] lg:w-[45%] shrink-0 relative">
          <div 
            ref={stickyRef}
            className="md:sticky md:top-40 flex flex-col items-start"
          >
            <div className="gsap-cap-label text-xs font-semibold tracking-[0.2em] text-muted uppercase mb-8 md:mb-10 opacity-0">
              WHAT WE DO
            </div>
            
            <h2 className="gsap-cap-statement text-4xl md:text-5xl lg:text-[60px] xl:text-[68px] font-normal leading-[1.05] tracking-tight text-foreground whitespace-pre-line max-w-[500px] lg:max-w-[700px] opacity-0">
              We turn ambitious{"\n"}ideas into products{"\n"}people want to use.
            </h2>
          </div>
        </div>

        {/* Right Column - Scrolling List (approx 55%) */}
        <div className="w-full md:w-[55%] lg:w-[55%] flex flex-col md:pt-40">
          {CAPABILITIES.map((cap) => (
            <CapabilityRow
              key={cap.id}
              number={cap.id}
              title={cap.title}
              description={cap.description}
            />
          ))}
          {/* Add a bottom divider for the last row */}
          <div className="w-full h-px bg-white/10 mt-0" />
        </div>

      </div>
    </section>
  );
}
