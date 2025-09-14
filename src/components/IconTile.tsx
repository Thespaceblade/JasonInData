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
          "flex items-center justify-center rounded-full border border-border bg-surface text-dark",
          "h-16 w-16 md:h-20 md:w-20",
          "transition-transform transition-colors duration-200",
          "hover:scale-105 focus-visible:scale-105 hover:bg-white/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        )}
      >
        <div aria-hidden className="h-8 w-8">
          {renderedIcon}
        </div>
        <span className="sr-only">{label}</span>
      </div>
    </Link>
  );
}

export default IconTile;
