"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import * as React from "react";

type IconTileProps = {
  href: string;
  icon: React.ReactNode;
  label: string; // visually-hidden text
  external?: boolean;
  className?: string;
};

export function IconTile({ href, icon, label, external, className }: IconTileProps) {
  const anchorProps = external ? { target: "_blank", rel: "noreferrer noopener" } : {};

  // Ensure the provided icon fills the tile and is centered
  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        className: cn((icon as any).props?.className, "h-full w-full"),
        "aria-hidden": true,
        focusable: false,
      })
    : icon;

  return (
    <Link
      href={href}
      aria-label={label}
      {...anchorProps}
      className={cn("group relative block outline-none", className)}
    >
      {/* Tile */}
      <div
        className={cn(
          "relative isolate flex items-center justify-center rounded-full border border-border bg-surface text-dark overflow-hidden",
          "h-16 w-16 md:h-20 md:w-20",
          "transition-transform transition-colors duration-200",
          "hover:scale-105 focus-visible:scale-105",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        )}
      >
        {/* Sliding navy overlay for invert effect */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
          <span className="absolute inset-y-0 left-0 w-0 bg-[#0a1a2f] transition-all duration-300 group-hover:w-full" />
        </div>
        <div aria-hidden className="relative z-10 h-8 w-8 transition-colors duration-300 group-hover:text-white flex items-center justify-center">
          {renderedIcon}
        </div>
        <span className="sr-only">{label}</span>
      </div>
    </Link>
  );
}

export default IconTile;
