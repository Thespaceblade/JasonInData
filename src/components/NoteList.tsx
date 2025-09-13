"use client";
import { motion, useReducedMotion } from "framer-motion";
import StickyNote from "@/components/StickyNote";

export type NoteListProps = {
  title: string;
  items: string[];
};

function deterministicTilt(index: number) {
  // Deterministic small tilt based on index; avoids hydration mismatch.
  const base = Math.sin(index + 1) * 2.2; // ~[-2.2, 2.2]
  return Math.round(base * 10) / 10; // one decimal place for stability
}

export function NoteList({ title, items }: NoteListProps) {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby={`${title.toLowerCase().replace(/\s+/g, "-")}-title`} className="py-8">
      <div className="mx-auto max-w-6xl px-4">
        <motion.h2
          id={`${title.toLowerCase().replace(/\s+/g, "-")}-title`}
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-display text-2xl font-semibold"
        >
          {title}
        </motion.h2>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {items.map((item, i) => (
            <StickyNote key={i} tilt={deterministicTilt(i)}>
              {item}
            </StickyNote>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NoteList;

