"use client";

export function HeroOrchestrator({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-full min-h-[100svh]"
      style={{
        background:
          "linear-gradient(135deg, #F7F4ED 0%, #FFFCF7 38%, #E2F2E9 72%, #F7F4ED 100%)",
      }}
    >
      {children}
    </div>
  );
}
