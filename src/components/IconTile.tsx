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
      {/* Underlay */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 rounded-lg bg-dark transition-transform duration-200 ease-in-out-soft",
          "group-focus:-translate-x-0 group-focus:-translate-y-0",
          "-translate-x-2 -translate-y-2 group-hover:-translate-x-3 group-hover:-translate-y-3"
        )}
      />
      {/* Tile */}
      <div
        className={cn(
          "flex h-24 w-24 items-center justify-center rounded-lg border border-border bg-surface text-dark",
          "transition-colors duration-200 group-hover:bg-[color-mix(in_srgb,var(--surface)_90%,var(--primary)_10%)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        )}
      >
        <div aria-hidden className="h-16 w-16 md:h-20 md:w-20">
          {renderedIcon}
        </div>
        <span className="sr-only">{label}</span>
      </div>
    </Link>
  );
}

export default IconTile;
