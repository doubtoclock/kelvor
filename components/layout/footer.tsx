"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const columnsRef = useRef<HTMLDivElement[]>([]);
  const typographySectionRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      columnsRef.current.forEach((col) => {
        if (col) gsap.set(col, { opacity: 1, y: 0 });
      });
      lettersRef.current.forEach((letter) => {
        if (letter) gsap.set(letter, { opacity: 1, yPercent: 0 });
      });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Existing footer columns entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });

      tl.fromTo(
        columnsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" }
      );

      // 2. Oversized typography letter-by-letter reveal
      // Sequence: 1. R, 2. O, 3. V, 4. L, 5. E, 6. K
      const animatedLetters = [
        lettersRef.current[5], // R
        lettersRef.current[4], // O
        lettersRef.current[3], // V
        lettersRef.current[2], // L
        lettersRef.current[1], // E
        lettersRef.current[0], // K
      ].filter(Boolean) as HTMLSpanElement[];

      const tlReveal = gsap.timeline({
        scrollTrigger: {
          trigger: typographySectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tlReveal.fromTo(
        animatedLetters,
        {
          yPercent: -120,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.09,
          ease: "power2.out",
        }
      );
    });
  }, { scope: containerRef });

  return (
    <footer 
      ref={containerRef} 
      data-nav-theme="green"
      className="relative w-full overflow-hidden flex flex-col z-10"
    >
      {/* TOP FOOTER CONTENT (Information Grid & Micro Utility Row) */}
      <div className="w-full bg-[#176B55] border-t border-[rgba(247,244,237,0.24)] pt-7 sm:pt-9 md:pt-16 pb-5 sm:pb-6 md:pb-12 text-[#F7F4ED]">
        <div className="max-w-[1400px] mx-auto w-full px-4 min-[360px]:px-6 lg:px-12 flex flex-col gap-6 sm:gap-8 md:gap-16">
          
          {/* Top Information Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-x-4 min-[360px]:gap-x-8 gap-y-6 sm:gap-y-7 lg:gap-16">
            
            {/* LEFT: Brand Statement & Email */}
            <div ref={(el) => { if (el) columnsRef.current[0] = el; }} className="col-span-2 lg:col-span-1 flex flex-col justify-start">
              <h3 className="text-xl md:text-2xl font-display font-semibold tracking-tight text-[#F7F4ED] mb-2 sm:mb-3">Kelvor</h3>
              <p className="text-[14px] md:text-[15px] font-body leading-[1.6] text-[#E2F2E9] max-w-[320px] mb-4 sm:mb-5 md:mb-8">
                Independent product studio building thoughtful digital products.
              </p>
              <a 
                href="mailto:hello@kelvor.co.in" 
                className="group flex items-center text-[15px] md:text-[16px] font-body font-medium tracking-tight text-[#F7F4ED] hover:text-[#FFCFB8] transition-all duration-300 ease-out w-fit"
              >
                <Mail className="w-[18px] h-[18px] mr-3 text-[#E2F2E9] group-hover:text-[#FFCFB8] transition-colors duration-300 ease-out" strokeWidth={2} />
                hello@kelvor.co.in
                <svg className="w-[18px] h-[18px] ml-1.5 text-[#E2F2E9]/70 group-hover:text-[#FFCFB8] transition-all duration-300 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 19L19 5M19 5v9M19 5H10" />
                </svg>
              </a>
            </div>

            {/* CENTER: Explore */}
            <div ref={(el) => { if (el) columnsRef.current[1] = el; }} className="col-span-1 flex flex-col lg:pl-4">
              <h4 className="text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.2em] uppercase text-[#E2F2E9]/80 mb-3 sm:mb-4 md:mb-5">Explore</h4>
              <nav className="flex flex-col space-y-2 sm:space-y-2.5 md:space-y-3 font-body">
                <a href="#work" className="text-[13px] md:text-[14px] leading-none text-[#F7F4ED] hover:text-[#FFCFB8] transition-all duration-300 ease-out hover:translate-x-[2px] w-fit">Work</a>
                <a href="#capabilities" className="text-[13px] md:text-[14px] leading-none text-[#F7F4ED] hover:text-[#FFCFB8] transition-all duration-300 ease-out hover:translate-x-[2px] w-fit">Capabilities</a>
                <a href="#process" className="text-[13px] md:text-[14px] leading-none text-[#F7F4ED] hover:text-[#FFCFB8] transition-all duration-300 ease-out hover:translate-x-[2px] w-fit">Process</a>
                <a href="#about" className="text-[13px] md:text-[14px] leading-none text-[#F7F4ED] hover:text-[#FFCFB8] transition-all duration-300 ease-out hover:translate-x-[2px] w-fit">About</a>
              </nav>
            </div>

            {/* RIGHT: Connect */}
            <div ref={(el) => { if (el) columnsRef.current[2] = el; }} className="col-span-1 flex flex-col lg:pl-4">
              <h4 className="text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.2em] uppercase text-[#E2F2E9]/80 mb-3 sm:mb-4 md:mb-5">Connect</h4>
              <nav className="flex flex-col space-y-2 sm:space-y-2.5 md:space-y-3 font-body">
                <a href="https://www.linkedin.com/company/kelvor-tech/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-[13px] md:text-[14px] leading-none text-[#F7F4ED] hover:text-[#FFCFB8] transition-all duration-300 ease-out hover:translate-x-[2px] w-fit">
                  <svg className="w-4 h-4 text-[#E2F2E9] group-hover:text-[#FFCFB8] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  LinkedIn
                </a>
                <a href="https://x.com/KelvorTech" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-[13px] md:text-[14px] leading-none text-[#F7F4ED] hover:text-[#FFCFB8] transition-all duration-300 ease-out hover:translate-x-[2px] w-fit">
                  <span className="flex items-center justify-center w-4 h-4 font-bold text-[14px] text-[#E2F2E9] group-hover:text-[#FFCFB8] transition-colors duration-300 leading-none pb-[1px]">X</span>
                  X
                </a>
                <a href="#" className="group flex items-center gap-3 text-[13px] md:text-[14px] leading-none text-[#F7F4ED] hover:text-[#FFCFB8] transition-all duration-300 ease-out hover:translate-x-[2px] w-fit">
                  <svg className="w-4 h-4 text-[#E2F2E9] group-hover:text-[#FFCFB8] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  Instagram
                </a>
              </nav>
            </div>

          </div>

          {/* Micro Utility Row */}
          <div ref={(el) => { if (el) columnsRef.current[3] = el; }} className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center text-[12px] md:text-[13px] font-mono text-[#E2F2E9] tracking-wide gap-2.5 sm:gap-0 pt-4 sm:pt-5 md:pt-8 border-t border-[rgba(247,244,237,0.24)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-12">
              <span>© 2026 Kelvor Studio</span>
              <span>India / Working Globally</span>
            </div>
            <div className="flex gap-5 sm:gap-8">
              <a href="#" className="hover:text-[#FFCFB8] transition-colors duration-300">Privacy</a>
              <a href="#" className="hover:text-[#FFCFB8] transition-colors duration-300">Terms</a>
            </div>
          </div>

        </div>
      </div>

      {/* EXTENSION: CINEMATIC OVERSIZED KELVOR TYPOGRAPHY REVEAL */}
      <div
        ref={typographySectionRef}
        className="relative w-full overflow-hidden flex flex-col items-center justify-center min-h-[22vh] sm:min-h-[28vh] md:min-h-[65vh] lg:min-h-[75vh] py-8 sm:py-12 md:py-24 lg:py-32 bg-[#102D25]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(23, 107, 85, 0.28) 0%, #102D25 72%)",
        }}
      >
        <div className="w-full flex items-center justify-center overflow-x-hidden select-none pointer-events-none px-4 sm:px-6">
          <div className="footer-reveal-word" aria-label="Kelvor">
            <span className="footer-reveal-letter-wrap footer-reveal-letter-wrap--k">
              <span
                ref={(el) => { lettersRef.current[0] = el; }}
                className="footer-reveal-letter"
                data-letter="K"
              >
                K
              </span>
            </span>
            <span className="footer-reveal-letter-wrap footer-reveal-letter-wrap--e">
              <span
                ref={(el) => { lettersRef.current[1] = el; }}
                className="footer-reveal-letter"
                data-letter="E"
              >
                E
              </span>
            </span>
            <span className="footer-reveal-letter-wrap footer-reveal-letter-wrap--l">
              <span
                ref={(el) => { lettersRef.current[2] = el; }}
                className="footer-reveal-letter"
                data-letter="L"
              >
                L
              </span>
            </span>
            <span className="footer-reveal-letter-wrap footer-reveal-letter-wrap--v">
              <span
                ref={(el) => { lettersRef.current[3] = el; }}
                className="footer-reveal-letter"
                data-letter="V"
              >
                V
              </span>
            </span>
            <span className="footer-reveal-letter-wrap footer-reveal-letter-wrap--o">
              <span
                ref={(el) => { lettersRef.current[4] = el; }}
                className="footer-reveal-letter"
                data-letter="O"
              >
                O
              </span>
            </span>
            <span className="footer-reveal-letter-wrap footer-reveal-letter-wrap--r">
              <span
                ref={(el) => { lettersRef.current[5] = el; }}
                className="footer-reveal-letter"
                data-letter="R"
              >
                R
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
