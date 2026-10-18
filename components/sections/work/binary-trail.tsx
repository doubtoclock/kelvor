"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Point {
  x: number;
  y: number;
}

/**
 * Builds the SVG path for the binary trail:
 * 1. Follows the existing Catmull-Rom curved trajectory through Services 01 to 04.
 * 2. Near Service 05, the curve gradually flattens via smooth Bézier control points (C1 continuous, zero kink).
 * 3. The final segment becomes strictly horizontal (dy = 0) and terminates exactly at (endX, endY),
 *    which is the right edge and vertical center of the word "Automation" in Service 05 heading.
 */
function buildBinaryTrailPath(
  keypoints: Point[],
  horizStartX: number,
  endX: number,
  endY: number,
  tension: number = 0.82
): string {
  if (keypoints.length < 2) return "";

  // Start at the off-screen left entry point
  let d = `M ${keypoints[0].x.toFixed(1)} ${keypoints[0].y.toFixed(1)}`;

  // Catmull-Rom segments up to the penultimate keypoint
  const n = keypoints.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = i > 0 ? keypoints[i - 1] : keypoints[i];
    const p1 = keypoints[i];
    const p2 = keypoints[i + 1];
    const p3 = i + 2 < n ? keypoints[i + 2] : { x: horizStartX, y: endY };

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  // Smooth flattening segment from pLast (between 04 & 05) into (horizStartX, endY)
  const pLast = keypoints[n - 1];
  const pPrev = n > 1 ? keypoints[n - 2] : pLast;

  // Tangent at pLast maintains C1 continuity from preceding curve:
  const cp1x = pLast.x + ((horizStartX - pPrev.x) / 6) * tension;
  const cp1y = pLast.y + ((endY - pPrev.y) / 6) * tension;

  // Arrival tangent at (horizStartX, endY) must be strictly horizontal:
  // Setting cp2y === endY ensures dy/dt = 0 at the junction, creating a seamless horizontal transition.
  const cp2x = horizStartX + Math.max(30, (pLast.x - horizStartX) * 0.50);
  const cp2y = endY;

  d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${horizStartX.toFixed(1)} ${endY.toFixed(1)}`;

  // Final segment: perfectly horizontal line ending precisely at (endX, endY)
  d += ` L ${endX.toFixed(1)} ${endY.toFixed(1)}`;

  return d;
}

/**
 * Tangent angle calculation along the path:
 * Tangent vector: dx = x(s + delta) - x(s - delta), dy = y(s + delta) - y(s - delta)
 * Convention:
 * - Downward motion (dx=0, dy>0)  => 0° (upright digit)
 * - Down-Right 45° (dx>0, dy>0)   => +45°
 * - Horizontal Right (dx>0, dy=0) => +90°
 * - Down-Left -45° (dx<0, dy>0)   => -45°
 * - Horizontal Left (dx<0, dy=0)  => -90°
 * Formula: Math.atan2(dx, dy) * (180 / Math.PI)
 */
function getTangentAngle(path: SVGPathElement, s: number, totalLength: number): number {
  const step = 2.0;
  const s0 = Math.max(0, s - step);
  const s1 = Math.min(totalLength, s + step);
  const p0 = path.getPointAtLength(s0);
  const p1 = path.getPointAtLength(s1);
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;

  return Math.atan2(dx, dy) * (180 / Math.PI);
}

export function BinaryTrail() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const digitsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [pathD, setPathD] = useState<string>("");
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [poolSize, setPoolSize] = useState<number>(120);

  // Spacing between consecutive digits along the curved path (noticeably increased & responsive)
  const isDesktop = dimensions.width >= 768;
  const DIGIT_SPACING = isDesktop ? 68 : 50;

  // Build curved path that enters from the LEFT edge, weaves through services 01-04,
  // gradually flattens near Service 05, becomes perfectly horizontal, and terminates
  // precisely at the right edge and vertical center of "Automation"
  const calculatePath = useCallback(() => {
    if (!wrapperRef.current) return;
    const parent = wrapperRef.current.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const width = parentRect.width;
    const height = parentRect.height;

    if (width <= 0 || height <= 0) return;
    setDimensions({ width, height });

    // Measure vertical positions of the service blocks
    const serviceEls = parent.querySelectorAll<HTMLElement>("[data-service-index]");
    const serviceY: number[] = [];

    serviceEls.forEach((el) => {
      const offsetTop = el.offsetTop;
      const offsetHeight = el.offsetHeight;
      serviceY.push(offsetTop + offsetHeight * 0.45);
    });

    // Fallbacks if elements are not rendered yet
    const y1 = serviceY[0] ?? height * 0.12;
    const y2 = serviceY[1] ?? height * 0.30;
    const y3 = serviceY[2] ?? height * 0.48;
    const y4 = serviceY[3] ?? height * 0.66;
    const y5 = serviceY[4] ?? height * 0.84;

    const isDesk = width >= 768;

    // Dynamically locate the exact rendered target: the word "Automation" in Service 05 heading
    const targetEl = parent.querySelector<HTMLElement>("[data-trail-target]");
    let endX = isDesk ? width * 0.42 : width * 0.68;
    let endY = y5;

    if (targetEl) {
      const targetRect = targetEl.getBoundingClientRect();

      // Compensate for any active GSAP transform on Service 05 heading to get settled position
      const headingEl = targetEl.closest<HTMLElement>("[data-service-heading]");
      const currentTransformX = headingEl ? (gsap.getProperty(headingEl, "x") as number) || 0 : 0;
      const currentTransformY = headingEl ? (gsap.getProperty(headingEl, "y") as number) || 0 : 0;

      // Exact right edge of "Automation" (end of letter 'n') at resting layout position
      const restingTargetRight = (targetRect.right - currentTransformX) - parentRect.left;

      // Exact vertical center of "Automation" at resting position
      endY = (targetRect.top + targetRect.height * 0.5 - currentTransformY) - parentRect.top;

      // Calculate actual rendered bounds of each digit:
      // When oriented horizontally along the path (rotate -90deg), the digit extends
      // horizontally from its center by half of its unrotated font/box height.
      let digitHalfWidth = isDesk ? 20 : 13;
      const sampleDigit = digitsRef.current[0];
      if (sampleDigit) {
        const digitRect = sampleDigit.getBoundingClientRect();
        const measuredHalf = Math.max(digitRect.width, digitRect.height) * 0.5;
        if (measuredHalf > 6 && measuredHalf < 45) {
          digitHalfWidth = measuredHalf;
        }
      }

      // Maintain visible clearance of 24–40px (32px on desktop, ~18px on mobile)
      // between the heading text and the nearest part of the binary digit
      const clearance = isDesk ? 32 : 18;

      // Position the endpoint (center of final digit) in adjacent empty space beside "Automation",
      // ensuring the entire rendered digit stays strictly outside the heading's bounding box
      const targetEndX = restingTargetRight + clearance + digitHalfWidth;

      // Guard against overflowing the container on narrow viewports
      endX = Math.min(targetEndX, width - 24);
    }

    const keypoints: Point[] = [];

    if (isDesk) {
      // DESKTOP: Enters from the LEFT side above Service 01, sweeps through negative space,
      // curves across 01 -> 02 -> 03 -> 04 -> 05, and terminates horizontally at "Automation".

      // Start: begins off-screen to the LEFT near the top of the section
      keypoints.push({ x: -80, y: Math.max(10, y1 * 0.22) });
      keypoints.push({ x: width * 0.14, y: Math.max(25, y1 * 0.42) });
      keypoints.push({ x: width * 0.34, y: y1 * 0.70 });

      // Service 01 (LEFT): sweep past right edge of Service 01 into open center space
      keypoints.push({ x: width * 0.52, y: y1 });
      keypoints.push({ x: width * 0.66, y: (y1 + y2) * 0.50 });

      // Service 02 (RIGHT): sweep past left edge of Service 02 text into open center space
      keypoints.push({ x: width * 0.50, y: y2 });
      keypoints.push({ x: width * 0.34, y: (y2 + y3) * 0.50 });

      // Service 03 (LEFT): sweep past right edge of Service 03 text into open center space
      keypoints.push({ x: width * 0.50, y: y3 });
      keypoints.push({ x: width * 0.66, y: (y3 + y4) * 0.50 });

      // Service 04 (RIGHT): sweep past left edge of Service 04 text into open center space
      keypoints.push({ x: width * 0.50, y: y4 });

      // Between 04 & 05: sweep smoothly through open center space between services
      const midY = y4 + (endY - y4) * 0.48;
      const midX = Math.min(width * 0.70, Math.max(width * 0.56, endX + 220));
      keypoints.push({ x: midX, y: midY });

      // Calculate horizontal segment length & start point
      const availableRun = Math.max(50, midX - endX);
      const horizLength = Math.max(80, Math.min(160, availableRun * 0.46));
      const horizStartX = endX + horizLength;

      const d = buildBinaryTrailPath(keypoints, horizStartX, endX, endY, 0.82);
      setPathD(d);
    } else {
      // MOBILE: Enters from the LEFT edge, sweeps through open margins around
      // the alternating left/right service content in an elegant S-shaped trajectory,
      // and terminates horizontally at "Automation".
      const rightCorridor = Math.min(width - 24, Math.max(width * 0.88, width - 42));
      const leftCorridor = Math.max(24, Math.min(width * 0.12, 42));
      const centerCross = width * 0.50;

      // Start: begins off-screen to the LEFT near the top of the section
      keypoints.push({ x: -50, y: Math.max(10, y1 * 0.16) });
      keypoints.push({ x: width * 0.35, y: Math.max(20, y1 * 0.36) });
      keypoints.push({ x: rightCorridor, y: y1 * 0.68 });

      // Service 01 (LEFT): trail sweeps down through the clear RIGHT corridor
      keypoints.push({ x: rightCorridor, y: y1 });

      // Between 01 & 02: crosses diagonally from right to left through the open vertical space
      keypoints.push({ x: centerCross, y: (y1 + y2) * 0.50 });

      // Service 02 (RIGHT): trail sweeps down through the clear LEFT corridor
      keypoints.push({ x: leftCorridor, y: y2 });

      // Between 02 & 03: crosses diagonally from left to right through the open vertical space
      keypoints.push({ x: centerCross, y: (y2 + y3) * 0.50 });

      // Service 03 (LEFT): trail sweeps down through the clear RIGHT corridor
      keypoints.push({ x: rightCorridor, y: y3 });

      // Between 03 & 04: crosses diagonally from right to left through the open vertical space
      keypoints.push({ x: centerCross, y: (y3 + y4) * 0.50 });

      // Service 04 (RIGHT): Measure actual resting bottom of Service 04 heading & description
      const s4El = parent.querySelector<HTMLElement>('[data-service-index="04"]');
      let s4DescBottom = y4 + 110;
      if (s4El) {
        const descEl = s4El.querySelector<HTMLElement>("[data-service-desc]");
        if (descEl) {
          const descRect = descEl.getBoundingClientRect();
          const currentDescY = (gsap.getProperty(descEl, "y") as number) || 0;
          const restingBottom = (descRect.bottom - currentDescY) - parentRect.top;
          if (restingBottom > y4) {
            s4DescBottom = restingBottom;
          }
        }
      }

      // Safe clearance below the bottom of MVP description before beginning curve
      const s4ClearY = Math.max(y4 + 90, s4DescBottom + 35);

      // Service 04 (RIGHT): trail sweeps down through the clear LEFT corridor
      keypoints.push({ x: leftCorridor, y: y4 });

      // Keep trail safely in the left corridor past the entire MVP heading & description
      keypoints.push({ x: leftCorridor, y: s4ClearY });

      // Between 04 & 05: Now safely below Service 04, curve through the open vertical gap
      const gapMidY = s4ClearY + (endY - s4ClearY) * 0.45;
      const sweepX = Math.min(width - 24, Math.max(endX + 70, width * 0.65));
      keypoints.push({ x: sweepX, y: gapMidY });

      // Calculate horizontal segment length & start point leading cleanly into "Automation"
      const availableRun = Math.max(30, sweepX - endX);
      const horizLength = Math.max(35, Math.min(80, availableRun * 0.48));
      const horizStartX = Math.min(width - 15, endX + horizLength);

      const d = buildBinaryTrailPath(keypoints, horizStartX, endX, endY, 0.82);
      setPathD(d);
    }
  }, []);

  // Update dynamic pool size when path is recalculated
  useEffect(() => {
    if (!pathRef.current) return;
    try {
      const len = pathRef.current.getTotalLength();
      if (len > 0) {
        const needed = Math.max(100, Math.ceil((len + 200) / DIGIT_SPACING) + 10);
        if (needed > poolSize) {
          setPoolSize(needed);
        }
      }
    } catch {}
  }, [pathD, DIGIT_SPACING, poolSize]);

  // Update position and tangent rotation of the continuous binary stream
  const updateDigits = useCallback((progress: number) => {
    const path = pathRef.current;
    if (!path) return;

    let totalLength = 0;
    try {
      totalLength = path.getTotalLength();
    } catch {
      return;
    }

    if (totalLength <= 0) return;

    const spans = digitsRef.current;
    if (!spans || spans.length === 0) return;

    const isDesk = dimensions.width >= 768;
    const spacing = isDesk ? 68 : 50;

    // Head starts just at the left entrance boundary and progresses along the curve.
    // The final leading digit lands precisely at totalLength (the bottom of the final "s" in "businesses").
    const startHead = 45;
    const endHead = totalLength;
    const headDistance = startHead + Math.min(progress, 1.0) * (endHead - startHead);

    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      if (!span) continue;

      // Distance along path for digit i (i=0 is leading head, i=1, 2, ... are trailing digits)
      const s = headDistance - i * spacing;

      if (s < 0 || s > totalLength) {
        // Outside active path length: either hasn't entered from left yet or exceeds the endpoint
        span.style.opacity = "0";
        span.style.transform = "translate3d(-9999px, -9999px, 0)";
        continue;
      }

      const clampedS = Math.min(Math.max(0, s), totalLength);
      const pt = path.getPointAtLength(clampedS);

      // If physically off-screen to the left before crossing entry boundary
      if (pt.x < -25) {
        span.style.opacity = "0";
        span.style.transform = "translate3d(-9999px, -9999px, 0)";
        continue;
      }

      // Calculate local tangent angle at this digit's exact position
      const angle = getTangentAngle(path, clampedS, totalLength);

      // Smooth entry fade at the left screen boundary (over first 32px)
      const entryFade = Math.min(1, Math.max(0, (pt.x + 18) / 32));

      // Brand digit color distribution: #104B3D leading, #176B55 main, rgba(23, 107, 85, 0.45) secondary
      if (i === 0) {
        span.style.color = "#104B3D";
      } else if (i % 3 === 0) {
        span.style.color = "rgba(23, 107, 85, 0.45)";
      } else {
        span.style.color = "#176B55";
      }

      span.style.opacity = (entryFade * 0.95).toFixed(3);
      span.style.transform = `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${angle.toFixed(1)}deg)`;
    }
  }, [dimensions.width]);

  // Recalculate path on mount, resize, font load, and layout shifts
  useEffect(() => {
    calculatePath();

    const parent = wrapperRef.current?.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver(() => {
      calculatePath();
    });

    resizeObserver.observe(parent);
    window.addEventListener("resize", calculatePath);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        calculatePath();
      });
    }

    const t1 = setTimeout(calculatePath, 150);
    const t2 = setTimeout(calculatePath, 600);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculatePath);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [calculatePath]);

  // Set up ScrollTrigger & synchronized GSAP timeline to scrub digits and animate service entrances
  useEffect(() => {
    const parent = wrapperRef.current?.parentElement;
    const path = pathRef.current;
    if (!parent || !path) return;

    let totalLength = 0;
    try {
      totalLength = path.getTotalLength();
    } catch {
      return;
    }
    if (totalLength <= 0) return;

    const serviceEls = parent.querySelectorAll<HTMLElement>("[data-service-index]");

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      serviceEls.forEach((el) => {
        const heading = el.querySelector<HTMLElement>("[data-service-heading]");
        const desc = el.querySelector<HTMLElement>("[data-service-desc]");
        if (heading) gsap.set(heading, { x: 0, opacity: 1, clearProps: "transform,opacity" });
        if (desc) gsap.set(desc, { y: 0, opacity: 1, clearProps: "transform,opacity" });
      });
      updateDigits(0.5);
      return;
    }

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current.scrollTrigger?.kill();
      timelineRef.current = null;
    }

    const startHead = 45;
    const endHead = totalLength;
    const headDistanceRange = endHead - startHead;

    // Helper to find arc distance along path where pt.y reaches targetY
    const findDistanceAtY = (targetY: number): number => {
      const step = 30;
      let bestDist = totalLength;
      for (let s = 0; s <= totalLength; s += step) {
        const pt = path.getPointAtLength(s);
        if (pt.y >= targetY) {
          bestDist = s;
          break;
        }
      }
      let low = Math.max(0, bestDist - step);
      let high = bestDist;
      for (let iter = 0; iter < 12; iter++) {
        const mid = (low + high) * 0.5;
        const pt = path.getPointAtLength(mid);
        if (pt.y < targetY) {
          low = mid;
        } else {
          high = mid;
        }
      }
      return (low + high) * 0.5;
    };

    // Calculate trigger progress for each service when binary trail's leading digit arrives
    const serviceConfigs: {
      heading: HTMLElement | null;
      desc: HTMLElement | null;
      isLeft: boolean;
      triggerP: number;
    }[] = [];

    serviceEls.forEach((el, index) => {
      const isLeft = index % 2 === 0;
      const heading = el.querySelector<HTMLElement>("[data-service-heading]");
      const desc = el.querySelector<HTMLElement>("[data-service-desc]");

      // Initial visual state: heading offset horizontally, description offset vertically
      const isDesk = dimensions.width >= 768;
      const headOffset = isDesk ? (isLeft ? -85 : 85) : (isLeft ? -28 : 28);
      if (heading) {
        gsap.set(heading, { x: headOffset, opacity: 0 });
      }
      if (desc) {
        gsap.set(desc, { y: 40, opacity: 0 });
      }

      // Vertical trigger point: when leading digit of binary trail reaches service
      let targetY: number;
      if (index === 0) {
        // Service 01: begin entrance as trail enters and approaches Service 01
        targetY = Math.max(el.offsetTop - 25, dimensions.height * 0.03);
      } else {
        // Services 02, 03, 04, 05: trigger as the leading digit reaches the service heading
        targetY = el.offsetTop + Math.min(45, el.offsetHeight * 0.12);
      }

      const sTrigger = findDistanceAtY(targetY);
      let triggerP = (sTrigger - startHead) / headDistanceRange;
      triggerP = Math.max(0.02, Math.min(0.85, triggerP));

      serviceConfigs.push({
        heading,
        desc,
        isLeft,
        triggerP,
      });
    });

    // Ensure sequential progression spacing between triggers
    for (let i = 1; i < serviceConfigs.length; i++) {
      if (serviceConfigs[i].triggerP <= serviceConfigs[i - 1].triggerP + 0.08) {
        serviceConfigs[i].triggerP = serviceConfigs[i - 1].triggerP + 0.14;
      }
    }

    if (serviceConfigs.length > 0) {
      const last = serviceConfigs[serviceConfigs.length - 1];
      if (last.triggerP > 0.84) {
        last.triggerP = 0.84;
      }
    }

    // Build timeline synchronized with the binary trail's scroll progress
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parent,
        start: "top 85%",
        end: "bottom bottom",
        scrub: 0.3,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          updateDigits(self.progress);
        },
      },
    });

    timelineRef.current = tl;

    // Add slower, smoother, cinematic entrance animations for each service:
    // - Heading: ~1.2–1.6s equivalent progress (0.145), entering from left (01,03,05) or right (02,04)
    // - Description: ~1.0–1.4s equivalent progress (0.125), rising gradually from below
    // - Subtle stagger of ~0.15–0.25s equivalent progress (0.02)
    // - Easing: power3.out for silky, natural deceleration without abrupt stops
    serviceConfigs.forEach(({ heading, desc, isLeft, triggerP }) => {
      const headDur = Math.min(0.145, Math.max(0.08, 0.99 - triggerP));
      const descDur = Math.min(0.125, Math.max(0.07, 0.99 - triggerP - 0.02));
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const headOffset = isMobile ? (isLeft ? -28 : 28) : (isLeft ? -85 : 85);

      if (heading) {
        tl.fromTo(
          heading,
          { x: headOffset, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "power3.out",
            duration: headDur,
            immediateRender: false,
          },
          triggerP
        );
      }
      if (desc) {
        tl.fromTo(
          desc,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            duration: descDur,
            immediateRender: false,
          },
          triggerP + 0.02
        );
      }
    });

    // Anchor timeline duration to 1.0
    tl.set({}, {}, 1.0);

    // Initial position matching current scroll
    const initialProgress = tl.scrollTrigger?.progress || 0;
    updateDigits(initialProgress);

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [pathD, updateDigits, dimensions]);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 pointer-events-none z-[12] overflow-visible select-none"
      aria-hidden="true"
    >
      {/* Invisible Guide SVG Path for mathematical point & tangent calculations */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        width={dimensions.width || "100%"}
        height={dimensions.height || "100%"}
        style={{ pointerEvents: "none" }}
      >
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="none"
          opacity={0}
        />
      </svg>

      {/* Continuous, Infinite-Looking Stream of Alternating 1s and 0s */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: poolSize }, (_, i) => {
          const char = i % 2 === 0 ? "1" : "0";
          return (
            <span
              key={i}
              ref={(el) => {
                digitsRef.current[i] = el;
              }}
              className="absolute top-0 left-0 font-mono font-bold text-[24px] sm:text-[30px] md:text-[38px] lg:text-[40px] text-[#176B55] pointer-events-none select-none will-change-transform drop-shadow-[0_0_10px_rgba(188,232,213,0.55)] leading-none"
              style={{
                transform: "translate3d(-9999px, -9999px, 0)",
                opacity: 0,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
