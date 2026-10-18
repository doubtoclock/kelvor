"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function FinalCTASection() {
  const containerRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineWrapperRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
  const formApertureRef = useRef<HTMLDivElement>(null);
  const slitLineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLFormElement>(null);

  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState<string | null>(null);
  const [focusedDropdownIndex, setFocusedDropdownIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const PROJECT_TYPES = [
    "Product Strategy & Design",
    "Web & Creative Development",
    "Full-Stack Engineering",
    "MVP Build & Launch",
    "AI Automation & Integrations",
    "Other"
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsDropdownOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        setIsDropdownOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedDropdownIndex(prev => prev === null || prev === PROJECT_TYPES.length - 1 ? 0 : prev + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedDropdownIndex(prev => prev === null || prev === 0 ? PROJECT_TYPES.length - 1 : prev - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (focusedDropdownIndex !== null) {
          setSelectedProjectType(PROJECT_TYPES[focusedDropdownIndex]);
          setIsDropdownOpen(false);
        }
        break;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    setSubmitStatus("idle");

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const project_type = selectedProjectType;
    const budget = formData.get("budget") as string;
    const timeline = formData.get("timeline") as string;
    const message = formData.get("message") as string;

    // Validation
    if (!name || !name.trim() || !email || !email.trim() || !project_type || !message || !message.trim()) {
      setSubmitStatus("error");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitStatus("error");
      return;
    }

    const accessKey =
      (typeof import.meta !== "undefined" && (import.meta as any).env
        ? (import.meta as any).env.VITE_WEB3FORMS_ACCESS_KEY
        : process.env.VITE_WEB3FORMS_ACCESS_KEY) ||
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey) {
      console.error("Missing Web3Forms Access Key");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          project_type,
          budget,
          timeline,
          message,
          subject: "New Project Inquiry — Kelvor",
          from_name: "Kelvor Website",
        }),
      });

      const json = await response.json();
      
      if (response.status === 200 && json.success) {
        setSubmitStatus("success");
        form.reset();
        setSelectedProjectType(null);
      } else {
        console.error("Web3Forms error:", json);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Network error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================================
  // CINEMATIC SCROLL-CONTROLLED CTA ANIMATION ORCHESTRATION
  // ========================================================
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // 1. REDUCED MOTION PREFERENCE
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (introRef.current) gsap.set(introRef.current, { display: "none" });
        if (headlineWrapperRef.current) gsap.set(headlineWrapperRef.current, { y: 0 });
        if (line1Ref.current) gsap.set(line1Ref.current, { x: 0 });
        if (line2Ref.current) gsap.set(line2Ref.current, { x: 0 });
        if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
        if (supportRef.current) gsap.set(supportRef.current, { opacity: 1, y: 0 });
        if (formApertureRef.current) gsap.set(formApertureRef.current, { clipPath: "none", opacity: 1 });
        if (slitLineRef.current) gsap.set(slitLineRef.current, { display: "none" });
      });

      // 2. NORMAL MOTION: CINEMATIC 4-PHASE SCROLL-SCRUBBED EXPERIENCE
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!containerRef.current || !headlineWrapperRef.current || !formApertureRef.current) return;

        // Compute vertical offset to place headline in the exact vertical center of viewport
        const getCenterOffset = () => {
          if (typeof window === "undefined" || !headlineWrapperRef.current || !containerRef.current) return 0;
          const containerRect = containerRef.current.getBoundingClientRect();
          const headlineRect = headlineWrapperRef.current.getBoundingClientRect();
          const currentY = (gsap.getProperty(headlineWrapperRef.current, "y") as number) || 0;
          // Untransformed static center relative to container top
          const currentCenter = headlineRect.top - containerRect.top - currentY + headlineRect.height / 2;
          const targetCenter = window.innerHeight / 2;
          return Math.max(0, targetCenter - currentCenter);
        };

        const getTravelDistance = () => {
          if (typeof window === "undefined") return 1600;
          return Math.max(window.innerWidth * 1.15, window.innerWidth + 100);
        };

        // Initial setup
        gsap.set(introRef.current, { opacity: 0, y: 30, display: "flex" });
        gsap.set(eyebrowRef.current, { opacity: 0, y: 15 });
        gsap.set(supportRef.current, { opacity: 0, y: 15 });
        gsap.set(formApertureRef.current, {
          clipPath: "ellipse(95% 0% at 50% 50%)",
          opacity: 0,
        });
        if (slitLineRef.current) {
          gsap.set(slitLineRef.current, { opacity: 0, scaleX: 0 });
        }
        gsap.set(headlineWrapperRef.current, { y: () => getCenterOffset() });
        gsap.set(line1Ref.current, { x: () => -getTravelDistance() });
        gsap.set(line2Ref.current, { x: () => getTravelDistance() });

        const scrollDistance = window.innerHeight * 2.5;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress < 0.90 && isDropdownOpen) {
                setIsDropdownOpen(false);
              }
            },
          },
        });

        // ----------------------------------------------------
        // PHASE 1: "Came this far?" Centered Intro (0.00 -> 0.34)
        // Exact text centered horizontally & vertically in viewport
        // ----------------------------------------------------
        tl.fromTo(
          introRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" },
          0.00
        );
        // Deliberate pause / hold in center
        tl.to({}, { duration: 0.12 }, 0.12);
        // Fade out before headline arrives
        tl.to(
          introRef.current,
          { opacity: 0, y: -25, duration: 0.10, ease: "power2.in" },
          0.24
        );
        tl.set(introRef.current, { display: "none" }, 0.34);

        // ----------------------------------------------------
        // PHASE 2: Two-Part Independent Headline Motion (0.36 -> 0.70)
        // Line 1: Starts outside viewport on LEFT -> moves to center
        // Line 2: Starts outside viewport on RIGHT -> moves to center
        // Both arrive simultaneously at 0.60 to form balanced headline
        // Completed headline holds centered (0.60 -> 0.70)
        // ----------------------------------------------------
        tl.fromTo(
          line1Ref.current,
          { x: () => -getTravelDistance() },
          { x: 0, duration: 0.24, ease: "power1.out" },
          0.36
        );
        tl.fromTo(
          line2Ref.current,
          { x: () => getTravelDistance() },
          { x: 0, duration: 0.24, ease: "power1.out" },
          0.36
        );

        // Hold completed headline centered in viewport
        tl.to({}, { duration: 0.10 }, 0.60);

        // ----------------------------------------------------
        // PHASE 3: Eye-Opening Reveal & Headline Elevation (0.70 -> 0.92)
        // Headline glides up into final header position
        // Eyebrow and support text fade in
        // Contact form opens through centered vertical eye aperture
        // ----------------------------------------------------
        tl.fromTo(
          headlineWrapperRef.current,
          { y: () => getCenterOffset() },
          { y: 0, duration: 0.22, ease: "power2.inOut" },
          0.70
        );

        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" },
          0.72
        );

        tl.fromTo(
          supportRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" },
          0.74
        );

        // Subtle aperture slit appears along center horizontal axis
        if (slitLineRef.current) {
          tl.fromTo(
            slitLineRef.current,
            { opacity: 0, scaleX: 0 },
            { opacity: 0.5, scaleX: 1, duration: 0.04, ease: "power1.out" },
            0.68
          );
          tl.to(
            slitLineRef.current,
            { opacity: 0, duration: 0.10, ease: "power2.in" },
            0.74
          );
        }

        // Form container aperture expands symmetrically from center outward like eyelids parting
        tl.fromTo(
          formApertureRef.current,
          { clipPath: "ellipse(95% 0% at 50% 50%)", opacity: 1 },
          {
            clipPath: "ellipse(150% 120% at 50% 50%)",
            opacity: 1,
            duration: 0.22,
            ease: "power2.inOut",
          },
          0.70
        );

        // At 0.92, clear clipPath so form is completely unconstrained and interactive
        tl.set(formApertureRef.current, { clipPath: "none" }, 0.92);

        // ----------------------------------------------------
        // PHASE 4: Settled Hold before unpinning (0.92 -> 1.00)
        // ----------------------------------------------------
        tl.to({}, { duration: 0.08 }, 0.92);
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section
      id="contact"
      ref={containerRef}
      data-nav-theme="cream"
      className="relative w-full min-h-screen bg-[#F7F4ED] z-50 overflow-hidden select-none"
    >
      {/* ======================================================== */}
      {/* PHASE 1: CENTERED INTRODUCTION ("Came this far?")         */}
      {/* Centered horizontally and vertically within the viewport  */}
      {/* ======================================================== */}
      <div
        ref={introRef}
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-6 text-center select-none"
        aria-hidden="true"
      >
        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-medium tracking-tight text-[#222722]">
          Came this far?
        </span>
      </div>

      {/* ======================================================== */}
      {/* MAIN CTA CONTENT: HEADLINE & EYE-OPENING CONTACT FORM     */}
      {/* ======================================================== */}
      <div
        ref={contentWrapperRef}
        className="relative z-10 w-full min-h-screen flex flex-col justify-center px-4 min-[360px]:px-6 lg:px-12 py-10 sm:py-14 md:py-20 lg:py-24 select-text"
      >
        <div className="relative flex flex-col items-center text-center w-full max-w-[1200px] mx-auto">
          {/* Eyebrow Label */}
          <div
            ref={eyebrowRef}
            className="text-xs md:text-sm font-mono font-semibold tracking-[0.2em] uppercase text-[#626A63] mb-4 sm:mb-6 md:mb-8 will-change-transform"
          >
            HAVE A PROJECT IN MIND?
          </div>

          {/* ======================================================== */}
          {/* PHASE 2: TWO-PART INDEPENDENT HORIZONTAL HEADLINE        */}
          {/* Line 1 travels from outside viewport on LEFT             */}
          {/* Line 2 travels from outside viewport on RIGHT            */}
          {/* Arrive simultaneously at center, then hold               */}
          {/* ======================================================== */}
          <div
            ref={headlineWrapperRef}
            className="flex flex-col items-center justify-center w-full mb-4 sm:mb-6 md:mb-8 will-change-transform"
          >
            {/* LINE 1: "Let's build something" */}
            <div className="w-full overflow-visible flex justify-center py-1">
              <h2
                ref={line1Ref}
                className="text-[21px] min-[360px]:text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-[60px] xl:text-[72px] font-display font-medium leading-[1.08] tracking-tight text-[#222722] text-center whitespace-nowrap will-change-transform"
              >
                Let&apos;s build something
              </h2>
            </div>

            {/* LINE 2: "worth remembering." */}
            <div className="w-full overflow-visible flex justify-center py-1">
              <h2
                ref={line2Ref}
                className="text-[21px] min-[360px]:text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-[60px] xl:text-[72px] font-display font-medium leading-[1.08] tracking-tight text-[#222722] text-center whitespace-nowrap will-change-transform"
              >
                worth remembering.
              </h2>
            </div>
          </div>

          {/* Support Statement */}
          <div
            ref={supportRef}
            className="text-base md:text-lg font-body text-[#39473F] text-center mb-6 sm:mb-8 md:mb-10 max-w-[500px] will-change-transform"
          >
            Have an ambitious idea? Tell us what you&apos;re building.
          </div>

          {/* ======================================================== */}
          {/* PHASE 3: EYE-OPENING APERTURE REVEAL OF CONTACT FORM     */}
          {/* Form is placed in final layout, revealed vertically      */}
          {/* from narrow horizontal center slit outward like an eye   */}
          {/* ======================================================== */}
          <div
            ref={formApertureRef}
            className="w-full relative will-change-transform text-left"
          >
            {/* Center Aperture Accent Seam (dissolves as eyelids open) */}
            <div
              ref={slitLineRef}
              className="absolute left-6 right-6 md:left-12 md:right-12 top-1/2 -translate-y-1/2 h-[1px] bg-[#176B55]/30 pointer-events-none z-20 will-change-transform"
              aria-hidden="true"
            />

            <form
              ref={ctaRef}
              className="w-full flex flex-col gap-6 sm:gap-8 md:gap-10"
              onSubmit={handleFormSubmit}
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 md:gap-16 w-full">
                <div className="flex flex-col gap-4 relative">
                  <label className="text-[11px] md:text-xs font-mono font-semibold tracking-[0.1em] text-[#626A63] uppercase">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Jane Doe"
                    className="w-full bg-transparent border-b border-[#DEDCD2] pb-4 text-base md:text-lg text-[#222722] font-medium placeholder:font-normal placeholder:text-[#626A63] transition-colors duration-300 hover:border-[#64A98E] focus:outline-none focus:border-[#176B55] focus-visible:outline-none focus-visible:border-[#176B55]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-4 relative">
                  <label className="text-[11px] md:text-xs font-mono font-semibold tracking-[0.1em] text-[#626A63] uppercase">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="hello@example.com"
                    className="w-full bg-transparent border-b border-[#DEDCD2] pb-4 text-base md:text-lg text-[#222722] font-medium placeholder:font-normal placeholder:text-[#626A63] transition-colors duration-300 hover:border-[#64A98E] focus:outline-none focus:border-[#176B55] focus-visible:outline-none focus-visible:border-[#176B55]"
                    required
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 md:gap-16 w-full">
                <div className="flex flex-col gap-4 relative">
                  <label className="text-[11px] md:text-xs font-mono font-semibold tracking-[0.1em] text-[#626A63] uppercase">
                    PROJECT TYPE
                  </label>
                  <div className="relative w-full" ref={dropdownRef}>
                    <div
                      role="combobox"
                      aria-expanded={isDropdownOpen}
                      aria-controls="project-type-listbox"
                      aria-haspopup="listbox"
                      tabIndex={0}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      onKeyDown={handleDropdownKeyDown}
                      className="w-full flex items-center justify-between bg-transparent border-b border-[#DEDCD2] pb-4 text-base md:text-lg transition-colors duration-300 hover:border-[#64A98E] focus:outline-none focus:border-[#176B55] focus-visible:outline-none focus-visible:border-[#176B55] cursor-pointer"
                    >
                      <span className={selectedProjectType ? "text-[#222722] font-medium" : "text-[#626A63]"}>
                        {selectedProjectType || "Select an option"}
                      </span>
                      <div className={`opacity-60 text-[#222722] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>

                    <div
                      id="project-type-listbox"
                      role="listbox"
                      className={`absolute left-0 right-0 top-[calc(100%+8px)] w-full bg-[#FFFCF7] border border-[#DEDCD2] rounded-md py-2 z-50 transition-all duration-200 origin-top shadow-[0_12px_36px_rgba(16,45,37,0.10)] ${
                        isDropdownOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
                      }`}
                    >
                      {PROJECT_TYPES.map((type, index) => (
                        <div
                          key={type}
                          role="option"
                          aria-selected={selectedProjectType === type}
                          onClick={() => {
                            setSelectedProjectType(type);
                            setIsDropdownOpen(false);
                          }}
                          onMouseEnter={() => setFocusedDropdownIndex(index)}
                          className={`flex items-center justify-between px-4 h-[44px] cursor-pointer transition-colors ${
                            selectedProjectType === type
                              ? "bg-[#176B55]/10 text-[#176B55] font-medium"
                              : focusedDropdownIndex === index
                                ? "bg-[#E2F2E9] text-[#222722]"
                                : "text-[#222722]/80 hover:bg-[#E2F2E9]"
                          }`}
                        >
                          <span className="text-[15px]">{type}</span>
                          {selectedProjectType === type && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#176B55]">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 relative">
                  <label className="text-[11px] md:text-xs font-mono font-semibold tracking-[0.1em] text-[#626A63] uppercase">
                    BUDGET (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    name="budget"
                    placeholder="Select budget range"
                    className="w-full bg-transparent border-b border-[#DEDCD2] pb-4 text-base md:text-lg text-[#222722] font-medium placeholder:font-normal placeholder:text-[#626A63] transition-colors duration-300 hover:border-[#64A98E] focus:outline-none focus:border-[#176B55] focus-visible:outline-none focus-visible:border-[#176B55]"
                  />
                </div>

                <div className="flex flex-col gap-4 relative">
                  <label className="text-[11px] md:text-xs font-mono font-semibold tracking-[0.1em] text-[#626A63] uppercase">
                    TIMELINE
                  </label>
                  <input
                    type="text"
                    name="timeline"
                    placeholder="3-6 months"
                    className="w-full bg-transparent border-b border-[#DEDCD2] pb-4 text-base md:text-lg text-[#222722] font-medium placeholder:font-normal placeholder:text-[#626A63] transition-colors duration-300 hover:border-[#64A98E] focus:outline-none focus:border-[#176B55] focus-visible:outline-none focus-visible:border-[#176B55]"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex flex-col gap-4 relative w-full">
                <label className="text-[11px] md:text-xs font-mono font-semibold tracking-[0.1em] text-[#626A63] uppercase">
                  PROJECT DETAILS
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us about the idea, problem, or product..."
                  className="w-full min-h-[64px] bg-transparent border-b border-[#DEDCD2] pb-4 text-base md:text-lg text-[#222722] font-medium placeholder:font-normal placeholder:text-[#626A63] transition-colors duration-300 hover:border-[#64A98E] focus:outline-none focus:border-[#176B55] focus-visible:outline-none focus-visible:border-[#176B55] resize-y"
                  required
                />
              </div>

              <div className="flex flex-col items-start gap-4">
                <ButtonWithIcon
                  type="submit"
                  disabled={isSubmitting}
                  variant="dark"
                  className={isSubmitting ? "opacity-70 pointer-events-none" : ""}
                >
                  {isSubmitting ? "SENDING..." : "START A PROJECT"}
                </ButtonWithIcon>

                {submitStatus === "success" && (
                  <div className="text-[13px] md:text-[14px] text-[#176B55] tracking-wide font-medium mt-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#FFCFB8]" />
                    Thanks — we&apos;ll be in touch soon.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="text-[13px] md:text-[14px] text-[#C87555] tracking-wide font-medium mt-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#C87555]" />
                    Something went wrong. Please try again.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
