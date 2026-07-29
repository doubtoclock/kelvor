"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProcessStage } from "./process-stage";
import { Search, FileText, PenTool, Code2, Rocket } from "lucide-react";

const PROCESS_DATA = [
  { id: "01", title: "Discover", description: "Understand the problem, users, and opportunity.", icon: Search },
  { id: "02", title: "Define", description: "Turn insights into a clear product direction.", icon: FileText },
  { id: "03", title: "Design", description: "Shape the experience, interface, and interactions.", icon: PenTool },
  { id: "04", title: "Build", description: "Engineer the product with production-ready systems.", icon: Code2 },
  { id: "05", title: "Launch", description: "Ship, refine, and prepare for what comes next.", icon: Rocket }
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // REDUCED MOTION
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(headerRef.current, { opacity: 1, y: 0 });
      stageRefs.current.forEach((stage) => {
        if (!stage) return;
        gsap.set(stage, { opacity: 1, y: 0 });
        gsap.set(stage.querySelector(".process-connector"), { scaleX: 1 });
        gsap.set(stage.querySelector(".process-connector-mobile"), { scaleY: 1 });
        gsap.set(stage.querySelector(".process-halo"), { opacity: 1 });
      });
    });

    // NORMAL MOTION
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%", // Trigger once when rail enters viewport
        }
      });

      // Heading entrance
      tl.fromTo(headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Sequentially construct the timeline from left to right
      stageRefs.current.forEach((stage, i) => {
        if (!stage) return;
        
        const node = stage.querySelector(".gsap-proc-node");
        const num = stage.querySelector(".gsap-proc-num");
        const title = stage.querySelector(".gsap-proc-title");
        const desc = stage.querySelector(".gsap-proc-desc");
        const connector = stage.querySelector(".process-connector");
        const connectorMobile = stage.querySelector(".process-connector-mobile");

        const ease = "power2.out";
        
        // 1. Marker appears
        tl.to(node, { opacity: 1, duration: 0.2, ease });

        // 2. Number fades in
        tl.to(num, { opacity: 1, duration: 0.3, ease }, "<0.05");

        // 3. Title fades + translates
        tl.fromTo(title,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, ease },
          "<0.1" // Small stagger
        );

        // 4. Description fades + translates
        tl.fromTo(desc,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease },
          "<0.1" // Small stagger
        );

        // 5. Draw the connector to the next step
        if (i < stageRefs.current.length - 1) {
          if (connector) {
            tl.fromTo(connector,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.45, ease: "none" },
              "-=0.1" // Start drawing right as the text finishes settling
            );
          }
          if (connectorMobile) {
            tl.fromTo(connectorMobile,
              { scaleY: 0 },
              { scaleY: 1, duration: 0.45, ease: "none" },
              "<" // Sync desktop and mobile
            );
          }
        }
      });

    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section 
      id="process"
      ref={containerRef}
      className="relative w-full min-h-[100svh] lg:min-h-[110svh] flex flex-col pt-[15vh] lg:pt-[18vh] pb-24 lg:pb-[15vh] overflow-hidden"
    >
      {/* Subtle Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Soft charcoal glow behind the heading */}
        <div className="absolute top-[-10%] left-0 w-full md:w-[70%] h-[70%] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.015)_0%,transparent_60%)] opacity-60 md:opacity-100" />
        
        {/* Darker edges toward sides and bottom */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(7,7,9,0.3)_75%,rgba(7,7,9,0.8)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,7,9,0.5)_0%,transparent_15%,transparent_85%,rgba(7,7,9,0.5)_100%)]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto w-full px-6 lg:px-12 flex flex-col justify-center h-full flex-1">
        
        {/* Header Block */}
        <div ref={headerRef} className="flex flex-col items-start relative z-20">
          <div className="text-xs font-semibold tracking-[0.2em] text-muted uppercase mb-8 md:mb-10">
            OUR PROCESS
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[60px] xl:text-[68px] font-normal leading-[1.05] tracking-tight text-foreground whitespace-pre-line max-w-[500px] lg:max-w-[700px]">
            From first conversation{"\n"}to shipped product.
          </h2>
          <p className="text-base text-muted/80 max-w-[400px] mt-8 leading-relaxed">
            A focused process that keeps strategy, design, and engineering moving in the same direction.
          </p>
        </div>

        {/* Process System Wrapper */}
        <div className="relative w-full mt-8 lg:mt-12">
          
          {/* Atmospheric track depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] lg:w-[110%] h-[110%] lg:h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] opacity-50 md:opacity-100 blur-[40px] md:blur-[80px] lg:blur-[120px] pointer-events-none z-0" />

          <div className="flex flex-col lg:flex-row relative z-10 w-full items-start justify-between gap-y-20 lg:gap-y-0">
            {PROCESS_DATA.map((stage, i) => (
              <ProcessStage 
                key={stage.id}
                ref={(el) => { stageRefs.current[i] = el; }}
                number={stage.id}
                title={stage.title}
                description={stage.description}
                icon={stage.icon}
                isLast={i === PROCESS_DATA.length - 1}
                index={i}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
