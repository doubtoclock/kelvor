"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CAPABILITIES = [
  {
    id: "01",
    title: "Product Strategy\n& Design",
    description: "From early ideas to clear product direction, intuitive UX, and polished interfaces.",
    align: "left" as const,
  },
  {
    id: "02",
    title: "Web & Creative\nDevelopment",
    description: "High-performance websites and digital experiences built with motion, interaction, and attention to detail.",
    align: "right" as const,
  },
  {
    id: "03",
    title: "Full-Stack\nEngineering",
    description: "Reliable applications and scalable systems engineered from frontend to backend.",
    align: "left" as const,
  },
  {
    id: "04",
    title: "MVP Build\n& Launch",
    description: "From concept to a working product — designed, engineered, tested, and ready to ship.",
    align: "right" as const,
  },
  {
    id: "05",
    title: "AI Automation\n& Integrations",
    description: "Intelligent workflows and seamless integrations that automate repetitive tasks and help businesses work smarter.",
    align: "left" as const,
  },
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CapabilitiesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const service01Ref = useRef<HTMLDivElement>(null);
  const service02Ref = useRef<HTMLDivElement>(null);
  const service03Ref = useRef<HTMLDivElement>(null);
  const service04Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // 1. REDUCED MOTION PREFERENCE: Accessible static presentation
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (heroBgRef.current) gsap.set(heroBgRef.current, { opacity: 1 });
        if (statementRef.current) gsap.set(statementRef.current, { autoAlpha: 1, y: 0 });
        if (service01Ref.current) gsap.set(service01Ref.current, { autoAlpha: 1, y: 0 });
        if (service02Ref.current) gsap.set(service02Ref.current, { autoAlpha: 1, y: 0 });
        if (service03Ref.current) gsap.set(service03Ref.current, { autoAlpha: 1, y: 0 });
        if (service04Ref.current) gsap.set(service04Ref.current, { autoAlpha: 1, y: 0 });
      });

      // 2. FULL SCROLL-DRIVEN EDITORIAL ANIMATION
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!containerRef.current) return;

        // Initialize element states:
        // Hero background starts at opacity 0 (so blue transition background is visible first)
        if (heroBgRef.current) gsap.set(heroBgRef.current, { opacity: 0 });
        if (statementRef.current) gsap.set(statementRef.current, { autoAlpha: 0, y: 30 });
        if (service01Ref.current) gsap.set(service01Ref.current, { autoAlpha: 0, y: 35 });
        if (service02Ref.current) gsap.set(service02Ref.current, { autoAlpha: 0, y: 35 });
        if (service03Ref.current) gsap.set(service03Ref.current, { autoAlpha: 0, y: 35 });
        if (service04Ref.current) gsap.set(service04Ref.current, { autoAlpha: 0, y: 35 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });

        // ----------------------------------------------------
        // BACKGROUND BLEND: Blue gradient -> Hero #F8F7F3
        // Starts at 0.15, smoothly dissolves into the warm #F8F7F3
        // ivory background as user scrolls through the services
        // ----------------------------------------------------
        if (heroBgRef.current) {
          tl.fromTo(
            heroBgRef.current,
            { opacity: 0 },
            { opacity: 1, ease: "power1.inOut", duration: 0.68, immediateRender: false },
            0.15
          );
        }

        // ----------------------------------------------------
        // STATE 1: INTRODUCTORY STATEMENT (CENTERED)
        // Reveals upon arriving into the section, holds in center,
        // then transitions upward as user scrolls toward Service 01
        // ----------------------------------------------------
        if (statementRef.current) {
          tl.fromTo(
            statementRef.current,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.08, ease: "power1.out", immediateRender: false },
            0.00
          );

          tl.to(
            statementRef.current,
            {
              autoAlpha: 0,
              y: -30,
              ease: "power1.inOut",
              duration: 0.06,
            },
            0.20
          );
        }

        // ----------------------------------------------------
        // STATE 2: SERVICE 01 — PRODUCT STRATEGY & DESIGN (LEFT)
        // ----------------------------------------------------
        if (service01Ref.current) {
          tl.fromTo(
            service01Ref.current,
            { autoAlpha: 0, y: 35 },
            { autoAlpha: 1, y: 0, ease: "power1.inOut", duration: 0.08, immediateRender: false },
            0.24
          );

          tl.to(
            service01Ref.current,
            {
              autoAlpha: 0,
              y: -35,
              ease: "power1.inOut",
              duration: 0.06,
            },
            0.40
          );
        }

        // ----------------------------------------------------
        // STATE 3: SERVICE 02 — WEB & CREATIVE DEVELOPMENT (RIGHT)
        // ----------------------------------------------------
        if (service02Ref.current) {
          tl.fromTo(
            service02Ref.current,
            { autoAlpha: 0, y: 35 },
            { autoAlpha: 1, y: 0, ease: "power1.inOut", duration: 0.08, immediateRender: false },
            0.44
          );

          tl.to(
            service02Ref.current,
            {
              autoAlpha: 0,
              y: -35,
              ease: "power1.inOut",
              duration: 0.06,
            },
            0.60
          );
        }

        // ----------------------------------------------------
        // STATE 4: SERVICE 03 — FULL-STACK ENGINEERING (LEFT)
        // ----------------------------------------------------
        if (service03Ref.current) {
          tl.fromTo(
            service03Ref.current,
            { autoAlpha: 0, y: 35 },
            { autoAlpha: 1, y: 0, ease: "power1.inOut", duration: 0.08, immediateRender: false },
            0.64
          );

          tl.to(
            service03Ref.current,
            {
              autoAlpha: 0,
              y: -35,
              ease: "power1.inOut",
              duration: 0.06,
            },
            0.80
          );
        }

        // ----------------------------------------------------
        // STATE 5: SERVICE 04 — MVP BUILD & LAUNCH (RIGHT)
        // ----------------------------------------------------
        if (service04Ref.current) {
          tl.fromTo(
            service04Ref.current,
            { autoAlpha: 0, y: 35 },
            { autoAlpha: 1, y: 0, ease: "power1.inOut", duration: 0.08, immediateRender: false },
            0.84
          );
        }
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section
      id="capabilities"
      ref={containerRef}
      className="relative w-full h-[540vh] select-none text-[#222722]"
    >
      {/* ======================================================== */}
      {/* PINNED STAGE VIEWPORT (CSS STICKY 100svh)                */}
      {/* ======================================================== */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-[100svh] overflow-hidden flex items-center justify-center z-10"
      >
        {/* ======================================================== */}
        {/* BACKGROUND LAYER 1: JADE & MINT CIRCULAR GRADIENT        */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle at 50% 28%, #BCE8D5 0%, #64A98E 24%, #176B55 50%, #104B3D 76%, #102D25 100%)",
          }}
          aria-hidden="true"
        />

        {/* Ambient Top Light Diffusion */}
        <div
          className="absolute top-0 left-0 right-0 h-[50vh] pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255, 255, 255, 0.45) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* ======================================================== */}
        {/* BACKGROUND LAYER 2: HERO SECTION BACKGROUND (#F7F4ED)    */}
        {/* ======================================================== */}
        <div
          ref={heroBgRef}
          className="absolute inset-0 pointer-events-none z-[2] bg-[#F7F4ED] opacity-0 will-change-opacity overflow-hidden"
          aria-hidden="true"
        >
          {/* Hero Soft Atmospheric Top Wash */}
          <div
            className="absolute top-0 left-0 right-0 h-[60vh] pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(ellipse 75% 45% at 50% 0%, rgba(188, 232, 213, 0.28) 0%, rgba(226, 242, 233, 0.10) 55%, transparent 100%)",
            }}
          />

          {/* Hero Flowing Misty Mint/Jade Landscape Dunes (Inline SVG) */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-0"
            style={{ height: "30%" }}
            viewBox="0 0 1440 270"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="capLeftDuneGrad" x1="0%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#BCE8D5" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#E2F2E9" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#F7F4ED" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="capRightDuneGrad" x1="30%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#64A98E" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#BCE8D5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#F7F4ED" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d="M 0 140 C 120 130, 240 180, 420 190 C 580 200, 720 250, 840 270 L 0 270 Z"
              fill="url(#capLeftDuneGrad)"
            />
            <path
              d="M 520 270 C 700 270, 840 220, 1040 160 C 1220 100, 1360 110, 1440 120 L 1440 270 Z"
              fill="url(#capRightDuneGrad)"
            />
          </svg>

          {/* Soft Bottom Transition Wash into dark Process section */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[25vh] pointer-events-none z-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(7, 7, 9, 0.3) 60%, #070709 100%)",
            }}
          />
        </div>

        {/* ======================================================== */}
        {/* EDITORIAL CONTENT STAGE (Z-10)                           */}
        {/* Text sits directly on canvas without card backgrounds    */}
        {/* ======================================================== */}
        <div className="relative w-full h-full max-w-[1600px] mx-auto px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 flex items-center justify-center z-10">
          
          {/* ======================================================== */}
          {/* STATE 1: INTRODUCTORY STATEMENT (CENTERED)                */}
          {/* Prominently centered horizontally and vertically          */}
          {/* ======================================================== */}
          <div
            ref={statementRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none opacity-0 invisible"
          >
            <div className="flex flex-col items-center justify-center text-center max-w-[960px] pointer-events-auto">
              <span className="text-[10px] md:text-xs font-mono font-semibold tracking-[0.24em] text-[#176B55] uppercase mb-6 md:mb-8">
                WHAT WE DO
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[62px] xl:text-[72px] font-display font-medium leading-[1.08] tracking-tight text-[#222722] whitespace-pre-line">
                We turn ambitious{"\n"}ideas into products{"\n"}people want to use.
              </h2>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STATE 2: SERVICE 01 — PRODUCT STRATEGY & DESIGN (LEFT)   */}
          {/* ======================================================== */}
          <div
            ref={service01Ref}
            className="absolute inset-y-0 left-6 sm:left-12 md:left-20 lg:left-28 xl:left-36 flex items-center justify-start pointer-events-none opacity-0 invisible"
          >
            <div className="flex flex-col items-start text-left max-w-[620px] pointer-events-auto">
              <span className="text-xs md:text-sm font-mono font-medium tracking-[0.24em] text-[#176B55] uppercase mb-4 md:mb-6">
                01
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-display font-semibold md:font-medium tracking-tight text-[#222722] leading-[1.08] whitespace-pre-line mb-6 md:mb-8">
                Product Strategy{"\n"}&amp; Design
              </h3>
              <p className="text-base sm:text-lg md:text-xl font-body text-[#39473F] leading-relaxed max-w-[480px]">
                From early ideas to clear product direction, intuitive UX, and polished interfaces.
              </p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STATE 3: SERVICE 02 — WEB & CREATIVE DEVELOPMENT (RIGHT) */}
          {/* ======================================================== */}
          <div
            ref={service02Ref}
            className="absolute inset-y-0 right-6 sm:right-12 md:right-20 lg:right-28 xl:right-36 flex items-center justify-end pointer-events-none opacity-0 invisible"
          >
            <div className="flex flex-col items-end text-right max-w-[620px] pointer-events-auto">
              <span className="text-xs md:text-sm font-mono font-medium tracking-[0.24em] text-[#176B55] uppercase mb-4 md:mb-6">
                02
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-display font-semibold md:font-medium tracking-tight text-[#222722] leading-[1.08] whitespace-pre-line mb-6 md:mb-8">
                Web &amp; Creative{"\n"}Development
              </h3>
              <p className="text-base sm:text-lg md:text-xl font-body text-[#39473F] leading-relaxed max-w-[480px]">
                High-performance websites and digital experiences built with motion, interaction, and attention to detail.
              </p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STATE 4: SERVICE 03 — FULL-STACK ENGINEERING (LEFT)      */}
          {/* ======================================================== */}
          <div
            ref={service03Ref}
            className="absolute inset-y-0 left-6 sm:left-12 md:left-20 lg:left-28 xl:left-36 flex items-center justify-start pointer-events-none opacity-0 invisible"
          >
            <div className="flex flex-col items-start text-left max-w-[620px] pointer-events-auto">
              <span className="text-xs md:text-sm font-mono font-medium tracking-[0.24em] text-[#176B55] uppercase mb-4 md:mb-6">
                03
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-display font-semibold md:font-medium tracking-tight text-[#222722] leading-[1.08] whitespace-pre-line mb-6 md:mb-8">
                Full-Stack{"\n"}Engineering
              </h3>
              <p className="text-base sm:text-lg md:text-xl font-body text-[#39473F] leading-relaxed max-w-[480px]">
                Reliable applications and scalable systems engineered from frontend to backend.
              </p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STATE 5: SERVICE 04 — MVP BUILD & LAUNCH (RIGHT)         */}
          {/* ======================================================== */}
          <div
            ref={service04Ref}
            className="absolute inset-y-0 right-6 sm:right-12 md:right-20 lg:right-28 xl:right-36 flex items-center justify-end pointer-events-none opacity-0 invisible"
          >
            <div className="flex flex-col items-end text-right max-w-[620px] pointer-events-auto">
              <span className="text-xs md:text-sm font-mono font-medium tracking-[0.24em] text-[#176B55] uppercase mb-4 md:mb-6">
                04
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-display font-semibold md:font-medium tracking-tight text-[#222722] leading-[1.08] whitespace-pre-line mb-6 md:mb-8">
                MVP Build{"\n"}&amp; Launch
              </h3>
              <p className="text-base sm:text-lg md:text-xl font-body text-[#39473F] leading-relaxed max-w-[480px]">
                From concept to a working product — designed, engineered, tested, and ready to ship.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
