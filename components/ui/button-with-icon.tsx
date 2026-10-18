import * as React from "react"
import { ArrowUpRight } from "lucide-react"

export interface ButtonWithIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: "light" | "dark";
}

export const ButtonWithIcon = React.forwardRef<HTMLButtonElement, ButtonWithIconProps>(
  ({ className = "", children = "START A PROJECT", variant = "light", ...props }, ref) => {
    const isDark = variant === "dark";
    return (
      <button
        ref={ref}
        className={`group relative flex items-center h-[60px] min-w-[230px] w-fit rounded-lg ${
          isDark
            ? "bg-[#176B55] text-[#F7F4ED] hover:bg-[#104B3D]"
            : "bg-[#E2F2E9] text-[#176B55] hover:bg-[#BCE8D5]"
        } overflow-hidden transition-all duration-500 ${className}`}
        {...props}
      >
        {/* Text container */}
        <span className="flex-1 whitespace-nowrap text-center text-[13px] md:text-[14px] font-body font-semibold tracking-[0.05em] uppercase transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] pr-[54px] pl-[12px] group-hover:pr-[12px] group-hover:pl-[54px]">
          {children}
        </span>
        
        {/* Circular Arrow container */}
        <div
          className={`absolute right-[6px] top-[6px] w-[48px] h-[48px] ${
            isDark
              ? "bg-[#F7F4ED] text-[#176B55]"
              : "bg-[#176B55] text-[#F7F4ED]"
          } rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:right-[calc(100%-54px)]`}
        >
          <ArrowUpRight className="w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:rotate-45" />
        </div>
      </button>
    )
  }
)

ButtonWithIcon.displayName = "ButtonWithIcon"
