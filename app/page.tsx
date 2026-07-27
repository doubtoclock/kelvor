import Navbar from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { HeroOrchestrator } from "@/components/sections/hero/hero-orchestrator";
import { SelectedWorkSection } from "@/components/sections/work/selected-work";
import { CapabilitiesSection } from "@/components/sections/capabilities/capabilities-section";
import { ProcessSection } from "@/components/sections/process/process-section";
import { TeamSection } from "@/components/sections/about/team-section";
import { FinalCTASection } from "@/components/sections/final-cta/final-cta-section";
import Footer from "@/components/layout/footer";
import { AmbientBackground } from "@/components/ui/ambient-background";

export default function Home() {
  return (
    <>
      {/* Global atmospheric background — fixed, behind all content */}
      <AmbientBackground />

      <main className="min-h-screen relative z-[1] selection:bg-foreground selection:text-background">
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
        <HeroOrchestrator>
          <Navbar />
          <HeroSection />
        </HeroOrchestrator>

        {/* SECTION 02 - Selected Work */}
        <SelectedWorkSection />

        {/* SECTION 03 - Capabilities */}
        <CapabilitiesSection />

        {/* SECTION 04 - Our Process */}
        <ProcessSection />

        {/* SECTION 05 - Team */}
        <TeamSection />

        <FinalCTASection />
        <Footer />
      </main>
    </>
  );
}
