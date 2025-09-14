"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none ring-offset-bg";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary: "bg-dark text-surface hover:opacity-95",
      secondary: "bg-surface text-dark border border-border hover:bg-[color-mix(in_srgb,var(--surface)_90%,var(--primary)_10%)]",
      ghost: "bg-transparent text-dark hover:bg-[color-mix(in_srgb,var(--bg)_90%,var(--primary)_10%)]",
    };

    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref as any} className={cn(base, variants[variant], "h-10 px-4 py-2", className)} {...props} />;
  }
);
Button.displayName = "Button";
