"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PROCESS_STAGES,
  ProcessStationaryCanvas,
  ProcessTextPanel,
  ProcessOpeningHeading,
  ProcessMobileStage,
} from "./process-stage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null);
  const contentPageRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  // Stationary Image Canvas Refs (Layer A)
  const discoverImgRef = useRef<HTMLDivElement>(null);
  const defineImgRef = useRef<HTMLDivElement>(null);
  const designImgRef = useRef<HTMLDivElement>(null);
  const buildImgRef = useRef<HTMLDivElement>(null);
  const launchImgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ========================================================
      // DESKTOP: CONTINUOUS SCROLLING OVERLAY OVER STATIONARY IMAGES (>= 1024px)
      // Visual Model:
      // - LAYER A (Stationary Canvas): 5 process images fixed in predetermined 50vw quadrants.
      //   Images NEVER move vertically, NEVER follow text panels, NEVER animate independently.
      // - LAYER B (Continuous Content Page): One large editorial page containing opening heading,
      //   5 alternating process rows (transparent cutout window opposite blue text panel),
      //   and cream transition panel sliding upward continuously over the stationary images.
      // ========================================================
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        if (!containerRef.current || !contentPageRef.current) return;

        // Initialize Layer A images
        if (discoverImgRef.current) gsap.set(discoverImgRef.current, { opacity: 1 });
        if (defineImgRef.current) gsap.set(defineImgRef.current, { opacity: 1 });
        if (designImgRef.current) gsap.set(designImgRef.current, { opacity: 0 });
        if (buildImgRef.current) gsap.set(buildImgRef.current, { opacity: 0 });
        if (launchImgRef.current) gsap.set(launchImgRef.current, { opacity: 0 });

        // Initialize Layer B continuous page
        gsap.set(contentPageRef.current, { yPercent: 0 });

        // Total scroll distance: 5.5 viewports for smooth, continuous scroll-scrubbed pacing
        const scrollDistance = window.innerHeight * 5.5;

        // Master synchronized scroll-scrubbed timeline (continuous, seamless motion)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            pin: true,
            scrub: 0.35, // Responsive 1:1 scroll tracking without artificial stops
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // ----------------------------------------------------
        // CONTINUOUS UNINTERRUPTED GLIDE OF LAYER B (0.0 -> 6.0)
        // Continuous page glides up smoothly without artificial pauses or velocity resets
        // From Opening statement -> Discover -> Define -> Design -> Build -> Launch -> Warm Ivory
        // ----------------------------------------------------
        tl.to(
          contentPageRef.current,
          {
            yPercent: -(600 / 7),
            duration: 6.0,
            ease: "none",
          },
          0.0
        );

        // ----------------------------------------------------
        // SYNCHRONIZED STATIONARY IMAGE SWAPS IN LAYER A
        // Timed exactly when the corresponding column is 100% occluded by the solid text panel:
        // ----------------------------------------------------
        // 1. At t = 2.0 (Define): Left column is 100% covered by Define's text panel. Swap left image from Discover to Design.
        if (discoverImgRef.current && designImgRef.current) {
          tl.set(discoverImgRef.current, { opacity: 0 }, 2.0);
          tl.set(designImgRef.current, { opacity: 1 }, 2.0);
        }

        // 2. At t = 3.0 (Design): Right column is 100% covered by Design's text panel. Swap right image from Define to Build.
        if (defineImgRef.current && buildImgRef.current) {
          tl.set(defineImgRef.current, { opacity: 0 }, 3.0);
          tl.set(buildImgRef.current, { opacity: 1 }, 3.0);
        }

        // 3. At t = 4.0 (Build): Left column is 100% covered by Build's text panel. Swap left image from Design to Launch.
        if (designImgRef.current && launchImgRef.current) {
          tl.set(designImgRef.current, { opacity: 0 }, 4.0);
          tl.set(launchImgRef.current, { opacity: 1 }, 4.0);
        }
      });

      // ========================================================
      // MOBILE: STACKED TRACK VIEWER (< 1024px)
      // Continuous scroll-linked sliding motion of stacked cards
      // Paced proportionally across all 6 stage transitions
      // ========================================================
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        if (!containerRef.current || !mobileTrackRef.current) return;

        gsap.set(mobileTrackRef.current, { yPercent: 0 });

        // Total 7 panels (Heading + 5 stages + transition panel) = 6 stage transitions.
        // 1.4 viewports per transition (~1050px) gives smooth, readable continuous pacing
        // where a standard thumb swipe advances gradually without skipping stages.
        const getMobileScrollDistance = () => window.innerHeight * 8.4;

        const tlMobile = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${getMobileScrollDistance()}`,
            pin: true,
            scrub: 0.35,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Continuous linear translation of mobile track without artificial holds
        tlMobile.to(
          mobileTrackRef.current,
          {
            yPercent: -(600 / 7),
            duration: 6.0,
            ease: "none",
          },
          0.0
        );
      });

      // ========================================================
      // REDUCED MOTION PREFERENCE
      // ========================================================
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (contentPageRef.current) {
          gsap.set(contentPageRef.current, { yPercent: -(100 / 7) });
        }
        if (mobileTrackRef.current) {
          gsap.set(mobileTrackRef.current, { yPercent: -(100 / 7) });
        }
        if (discoverImgRef.current) gsap.set(discoverImgRef.current, { opacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section
      id="process"
      ref={containerRef}
      data-nav-theme="green"
      className="relative w-full bg-[#102D25] z-10"
    >
      {/* ======================================================== */}
      {/* DESKTOP TWO-LAYER CONTINUOUS COMPOSITION (>= 1024px)     */}
      {/* LAYER A: Stationary Image Canvas (z-0)                   */}
      {/* LAYER B: Continuous Scrolling Content Page (z-20)        */}
      {/* ======================================================== */}
      <div className="hidden lg:block relative w-full h-screen overflow-hidden">
        {/* LAYER A: THE STATIONARY IMAGE CANVAS */}
        <ProcessStationaryCanvas
          discoverRef={discoverImgRef}
          defineRef={defineImgRef}
          designRef={designImgRef}
          buildRef={buildImgRef}
          launchRef={launchImgRef}
        />

        {/* LAYER B: THE CONTINUOUS CONTENT PAGE */}
        <div
          ref={contentPageRef}
          className="absolute top-0 left-0 w-full will-change-transform z-20 pointer-events-auto"
          style={{ height: "700%" }}
        >
          {/* ROW 0: OPENING HEADING & DESCRIPTION */}
          <div className="w-full h-[100vh] relative overflow-hidden">
            <ProcessOpeningHeading />
          </div>

          {/* ROW 01: DISCOVER */}
          {/* Left: Transparent Cutout Window | Right: Discover Panel */}
          <div className="w-full h-[100vh] relative flex flex-row overflow-hidden">
            <div
              className="w-1/2 h-full bg-transparent select-none pointer-events-none"
              aria-hidden="true"
            />
            <div className="w-1/2 h-full relative">
              <ProcessTextPanel stage={PROCESS_STAGES[0]} />
            </div>
          </div>

          {/* ROW 02: DEFINE */}
          {/* Left: Define Panel | Right: Transparent Cutout Window */}
          <div className="w-full h-[100vh] relative flex flex-row overflow-hidden">
            <div className="w-1/2 h-full relative">
              <ProcessTextPanel stage={PROCESS_STAGES[1]} />
            </div>
            <div
              className="w-1/2 h-full bg-transparent select-none pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* ROW 03: DESIGN */}
          {/* Left: Transparent Cutout Window | Right: Design Panel */}
          <div className="w-full h-[100vh] relative flex flex-row overflow-hidden">
            <div
              className="w-1/2 h-full bg-transparent select-none pointer-events-none"
              aria-hidden="true"
            />
            <div className="w-1/2 h-full relative">
              <ProcessTextPanel stage={PROCESS_STAGES[2]} />
            </div>
          </div>

          {/* ROW 04: BUILD */}
          {/* Left: Build Panel | Right: Transparent Cutout Window */}
          <div className="w-full h-[100vh] relative flex flex-row overflow-hidden">
            <div className="w-1/2 h-full relative">
              <ProcessTextPanel stage={PROCESS_STAGES[3]} />
            </div>
            <div
              className="w-1/2 h-full bg-transparent select-none pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* ROW 05: LAUNCH */}
          {/* Left: Transparent Cutout Window | Right: Launch Panel */}
          <div className="w-full h-[100vh] relative flex flex-row overflow-hidden">
            <div
              className="w-1/2 h-full bg-transparent select-none pointer-events-none"
              aria-hidden="true"
            />
            <div className="w-1/2 h-full relative">
              <ProcessTextPanel stage={PROCESS_STAGES[4]} />
            </div>
          </div>

          {/* ROW 06: SEAMLESS TRANSITION INTO #contact */}
          {/* Warm Ivory cover (#F7F4ED) gliding up over Launch and unpinning */}
          <div
            data-nav-theme="cream"
            className="w-full h-[100vh] relative bg-[#F7F4ED]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE STACKED TRACK VIEWER (< 1024px)                   */}
      {/* Stacked cards with natural vertical scroll pushing       */}
      {/* ======================================================== */}
      <div className="lg:hidden relative w-full h-screen overflow-hidden">
        <div
          ref={mobileTrackRef}
          className="w-full relative will-change-transform"
          style={{ height: "700%" }}
        >
          {/* Mobile Panel 0: Opening Heading */}
          <div className="w-full h-[100vh] relative overflow-hidden">
            <ProcessOpeningHeading />
          </div>

          {/* Mobile Panels 1-5: 5 Stages */}
          {PROCESS_STAGES.map((stage, i) => (
            <div key={stage.id} className="w-full h-[100vh] relative overflow-hidden">
              <ProcessMobileStage stage={stage} priority={i === 0} />
            </div>
          ))}

          {/* Mobile Panel 6: Warm Ivory Transition to #contact */}
          <div data-nav-theme="cream" className="w-full h-[100vh] relative bg-[#F7F4ED]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
