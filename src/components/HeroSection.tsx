"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StatusGrid from "@/components/StatusGrid";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="hero-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
            {/* Left: Name, tagline, CTAs */}
            <div className="space-y-6">
              <h1 id="hero-title" className="font-display text-5xl sm:text-6xl font-bold tracking-tight">
                Hi, I’m Jason.
              </h1>
              <p className="text-lg text-dark/80 max-w-2xl">a student from north carolina</p>
              <div className="flex items-center gap-3 pt-2">
                <Button asChild aria-label="Connect with Jason">
                  <a href="#connect">Connect</a>
                </Button>
                <Button variant="secondary" asChild aria-label="View highlights">
                  <a href="#highlights">Highlights</a>
                </Button>
              </div>
            </div>

            {/* Right: Status Grid */}
            <div>
              <StatusGrid />
            </div>
          </div>

          {/* Chevron to Highlights */}
          <div className="mt-12 flex justify-center">
            <a
              href="#highlights"
              aria-label="Scroll to highlights"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-dark transition-colors hover:bg-[color-mix(in_srgb,var(--surface)_92%,var(--primary)_8%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <ChevronDown className="h-6 w-6" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
