"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import * as React from "react";

type StickyNoteProps = {
  children: React.ReactNode;
  tilt?: number; // degrees
  withPin?: boolean;
  className?: string;
};

export function StickyNote({ children, tilt = 0, withPin = true, className }: StickyNoteProps) {
  const sequence = [tilt, tilt + 4, tilt - 3, tilt + 2, tilt - 1, tilt];
  return (
    <motion.div
      className={cn(
        "relative rounded-md border-2 border-dark/20 bg-paper p-4 shadow-note will-change-transform",
        "transition-shadow duration-300 hover:shadow-lg",
        className
      )}
      style={{ rotate: tilt }}
      whileHover={{ rotate: sequence }}
      whileTap={{ rotate: sequence }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      {withPin && (
        <svg
          aria-hidden
          className="absolute -top-2 right-6 h-4 w-4 text-dark/70"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="12" r="8" />
        </svg>
      )}
      <div className="text-sm leading-relaxed text-black/90 dark:text-black">
        {children}
      </div>
    </motion.div>
  );
}

export default StickyNote;
