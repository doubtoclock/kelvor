import { ReactNode } from "react";

interface MacbookDeviceProps {
  children: ReactNode;
  className?: string;
}

export function MacbookDevice({ children, className = "" }: MacbookDeviceProps) {
  return (
    <div className={`relative flex flex-col items-center shrink-0 ${className}`}>
      {/* Top / Screen bezel */}
      <div className="relative w-[340px] h-[220px] md:w-[680px] md:h-[440px] lg:w-[960px] lg:h-[620px] bg-[#121212] rounded-t-xl md:rounded-t-2xl lg:rounded-t-[32px] p-2 md:p-[12px] lg:p-[16px] shadow-2xl ring-1 ring-white/10">
        <div className="relative w-full h-full bg-background rounded-sm md:rounded-[12px] lg:rounded-[20px] overflow-hidden">
          {children}
        </div>
      </div>
      {/* Bottom base / Keyboard deck lip */}
      <div className="w-[380px] md:w-[760px] lg:w-[1080px] h-3 md:h-5 lg:h-7 bg-gradient-to-b from-[#2a2a2a] to-[#0a0a0a] rounded-b-lg md:rounded-b-xl lg:rounded-b-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex justify-center -mt-[1px]">
        {/* Trackpad notch / thumb groove */}
        <div className="w-16 md:w-32 lg:w-48 h-1 md:h-1.5 lg:h-2 bg-[#050505] rounded-b-md shadow-inner opacity-80"></div>
      </div>
    </div>
  );
}
