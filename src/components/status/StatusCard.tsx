"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "navy" | "grey" | "white" | "carolina" | "dark";

const toneBg: Record<Tone, string> = {
  navy: "bg-[#0a1a2f]",
  grey: "bg-[#cfcfcf]",
  white: "bg-[#f7f9fb]",
  carolina: "bg-[#4B9CD3]",
  dark: "bg-[#0a1a2f]",
};

export interface StatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

export function StatusCard({ tone = "white", className, children, ...props }: StatusCardProps) {
  return (
    <div
      className={cn(
        "relative isolate rounded-2xl border-4 border-white p-5 text-dark shadow-sm",
        "transition-colors duration-300 group-hover:bg-[#0a1a2f]",
        toneBg[tone],
        className
      )}
      {...props}
    >
      {/* Sliding navy overlay for invert effect */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
        <span className="absolute inset-y-0 left-0 w-0 bg-[#0a1a2f] transition-all duration-300 group-hover:w-full" />
      </div>
      <div className="relative z-10 text-lg sm:text-xl md:text-2xl font-semibold leading-snug transition-colors duration-300 group-hover:text-white">
        {children}
      </div>
    </div>
  );
}

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Pill({ className, children, ...props }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-dark px-3 py-1 text-base sm:text-lg md:text-xl font-semibold text-surface leading-none",
        className
      )}
      {...props}
    >
      <span aria-hidden className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500" />
      {children}
    </span>
  );
}

export default StatusCard;
