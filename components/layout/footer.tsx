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

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      columnsRef.current.forEach((col) => {
        if (col) gsap.set(col, { opacity: 1, y: 0 });
      });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
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
    });
  }, { scope: containerRef });

  return (
    <footer 
      ref={containerRef} 
      className="relative w-full overflow-hidden flex flex-col pt-12 md:pt-16 pb-8 md:pb-12 z-10 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.01)] to-[rgba(255,255,255,0.025)] border-t border-white/5"
    >
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 flex flex-col gap-12 md:gap-16">
        
        {/* Top Information Grid */}
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-x-8 gap-y-12 md:gap-16">
          
          {/* LEFT: Brand Statement & Email */}
          <div ref={(el) => { if (el) columnsRef.current[0] = el; }} className="col-span-2 md:col-span-1 flex flex-col justify-start">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[#F5F5F5] mb-3">Kelvor</h3>
            <p className="text-[14px] md:text-[15px] leading-[1.6] text-muted-foreground max-w-[320px] mb-6 md:mb-8">
              Independent product studio building thoughtful digital products.
            </p>
            <a 
              href="mailto:hello@kelvor.co.in" 
              className="group flex items-center text-[15px] md:text-[16px] font-medium tracking-tight text-[#F5F5F5] hover:text-white transition-all duration-300 ease-out w-fit"
            >
              <Mail className="w-[18px] h-[18px] mr-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300 ease-out" strokeWidth={2} />
              hello@kelvor.co.in
              <svg className="w-[18px] h-[18px] ml-1.5 opacity-50 group-hover:opacity-100 transition-transform duration-300 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 19L19 5M19 5v9M19 5H10" />
              </svg>
            </a>
          </div>

          {/* CENTER: Explore */}
          <div ref={(el) => { if (el) columnsRef.current[1] = el; }} className="col-span-1 flex flex-col md:pl-4">
            <h4 className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/60 mb-5">Explore</h4>
            <nav className="flex flex-col space-y-3">
              <a href="#work" className="text-[13px] md:text-[14px] leading-none text-[#F5F5F5]/80 hover:text-white transition-transform duration-300 ease-out hover:translate-x-[2px] w-fit">Work</a>
              <a href="#capabilities" className="text-[13px] md:text-[14px] leading-none text-[#F5F5F5]/80 hover:text-white transition-transform duration-300 ease-out hover:translate-x-[2px] w-fit">Capabilities</a>
              <a href="#process" className="text-[13px] md:text-[14px] leading-none text-[#F5F5F5]/80 hover:text-white transition-transform duration-300 ease-out hover:translate-x-[2px] w-fit">Process</a>
              <a href="#about" className="text-[13px] md:text-[14px] leading-none text-[#F5F5F5]/80 hover:text-white transition-transform duration-300 ease-out hover:translate-x-[2px] w-fit">About</a>
            </nav>
          </div>

          {/* RIGHT: Connect */}
          <div ref={(el) => { if (el) columnsRef.current[2] = el; }} className="col-span-1 flex flex-col md:pl-4">
            <h4 className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/60 mb-5">Connect</h4>
            <nav className="flex flex-col space-y-3">
              <a href="https://www.linkedin.com/company/kelvor-tech/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-[13px] md:text-[14px] leading-none text-[#F5F5F5]/80 hover:text-white transition-transform duration-300 ease-out hover:translate-x-[2px] w-fit">
                <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                LinkedIn
              </a>
              <a href="https://x.com/KelvorTech" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-[13px] md:text-[14px] leading-none text-[#F5F5F5]/80 hover:text-white transition-transform duration-300 ease-out hover:translate-x-[2px] w-fit">
                <span className="flex items-center justify-center w-4 h-4 font-bold text-[14px] opacity-70 group-hover:opacity-100 transition-opacity duration-300 leading-none pb-[1px]">X</span>
                X
              </a>
              <a href="#" className="group flex items-center gap-3 text-[13px] md:text-[14px] leading-none text-[#F5F5F5]/80 hover:text-white transition-transform duration-300 ease-out hover:translate-x-[2px] w-fit">
                <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        <div ref={(el) => { if (el) columnsRef.current[3] = el; }} className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center text-[12px] md:text-[13px] text-muted-foreground/60 font-medium tracking-wide gap-4 sm:gap-0 pt-6 md:pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-12">
            <span>© 2026 Kelvor Studio</span>
            <span>India / Working Globally</span>
          </div>
          <div className="flex gap-6 sm:gap-8">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
