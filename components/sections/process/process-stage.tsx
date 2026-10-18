"use client";

import React from "react";
import Image from "next/image";

export interface ProcessStageData {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  deliverable: string;
  imagePosition?: string;
  mobileImagePosition?: string;
  imageClassName?: string;
  mobileImageClassName?: string;
}

export const PROCESS_STAGES: ProcessStageData[] = [
  {
    id: "01",
    number: "01",
    title: "Discover",
    description: "Understand the problem, users, and opportunity.",
    image: "/images/Discover_Green_Ayush.png",
    deliverable: "User Research & Opportunity Mapping",
    imagePosition: "center center",
  },
  {
    id: "02",
    number: "02",
    title: "Define",
    description: "Turn insights into a clear product direction.",
    image: "/images/Define_Green_Ayush.png",
    deliverable: "Product Direction & Strategic Scope",
    imagePosition: "center center",
  },
  {
    id: "03",
    number: "03",
    title: "Design",
    description: "Shape the experience, interface, and interactions.",
    image: "/images/Design_Green_Ayush.png",
    deliverable: "Interface Systems & Interaction Models",
    imagePosition: "center center",
  },
  {
    id: "04",
    number: "04",
    title: "Build",
    description: "Engineer the product with production-ready systems.",
    image: "/images/Build_Green_Ayush.png",
    deliverable: "Production Architecture & Engineering",
    imagePosition: "center center",
  },
  {
    id: "05",
    number: "05",
    title: "Launch",
    description: "Ship, refine, and prepare for what comes next.",
    image: "/images/Launch_Green_Ayush.png",
    deliverable: "Release Orchestration & Continuous Growth",
    imagePosition: "center center",
  },
];

/**
 * LAYER A: STATIONARY IMAGE CANVAS (Desktop >= 1024px)
 * A fixed visual canvas behind the continuous moving content layer.
 * Contains all 5 process images positioned in advance in their predetermined quadrants:
 * - Left column (50vw): Discover (01), Design (03), Launch (05)
 * - Right column (50vw): Define (02), Build (04)
 * The images DO NOT move vertically or follow text panels during scroll.
 */
