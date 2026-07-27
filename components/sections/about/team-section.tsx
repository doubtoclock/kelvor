import Image from "next/image";
import { ArrowRight } from "lucide-react";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={className} viewBox="0 0 16 16">
    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={className} viewBox="0 0 16 16">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
  </svg>
);

const TEAM = [
  { name: "Ayush Jain", image: "/images/Ayush_Jain.jpeg", linkedin: "https://www.linkedin.com/in/ayush-jain-36a9411b7/", github: "https://github.com/Ayushdotpy" },
  { name: "Achal Dubey", image: "/images/Achal_Dubey.jpg", linkedin: "https://www.linkedin.com/in/achal-dubey-660352378/", github: "https://github.com/achaldubey099-crypto" },
  { name: "Chinmay Sabharwal", image: "/images/Chinmay_Sabharwal.jpeg", linkedin: "https://www.linkedin.com/in/chinmay-sabharwal-b29980313/", github: "https://github.com/Chinmaystar" },
  { name: "Samarth Gupta", image: "/images/Samarth_Gupta.jpeg", linkedin: "https://www.linkedin.com/in/samarth-gupta-vnit/", github: "https://github.com/doubtoclock" }
];

export function TeamSection() {
  return (
    <section id="about" className="relative w-full px-6 lg:px-12 pt-24 pb-32 md:pb-40 overflow-hidden z-10">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-12 lg:gap-12">
        
        {/* Top: Manifesto */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 justify-between items-start">
          {/* Left: Main Statement */}
          <div className="w-full flex flex-col items-start">
            <div className="text-xs font-semibold tracking-[0.2em] text-muted uppercase mb-8 md:mb-10">
              ABOUT KELVOR
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-[60px] xl:text-[68px] font-normal leading-[1.05] tracking-tight text-foreground max-w-[600px] lg:max-w-[800px]">
              A small team with a big focus.
            </h2>
            <p className="text-base text-muted/80 max-w-[440px] mt-8 leading-relaxed whitespace-pre-line">
              We are four builders who love turning complex{"\n"}problems into simple, beautiful and functional{"\n"}products.
            </p>
            <a href="#about" className="inline-flex items-center justify-center gap-3 mt-10 md:mt-12 text-sm font-medium text-foreground hover:text-white/70 transition-colors group">
              More about us
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>


        </div>

        {/* Bottom: Team Sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 w-full">
          {TEAM.map((member, i) => (
            <div key={i} className="flex flex-col w-full group">
              {/* Editorial Portrait */}
              <div className="relative w-full aspect-[3/4] mb-5 overflow-hidden bg-white/5">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale transition-all duration-[600ms] ease-out group-hover:grayscale-0 motion-safe:group-hover:scale-[1.015]"
                />
              </div>
              
              {/* Typography Structure */}
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {member.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex gap-3 text-muted/50 mt-1">
                    <a href={member.linkedin} aria-label={`${member.name} on LinkedIn`} className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                    <a href={member.github} aria-label={`${member.name} on GitHub`} className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
