import { ReactNode } from "react";

interface PhoneDeviceProps {
  children: ReactNode;
  className?: string;
}

export function PhoneDevice({ children, className = "" }: PhoneDeviceProps) {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center w-[280px] h-[580px] sm:w-[320px] sm:h-[660px] rounded-[40px] sm:rounded-[48px] bg-[#121212] p-2 sm:p-[10px] shadow-2xl shadow-black/50 ring-1 ring-white/10 ${className}`}
    >
      {/* Screen Area */}
      <div 
        className={`relative w-full h-full rounded-[32px] sm:rounded-[38px] overflow-hidden bg-background`}
      >
        {children}
      </div>
    </div>
  );
}
