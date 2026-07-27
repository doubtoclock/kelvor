"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroOrchestrator({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // --------------------------------------------------------
    // REDUCED MOTION (or fallback)
    // --------------------------------------------------------
    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Just pin briefly or fade things out simply
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=50%",
          scrub: true,
          pin: true,
        }
      });
      
      tl.to(".hero-fade-group, .hero-nav-fade", { opacity: 0, duration: 1 });
      tl.fromTo(".selected-work-meta", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5);
    });

    // --------------------------------------------------------
    // DESKTOP FULL SEQUENCE
    // --------------------------------------------------------
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=50%",
          scrub: 1,
          pin: true,
          refreshPriority: 1,
        }
      });

      tl.addLabel("rest", 0).addLabel("heroExit", 0.15);

      tl.to(".hero-fade-group", { x: -40, opacity: 0, duration: 0.23, ease: "power2.inOut" }, "heroExit");
      tl.to(".hero-nav-fade", { opacity: 0, duration: 0.23, ease: "power2.inOut" }, "heroExit");
    });

    // --------------------------------------------------------
    // TABLET SEQUENCE
    // --------------------------------------------------------
    mm.add("(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=50%",
          scrub: 1,
          pin: true,
          refreshPriority: 1,
        }
      });

      tl.addLabel("rest", 0).addLabel("heroExit", 0.15);

      tl.to(".hero-fade-group", { x: -20, opacity: 0, duration: 0.23 }, "heroExit");
      tl.to(".hero-nav-fade", { opacity: 0, duration: 0.23 }, "heroExit");
    });

    // --------------------------------------------------------
    // MOBILE SEQUENCE
    // --------------------------------------------------------
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=50%", 
          scrub: 1,
          pin: true,
          refreshPriority: 1,
        }
      });

      tl.addLabel("rest", 0).addLabel("heroExit", 0.1);

      tl.to(".hero-fade-group", { y: -20, opacity: 0, duration: 0.3 }, "heroExit");
      tl.to(".hero-nav-fade", { opacity: 0, duration: 0.3 }, "heroExit");
    });

    // Ensure ScrollTrigger refreshes once after everything initializes
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      mm.revert();
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-[100svh] overflow-hidden">
      {children}
    </div>
  );
}
