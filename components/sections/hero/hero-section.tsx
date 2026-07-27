import { HeroContent } from "./hero-content";
import { HeroVisual } from "./hero-visual";
import { HeroMeta } from "./hero-meta";

export function HeroSection() {
  return (
    <section id="home" className="relative w-full h-full min-h-screen flex flex-col md:flex-row overflow-hidden pointer-events-none">
      {/* 3D Visual - Now spans entire screen so it can center properly */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <HeroVisual />
      </div>

      {/* Left Column (40% on Desktop) */}
      <div className="relative flex flex-col w-full md:w-[40%] h-full pt-32 lg:pt-40 pb-6 px-6 lg:px-12 z-10 shrink-0 pointer-events-auto">
        <HeroContent />
        
        {/* Pushed to the bottom metadata */}
        <div className="mt-auto lg:absolute lg:bottom-12 lg:left-12">
          <HeroMeta />
        </div>
      </div>
    </section>
  );
}
