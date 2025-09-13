"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="hero-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 id="hero-title" className="font-display text-5xl sm:text-6xl font-bold tracking-tight">
            Hi, I’m Jason.
          </h1>
          <p className="text-lg text-dark/80 max-w-2xl">
            Data Science @ UNC Chapel Hill — I build at the intersection of human experience and intelligent systems.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button as-child variant="primary" aria-label="Connect with Jason">
              <a href="#connect">Connect</a>
            </Button>
            <Button as-child variant="secondary" aria-label="View highlights">
              <a href="#highlights">Highlights</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;