export function ProcessStationaryCanvas({
  discoverRef,
  defineRef,
  designRef,
  buildRef,
  launchRef,
}: {
  discoverRef: React.RefObject<HTMLDivElement | null>;
  defineRef: React.RefObject<HTMLDivElement | null>;
  designRef: React.RefObject<HTMLDivElement | null>;
  buildRef: React.RefObject<HTMLDivElement | null>;
  launchRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden bg-[#102D25] z-0"
      aria-hidden="true"
    >
      {/* LEFT COLUMN (50vw): Discover (01), Design (03), Launch (05) */}
      <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden bg-[#102D25]">
        {/* Discover Image (01) */}
        <div
          ref={discoverRef}
          className="absolute inset-0 w-full h-full will-change-[opacity]"
        >
          <Image
            src={PROCESS_STAGES[0].image}
            alt="Discover — User Research & Opportunity Mapping"
            fill
            sizes="50vw"
            className={`object-cover w-full h-full ${PROCESS_STAGES[0].imageClassName || ""}`}
            style={{ objectPosition: PROCESS_STAGES[0].imagePosition || "center center" }}
            priority
            quality={95}
          />
        </div>

        {/* Design Image (03) */}
        <div
          ref={designRef}
          className="absolute inset-0 w-full h-full opacity-0 will-change-[opacity]"
        >
          <Image
            src={PROCESS_STAGES[2].image}
            alt="Design — Interface Systems & Interaction Models"
            fill
            sizes="50vw"
            className={`object-cover w-full h-full ${PROCESS_STAGES[2].imageClassName || ""}`}
            style={{ objectPosition: PROCESS_STAGES[2].imagePosition || "center center" }}
            quality={95}
          />
        </div>

        {/* Launch Image (05) */}
        <div
          ref={launchRef}
          className="absolute inset-0 w-full h-full opacity-0 will-change-[opacity]"
        >
          <Image
            src={PROCESS_STAGES[4].image}
            alt="Launch — Release Orchestration & Continuous Growth"
            fill
            sizes="50vw"
            className={`object-cover w-full h-full ${PROCESS_STAGES[4].imageClassName || ""}`}
            style={{ objectPosition: PROCESS_STAGES[4].imagePosition || "center center" }}
            quality={95}
          />
        </div>
      </div>

      {/* RIGHT COLUMN (50vw): Define (02), Build (04) */}
      <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden bg-[#102D25]">
        {/* Define Image (02) */}
        <div
          ref={defineRef}
          className="absolute inset-0 w-full h-full will-change-[opacity]"
        >
          <Image
            src={PROCESS_STAGES[1].image}
            alt="Define — Product Direction & Strategic Scope"
            fill
            sizes="50vw"
            className={`object-cover w-full h-full ${PROCESS_STAGES[1].imageClassName || ""}`}
            style={{ objectPosition: PROCESS_STAGES[1].imagePosition || "center center" }}
            priority
            quality={95}
          />
        </div>

        {/* Build Image (04) */}
        <div
          ref={buildRef}
          className="absolute inset-0 w-full h-full opacity-0 will-change-[opacity]"
        >
          <Image
            src={PROCESS_STAGES[3].image}
            alt="Build — Production Architecture & Engineering"
            fill
            sizes="50vw"
            className={`object-cover w-full h-full ${PROCESS_STAGES[3].imageClassName || ""}`}
            style={{ objectPosition: PROCESS_STAGES[3].imagePosition || "center center" }}
            quality={95}
          />
        </div>
      </div>

      {/* Hairline Center Divider */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-[#34453D] z-10 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * Editorial Text Panel (Alternating Option A Light Editorial / Option B Jade Panel)
 * Clean rectangular quadrant with large typography and deliverable footprint.
 * Belongs to Layer B (the continuous moving page).
 */
export function ProcessTextPanel({
  stage,
}: {
  stage: ProcessStageData;
}) {
  const isJade = stage.number === "02" || stage.number === "04";

  return (
    <div
      className={`w-full h-full select-none relative overflow-hidden flex flex-col justify-between p-8 sm:p-10 lg:p-12 xl:p-16 ${
        isJade ? "text-[#F7F4ED]" : "text-[#222722]"
      }`}
      style={{
        background: isJade
          ? "linear-gradient(135deg, #104B3D 0%, #176B55 34%, #64A98E 68%, #BCE8D5 100%)"
          : "linear-gradient(135deg, #F7F4ED 0%, #FFFCF7 38%, #E2F2E9 72%, #F7F4ED 100%)",
      }}
    >
      {/* Top Metadata Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              isJade
                ? "bg-[#FFCFB8] shadow-[0_0_10px_rgba(255,207,184,0.45)]"
                : "bg-[#176B55] shadow-[0_0_10px_rgba(23,107,85,0.30)]"
            }`}
          />
          <span
            className={`text-xs sm:text-sm font-mono font-semibold tracking-[0.24em] uppercase ${
              isJade ? "text-[#FFCFB8]" : "text-[#176B55]"
            }`}
          >
            STAGE {stage.number}
          </span>
        </div>

        <span
          className={`font-mono text-xs tracking-[0.22em] uppercase ${
            isJade ? "text-[#BCE8D5]" : "text-[#626A63]"
          }`}
        >
          {stage.number} / 05
        </span>
      </div>

      {/* Center Main Statement: Heading & Description */}
      <div className="my-auto py-8 sm:py-10 flex flex-col items-start text-left max-w-[520px]">
        <span
          className={`text-xs sm:text-sm font-mono font-medium tracking-[0.22em] uppercase mb-3 sm:mb-5 ${
            isJade ? "text-[#FFCFB8]" : "text-[#176B55]"
          }`}
        >
          PHASE {stage.number}
        </span>
        <h3
          className={`process-stage-heading text-4xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[72px] font-display font-medium leading-[1.03] tracking-tight mb-5 md:mb-6 whitespace-pre-line ${
            isJade ? "text-[#F7F4ED]" : "text-[#222722]"
          }`}
        >
          {stage.title}
        </h3>
        <p
          className={`process-stage-desc text-base sm:text-lg md:text-xl lg:text-[22px] leading-relaxed max-w-[480px] font-body ${
            isJade ? "text-[#F7F4ED]/90" : "text-[#39473F]"
          }`}
        >
          {stage.description}
        </p>
      </div>

      {/* Bottom Deliverable Footprint */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-5 border-t w-full ${
          isJade
            ? "border-[rgba(247,244,237,0.20)] text-[#F7F4ED]/80"
            : "border-[#DEDCD2] text-[#626A63]"
        }`}
      >
        <span className="text-[11px] sm:text-xs font-mono tracking-[0.18em] uppercase">
          DELIVERABLE FOCUS
        </span>
        <span
          className={`text-[11px] sm:text-xs font-mono tracking-[0.16em] uppercase font-semibold ${
            isJade ? "text-[#F7F4ED]" : "text-[#222722]"
          }`}
        >
          {stage.deliverable}
        </span>
      </div>
    </div>
  );
}

/**
 * Opening Heading Panel for the Continuous Content Layer (Layer B)
 * Gradient F dark forest environment with green undertones.
 * Moves upward with Layer B as the user scrolls.
 */
export function ProcessOpeningHeading() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-center px-4 min-[360px]:px-6 sm:px-12 select-none"
      style={{
        background:
          "linear-gradient(135deg, #102D25 0%, #222722 45%, #173D32 72%, #102D25 100%)",
      }}
    >
      <div className="flex flex-col items-center justify-center text-center max-w-[700px] lg:max-w-[850px] mx-auto w-full">
        <span className="text-xs font-mono font-semibold tracking-[0.2em] text-[#FFCFB8] uppercase mb-6 sm:mb-8 md:mb-10 inline-block">
          OUR PROCESS
        </span>
        <h2 className="text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl lg:text-[60px] xl:text-[68px] font-display font-medium leading-[1.08] sm:leading-[1.05] tracking-tight text-[#F7F4ED] text-center whitespace-pre-line w-full">
          From first conversation{"\n"}to shipped product.
        </h2>
        <p className="text-sm sm:text-base md:text-lg font-body text-[#BCE8D5]/90 max-w-[500px] mt-4 sm:mt-6 md:mt-8 leading-relaxed text-center mx-auto">
          A focused process that keeps strategy, design, and engineering moving in the same direction.
        </p>
      </div>
    </div>
  );
}

/**
 * Mobile Stacked Stage Component (< 1024px)
 * Displays full-bleed immersive image on top (44% height) and editorial text below (56% height).
 */
export function ProcessMobileStage({
  stage,
  priority = false,
}: {
  stage: ProcessStageData;
  priority?: boolean;
}) {
  const isJade = stage.number === "02" || stage.number === "04";

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none bg-[#102D25]">
      {/* Top Half: Full-bleed Immersive Image (44% height) */}
      <div className="w-full h-[44%] bg-[#102D25] relative overflow-hidden">
        <Image
          src={stage.image}
          alt={`${stage.title} — ${stage.description}`}
          fill
          sizes="100vw"
          className={`object-cover w-full h-full ${stage.mobileImageClassName || stage.imageClassName || ""}`}
          style={{
            objectPosition: stage.mobileImagePosition || stage.imagePosition || "center center",
          }}
          priority={priority}
          quality={92}
        />
      </div>

      {/* Bottom Half: Editorial Text Panel (56% height) */}
      <div
        className={`w-full h-[56%] flex flex-col justify-between p-5 sm:p-8 relative ${
          isJade ? "text-[#F7F4ED]" : "text-[#222722]"
        }`}
        style={{
          background: isJade
            ? "linear-gradient(135deg, #104B3D 0%, #176B55 34%, #64A98E 68%, #BCE8D5 100%)"
            : "linear-gradient(135deg, #F7F4ED 0%, #FFFCF7 38%, #E2F2E9 72%, #F7F4ED 100%)",
        }}
      >
        {/* Top Meta */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isJade ? "bg-[#FFCFB8]" : "bg-[#176B55]"
              }`}
            />
            <span
              className={`text-xs font-mono font-semibold tracking-wider uppercase ${
                isJade ? "text-[#FFCFB8]" : "text-[#176B55]"
              }`}
            >
              STAGE {stage.number}
            </span>
          </div>
          <span
            className={`font-mono text-xs ${
              isJade ? "text-[#BCE8D5]" : "text-[#626A63]"
            }`}
          >
            {stage.number} / 05
          </span>
        </div>

        {/* Center Text */}
        <div className="my-auto py-1.5 sm:py-2 flex flex-col items-start text-left">
          <h3
            className={`text-2xl min-[380px]:text-3xl sm:text-4xl font-display font-medium leading-tight mb-2 sm:mb-3 ${
              isJade ? "text-[#F7F4ED]" : "text-[#222722]"
            }`}
          >
            {stage.title}
          </h3>
          <p
            className={`text-sm sm:text-base font-body leading-relaxed max-w-[440px] ${
              isJade ? "text-[#F7F4ED]/90" : "text-[#39473F]"
            }`}
          >
            {stage.description}
          </p>
        </div>

        {/* Deliverable Footer */}
        <div
          className={`flex items-center justify-between gap-2 pt-2.5 sm:pt-3 border-t text-[10px] min-[360px]:text-[11px] font-mono ${
            isJade
              ? "border-[rgba(247,244,237,0.20)] text-[#F7F4ED]/80"
              : "border-[#DEDCD2] text-[#626A63]"
          }`}
        >
          <span className="uppercase shrink-0">DELIVERABLE</span>
          <span
            className={`font-semibold text-right shrink leading-tight ${
              isJade ? "text-[#F7F4ED]" : "text-[#222722]"
            }`}
          >
            {stage.deliverable}
          </span>
        </div>
      </div>
    </div>
  );
}
