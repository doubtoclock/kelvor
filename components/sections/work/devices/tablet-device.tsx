import { ReactNode } from "react";

interface TabletDeviceProps {
  children: ReactNode;
  className?: string;
}

export function TabletDevice({ children, className = "" }: TabletDeviceProps) {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center w-[340px] h-[250px] md:w-[640px] md:h-[460px] rounded-[24px] md:rounded-[32px] bg-[#121212] p-2 md:p-[12px] shadow-2xl shadow-black/50 ring-1 ring-white/10 ${className}`}
    >
      {/* Screen Area */}
      <div 
        className={`relative w-full h-full rounded-[16px] md:rounded-[24px] overflow-hidden bg-background`}
      >
        {children}
      </div>
    </div>
  );
}
