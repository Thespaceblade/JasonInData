"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "lavender" | "mauve" | "slate";

const toneBg: Record<Tone, string> = {
  lavender: "bg-[#F1E8FF]",
  mauve: "bg-[#FCE7F3]",
  slate: "bg-[#F1F5F9]",
};

export interface StatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

export function StatusCard({ tone = "lavender", className, children, ...props }: StatusCardProps) {
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
