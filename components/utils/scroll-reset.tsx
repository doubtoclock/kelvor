"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollReset() {
  const forceScrollToHero = () => {
    if (typeof window === "undefined") return;

    // 1. Disable browser's automatic scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // 2. Clear any section hash (e.g. #work, #capabilities) so browser doesn't anchor-jump
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    // 3. Temporarily bypass CSS smooth-scrolling to snap to top instantly
    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    // 4. Reset window and element scroll offsets
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    // Restore smooth scroll behavior for in-page navigation clicks
    requestAnimationFrame(() => {
      html.style.scrollBehavior = prevScrollBehavior;
    });
  };

  // Immediate synchronous reset before paint
  useLayoutEffect(() => {
    forceScrollToHero();
  }, []);

  useEffect(() => {
    forceScrollToHero();

    // Clear GSAP ScrollTrigger's scroll memory so it never restores old positions
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.clearScrollMemory("manual");
    }

    // Capture the moment right before reload / navigation and reset scroll to 0,
    // ensuring the browser's session history snapshot records top: 0
    const handleBeforeUnload = () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (window.location.hash) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } catch {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      forceScrollToHero();
    };

    const handleLoad = () => {
      forceScrollToHero();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return null;
}
