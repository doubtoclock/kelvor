"use client";

import { ArrowUpRight } from "lucide-react";
import { useReducedMotion, AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const NAV_LINKS = [
  { name: "Work", href: "#work" },
  { name: "Services", href: "#capabilities" },
  { name: "Process", href: "#process" },
  { name: "About", href: "#about" },
];

export function Navbar() {
  const shouldReduceMotion = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Theme: "green" = STATE A (Over Cream background) | "cream" = STATE B (Over Green background)
  const [theme, setTheme] = useState<"green" | "cream">("green");
  const currentThemeRef = useRef<"green" | "cream">("green");
  const [isEntered, setIsEntered] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const hasAnimatedIn = useRef(false);

  // 1. DROP-DOWN ENTRANCE ANIMATION (Synchronized with KELVOR hero word entrance)
  useEffect(() => {
    if (hasAnimatedIn.current) return;

    const triggerEntrance = () => {
      if (hasAnimatedIn.current || !navRef.current) return;
      hasAnimatedIn.current = true;
      setIsEntered(true);

      if (shouldReduceMotion) {
        gsap.set(navRef.current, { y: 0, opacity: 1 });
        return;
      }

      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          clearProps: "transform",
        }
      );
    };

    window.addEventListener("kelvor-hero-navbar-enter", triggerEntrance, { once: true });

    // Fallback: trigger after 2.4s if the hero event was somehow missed
    const fallbackTimer = setTimeout(triggerEntrance, 2400);

    return () => {
      window.removeEventListener("kelvor-hero-navbar-enter", triggerEntrance);
      clearTimeout(fallbackTimer);
    };
  }, [shouldReduceMotion]);

  // 2. AUTOMATIC BACKGROUND DETECTION & THEME SWITCHING
  useEffect(() => {
    let rafId: number | null = null;

    const checkBackgroundTheme = () => {
      const sampleY = 40;
      const sampleX = window.innerWidth / 2;

      // Sample elements under the top of the viewport
      const elements = document.elementsFromPoint(sampleX, sampleY);

      for (const el of elements) {
        // Skip the navbar itself and any children
        if (navRef.current && (el === navRef.current || navRef.current.contains(el))) {
          continue;
        }
        // Skip loader overlay if present
        if (el.closest('[class*="z-[9999]"]')) {
          continue;
        }

        const themedEl = el.closest("[data-nav-theme]");
        if (themedEl) {
          const bgTheme = themedEl.getAttribute("data-nav-theme");
          // If the section background is green, the navbar must be cream (STATE B)
          // If the section background is cream, the navbar must be green (STATE A)
          const targetNavTheme: "green" | "cream" = bgTheme === "green" ? "cream" : "green";
          if (targetNavTheme !== currentThemeRef.current) {
            currentThemeRef.current = targetNavTheme;
            setTheme(targetNavTheme);
          }
          return;
        }
      }

      // Default to green navbar (over cream)
      if (currentThemeRef.current !== "green") {
        currentThemeRef.current = "green";
        setTheme("green");
      }
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        checkBackgroundTheme();
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Initial check
    checkBackgroundTheme();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Color Tokens based on STATE A (Green Navbar) vs STATE B (Cream Navbar)
  const isGreenTheme = theme === "green";

  return (
    <>
      <nav 
        ref={navRef}
        aria-label="Main Navigation"
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 min-[360px]:px-6 py-4 md:py-4.5 lg:px-12 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isGreenTheme
            ? "bg-[#073B30]/95 border-b border-[rgba(247,245,236,0.12)] shadow-[0_4px_24px_rgba(7,59,48,0.20)]"
            : "bg-[#F7F5EC]/95 border-b border-[rgba(7,59,48,0.10)] shadow-[0_4px_24px_rgba(7,59,48,0.06)]"
        }`}
        style={{
          transform: isEntered ? "none" : "translateY(-100%)",
          opacity: isEntered ? 1 : 0,
          willChange: "transform, opacity",
        }}
      >
        {/* Wordmark: KELVOR. */}
        <a 
          href="#home" 
          className={`select-none flex items-baseline tracking-tight font-display font-extrabold text-[22px] md:text-[25px] transition-colors duration-300 outline-none focus-visible:ring-2 rounded-sm ${
            isGreenTheme
              ? "text-[#F7F5EC] focus-visible:ring-[#F4B9A8]"
              : "text-[#073B30] focus-visible:ring-[#36A987]"
          }`}
        >
          <span>KELVOR</span>
          <span 
            className={`w-1.5 h-1.5 rounded-full inline-block ml-0.5 transition-colors duration-300 ${
              isGreenTheme ? "bg-[#F4B9A8]" : "bg-[#36A987]"
            }`} 
          />
        </a>

        {/* Desktop Navigation Links: Work, Services, Process, About */}
        <div className="hidden md:flex items-center gap-8 lg:gap-11 xl:gap-12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`group/link relative py-1 text-[15.5px] lg:text-[16px] font-medium tracking-[-0.01em] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm ${
                isGreenTheme
                  ? "text-[#F7F5EC] hover:text-[#F4B9A8] focus-visible:ring-[#F4B9A8]"
                  : "text-[#073B30] hover:text-[#36A987] focus-visible:ring-[#36A987]"
              }`}
            >
              <span>{link.name}</span>
              {/* Expanding Underline Hover Indicator */}
              <span 
                className={`absolute left-0 bottom-[-2px] w-full h-[1.5px] scale-x-0 origin-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100 rounded-full ${
                  isGreenTheme ? "bg-[#F4B9A8]" : "bg-[#36A987]"
                }`} 
              />
            </a>
          ))}
        </div>

        {/* Right: Pill Button "Let's talk ↗" */}
        <div className="hidden md:flex items-center">
          <a
            href="#contact"
            className={`group/btn text-[14px] font-medium px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all duration-300 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              isGreenTheme
                ? "bg-[#F7F5EC] text-[#073B30] hover:bg-[#FFEAE2] focus-visible:ring-[#F7F5EC]"
                : "bg-[#073B30] text-[#F7F5EC] hover:bg-[#176B55] focus-visible:ring-[#073B30]"
            }`}
          >
            <span>Let&apos;s talk</span>
            <ArrowUpRight 
              strokeWidth={2.2} 
              className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" 
            />
          </a>
        </div>

        {/* Mobile Hamburger Menu Trigger */}
        <div className="md:hidden flex items-center shrink-0">
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`w-[44px] h-[44px] rounded-full border flex flex-col items-center justify-center gap-1 transition-colors duration-300 outline-none focus-visible:ring-2 shrink-0 ${
              isGreenTheme
                ? "text-[#F7F5EC] border-[#F7F5EC]/30 hover:bg-[#F7F5EC]/10 focus-visible:ring-[#F4B9A8]"
                : "text-[#073B30] border-[#073B30]/30 hover:bg-[#073B30]/10 focus-visible:ring-[#36A987]"
            }`}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-overlay"
          >
            <span className="sr-only">{isMobileMenuOpen ? "Close Menu" : "Open Menu"}</span>
            <span className="w-[18px] h-[1.75px] rounded-full bg-current" />
            <span className="w-[18px] h-[1.75px] rounded-full bg-current" />
            <span className="w-[18px] h-[1.75px] rounded-full bg-current" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            id="mobile-navigation-overlay"
            className="fixed inset-0 z-[100] flex flex-col bg-[#F7F5ED] px-6 py-7 text-[#171C19]"
          >
            <div className="flex items-center justify-between">
              <a 
                href="#home" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="select-none flex items-baseline tracking-tight font-display font-extrabold text-2xl text-[#171C19]"
              >
                <span>KELVOR</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#176B56] inline-block ml-0.5" />
              </a>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-semibold tracking-wider text-[#171C19] uppercase px-3 py-1.5 border border-[#171C19]/20 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close navigation menu"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col items-start gap-7 mt-16 text-2xl font-normal tracking-wide text-[#171C19]">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#176B56] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="w-full h-[1px] bg-[#DEDCD2] my-2" />

              <a 
                href="#contact" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="bg-[#176B56] hover:bg-[#0B493C] text-[#FFFFFF] text-base font-medium px-6 py-3 rounded-full flex items-center gap-2"
              >
                <span>Let&apos;s talk</span>
                <ArrowUpRight strokeWidth={2} className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
