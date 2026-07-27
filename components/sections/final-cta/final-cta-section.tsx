"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";

export function FinalCTASection() {
  const containerRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
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
    "MVP Build",
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

    // Note: User explicitly requested this exact syntax for the Vite environment variable
    // We add a safe fallback just in case this is running under standard Next.js
    const accessKey = (typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env.VITE_WEB3FORMS_ACCESS_KEY : process.env.VITE_WEB3FORMS_ACCESS_KEY) || process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    
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

  // Register GSAP plugin client-side
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Reduced-motion: instant show
    mm.add("(prefers-reduced-motion: reduce)", () => {
      [eyebrowRef.current, headlineRef.current, supportRef.current, ctaRef.current].forEach(el => {
        if (el) gsap.set(el, { opacity: 1, y: 0 });
      });
    });

    // Normal motion: staggered entrance & floating
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });
      
      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .fromTo(headlineRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.2)
        .fromTo(supportRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.4)
        .fromTo(ctaRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.5);
    });
  }, { scope: containerRef });

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full min-h-[100svh] lg:min-h-screen flex flex-col justify-end pt-32 px-6 lg:px-12 z-10 overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-start w-full max-w-[1400px] mx-auto mt-auto pt-[15vh] pb-16 md:pb-24">
        <div 
          ref={eyebrowRef} 
          className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-muted mb-8 md:mb-10"
        >
          HAVE A PROJECT IN MIND?
        </div>

        <h2
          ref={headlineRef}
          className="text-4xl md:text-5xl lg:text-[60px] xl:text-[72px] font-normal leading-[1.05] tracking-tight text-foreground text-left mb-6 md:mb-8 max-w-[900px]"
        >
          Let&apos;s build something<br />worth remembering.
        </h2>

        <div
          ref={supportRef}
          className="text-base md:text-lg text-muted/80 text-left mb-6 md:mb-8 max-w-[500px]"
        >
          Have an ambitious idea? Tell us what you&apos;re building.
        </div>

        <form 
          ref={ctaRef}
          className="w-full flex flex-col gap-8 md:gap-10"
          onSubmit={handleFormSubmit}
        >
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 w-full">
            <div className="flex flex-col gap-4 relative">
              <label className="text-[11px] md:text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                FULL NAME *
              </label>
              <input 
                type="text" 
                name="name"
                placeholder="Jane Doe"
                className="w-full bg-transparent border-b border-white/20 pb-4 text-base md:text-lg text-white font-medium placeholder:font-normal placeholder:text-muted-foreground/50 focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-4 relative">
              <label className="text-[11px] md:text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                EMAIL ADDRESS *
              </label>
              <input 
                type="email" 
                name="email"
                placeholder="hello@example.com"
                className="w-full bg-transparent border-b border-white/20 pb-4 text-base md:text-lg text-white font-medium placeholder:font-normal placeholder:text-muted-foreground/50 focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 w-full">
            <div className="flex flex-col gap-4 relative">
              <label className="text-[11px] md:text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
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
                  className="w-full flex items-center justify-between bg-transparent border-b border-white/20 pb-4 text-base md:text-lg focus:outline-none focus:border-white transition-colors cursor-pointer"
                >
                  <span className={selectedProjectType ? "text-white font-medium" : "text-muted-foreground/50"}>
                    {selectedProjectType || "Select an option"}
                  </span>
                  <div className={`opacity-50 text-[#F5F5F5] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

                <div 
                  id="project-type-listbox"
                  role="listbox"
                  className={`absolute left-0 right-0 top-[calc(100%+8px)] w-full bg-[#0A0A0C] border border-white/10 rounded-md py-2 z-50 transition-all duration-200 origin-top shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${isDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
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
                          ? "bg-white/10 text-[#F5F5F5]" 
                          : focusedDropdownIndex === index
                            ? "bg-white/5 text-white"
                            : "text-[#F5F5F5]/80"
                      }`}
                    >
                      <span className="text-[15px]">{type}</span>
                      {selectedProjectType === type && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 relative">
              <label className="text-[11px] md:text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                BUDGET (OPTIONAL)
              </label>
              <input 
                type="text" 
                name="budget"
                placeholder="Select budget range"
                className="w-full bg-transparent border-b border-white/20 pb-4 text-base md:text-lg text-white font-medium placeholder:font-normal placeholder:text-muted-foreground/50 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-4 relative">
              <label className="text-[11px] md:text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                TIMELINE
              </label>
              <input 
                type="text" 
                name="timeline"
                placeholder="3-6 months"
                className="w-full bg-transparent border-b border-white/20 pb-4 text-base md:text-lg text-white font-medium placeholder:font-normal placeholder:text-muted-foreground/50 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col gap-4 relative w-full">
            <label className="text-[11px] md:text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              PROJECT DETAILS
            </label>
            <textarea 
              name="message"
              placeholder="Tell us about the idea, problem, or product..."
              className="w-full min-h-[64px] bg-transparent border-b border-white/20 pb-4 text-base md:text-lg text-white font-medium placeholder:font-normal placeholder:text-muted-foreground/50 focus:outline-none focus:border-white transition-colors resize-y"
              required
            />
          </div>

          <div className="flex flex-col items-start gap-4">
            <ButtonWithIcon 
              type="submit" 
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-70 pointer-events-none" : ""}
            >
              {isSubmitting ? "SENDING..." : "START A PROJECT"}
            </ButtonWithIcon>
            
            {submitStatus === "success" && (
              <div className="text-[13px] md:text-[14px] text-muted-foreground tracking-wide font-medium mt-2">
                Thanks — we&apos;ll be in touch soon.
              </div>
            )}
            {submitStatus === "error" && (
              <div className="text-[13px] md:text-[14px] text-red-400/80 tracking-wide font-medium mt-2">
                Something went wrong. Please try again.
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
