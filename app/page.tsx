import Navbar from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { HeroOrchestrator } from "@/components/sections/hero/hero-orchestrator";
import { SelectedWorkSection } from "@/components/sections/work/selected-work";
import { ProcessSection } from "@/components/sections/process/process-section";
import { TeamSection } from "@/components/sections/about/team-section";
import { FinalCTASection } from "@/components/sections/final-cta/final-cta-section";
import Footer from "@/components/layout/footer";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { Loader } from "@/components/ui/loader";
import { ScrollReset } from "@/components/utils/scroll-reset";

export default function Home() {
  return (
    <>
      {/* Global atmospheric background — fixed, behind all content */}
      <AmbientBackground />

      <main className="min-h-screen relative z-[1] selection:bg-[#176B55] selection:text-[#F7F4ED]">
        <ScrollReset />
        <Loader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Kelvor",
              "url": "https://kelvor.co.in",
              "email": "hello@kelvor.co.in",
              "description": "Kelvor is an independent product studio helping ambitious ideas become thoughtful digital products through strategy, design, web development, and engineering.",
              "sameAs": [
                "https://www.linkedin.com/company/kelvor-tech/",
                "https://x.com/KelvorTech"
              ]
            })
          }}
        />
        <Navbar />
        <HeroOrchestrator>
          <HeroSection />
        </HeroOrchestrator>

        {/* SECTION 02 - Selected Work & Services (Continuous Experience) */}
        <SelectedWorkSection />

        {/* SECTION 04 - Our Process */}
        <ProcessSection />

        {/* SECTION 05 - Have a Project in Mind? (Final CTA) */}
        <FinalCTASection />

        {/* SECTION 06 - About Kelvor (Team) */}
        <TeamSection />

        <Footer />
      </main>
    </>
  );
}
