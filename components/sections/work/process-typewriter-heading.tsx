"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const FULL_TEXT = "Our Process...";
const TYPING_SPEED = 30; // ms per character (25–40ms range; ~420ms total typing duration)
const POST_TYPING_BLINK_DURATION = 450; // ms to blink briefly before smooth fade out

export function ProcessTypewriterHeading({ active = false }: { active?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const hasStartedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTyping = useCallback(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setIsCursorVisible(true);

    let currentCount = 0;
    intervalRef.current = setInterval(() => {
      currentCount += 1;
      setDisplayedCount(currentCount);

      if (currentCount >= FULL_TEXT.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Keep cursor blinking briefly, then fade out quickly
        timeoutRef.current = setTimeout(() => {
          setIsCursorVisible(false);
        }, POST_TYPING_BLINK_DURATION);
      }
    }, TYPING_SPEED);
  }, []);

  // When active prop becomes true (as soon as the background transition starts), start typing immediately
  useEffect(() => {
    if (active) {
      startTyping();
    }
  }, [active, startTyping]);

  // Accessibility: Respect prefers-reduced-motion
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplayedCount(FULL_TEXT.length);
      setIsCursorVisible(false);
      hasStartedRef.current = true;
    }
  }, []);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center text-center select-none"
    >
      <h2
        aria-label="Our Process..."
        className="relative inline-block font-display font-medium tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[1.1] text-center"
        style={{
          color: "#111111",
        }}
      >
        {/* Semantic screen reader announcement: reads complete text without character stutter */}
        <span className="sr-only">Our Process...</span>

        {/* Structural invisible ghost text: guarantees zero horizontal layout reflow */}
        <span aria-hidden="true" className="invisible pointer-events-none select-none">
          {FULL_TEXT}
        </span>

        {/* Cinematic character-by-character typewriter text revealed in place in crisp near-black (#111111) */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full flex items-baseline text-left whitespace-nowrap pointer-events-none"
        >
          <span>{FULL_TEXT.slice(0, displayedCount)}</span>
          <span
            className={`inline-block w-[2px] sm:w-[2.5px] md:w-[3px] h-[0.82em] ml-1 sm:ml-1.5 bg-[#111111] align-baseline rounded-full transition-opacity duration-300 ${
              isCursorVisible ? "animate-process-cursor opacity-100" : "opacity-0"
            }`}
            style={{ verticalAlign: "baseline" }}
          />
        </span>
      </h2>
    </div>
  );
}
