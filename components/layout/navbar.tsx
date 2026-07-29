"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Navbar() {
  const shouldReduceMotion = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const linkBase = "relative pb-1 hover:text-foreground transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out after:bg-current";

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
    <motion.nav 
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-8 lg:px-12"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      {/* Logo */}
      <a href="#home" className="select-none flex items-center">
        <Image 
          src="/brand/kelvor-logo.png" 
          alt="Kelvor" 
          width={200} 
          height={40} 
          className="h-6 md:h-8 w-auto"
          priority
        />
      </a>

      {/* Desktop Links */}
      <div className="hero-nav-fade hidden md:flex items-center gap-8 lg:gap-12 text-[10px] md:text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
        <a href="#work" className={linkBase}>Work</a>
        <a href="#process" className={linkBase}>Process</a>
        <a href="#capabilities" className={linkBase}>Capabilities</a>
        <a href="#about" className={linkBase}>About</a>
        <a href="#contact" className={`group flex items-center gap-1.5 text-foreground relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out after:bg-current`}>
          <span>LET&apos;S TALK</span>
          <ArrowUpRight strokeWidth={1.5} className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
        </a>
      </div>

      {/* Mobile Menu Trigger */}
      <div className="hero-nav-fade md:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-[10px] font-semibold tracking-[0.15em] text-foreground uppercase transition-all min-w-[44px] min-h-[44px] flex items-center justify-center p-2 -mr-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded-sm"
        >
          Menu
        </button>
      </div>
    </motion.nav>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col bg-background px-6 py-8"
        >
          <div className="flex items-center justify-between">
            <Image 
              src="/brand/kelvor-logo.png" 
              alt="Kelvor" 
              width={200} 
              height={40} 
              className="h-6 w-auto"
            />
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[10px] font-semibold tracking-[0.15em] text-foreground uppercase min-w-[44px] min-h-[44px] flex items-center justify-center p-2 -mr-2"
            >
              Close
            </button>
          </div>

          <div className="flex flex-col items-start gap-8 mt-24 text-2xl font-light tracking-wide uppercase">
            <a href="#work" onClick={() => setIsMobileMenuOpen(false)}>Work</a>
            <a href="#process" onClick={() => setIsMobileMenuOpen(false)}>Process</a>
            <a href="#capabilities" onClick={() => setIsMobileMenuOpen(false)}>Capabilities</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 mt-4 text-white/60">
              <span>LET&apos;S TALK</span>
              <ArrowUpRight strokeWidth={1.5} className="w-6 h-6" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

export default Navbar;
