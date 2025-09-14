"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "navy" | "grey" | "white" | "carolina";

const toneBg: Record<Tone, string> = {
  navy: "bg-[#091a2f]",
  grey: "bg-[#cfcfcf]",
  white: "bg-[#f7f9fb]",
  carolina: "bg-[#4B9CD3]",
};

export interface StatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

export function StatusCard({ tone = "white", className, children, ...props }: StatusCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-dark p-5 text-dark shadow-sm",
        toneBg[tone],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Pill({ className, children, ...props }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-dark px-3 py-1 text-lg font-semibold text-surface leading-none",
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
