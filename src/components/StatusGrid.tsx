"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { StatusCard, Pill } from "@/components/status/StatusCard";

type TrackState = {
  isPlaying: boolean;
  title: string | null;
  artist: string | null;
  url: string | null;
  albumImageUrl: string | null;
};

function MarqueeTitle({ text }: { text: string }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const textRef = React.useRef<HTMLDivElement | null>(null);
  const [delta, setDelta] = React.useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    const tx = textRef.current;
    if (!el || !tx) return;
    const w = el.clientWidth;
    const sw = tx.scrollWidth;
    setDelta(Math.max(0, sw - w));
  }, [text]);

  if (delta <= 0) {
    return (
      <div className="truncate" ref={containerRef}>
        <div ref={textRef} className="whitespace-nowrap">{text}</div>
      </div>
    );
  }

  const duration = Math.max(6, Math.min(18, delta / 20));

  return (
    <div ref={containerRef} className="overflow-hidden">
      <motion.div
        ref={textRef}
        className="whitespace-nowrap"
        initial={{ x: 0 }}
        animate={{ x: -delta }}
        transition={{ duration, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        {text}
      </motion.div>
    </div>
  );
}

export default function StatusGrid() {
  const [track, setTrack] = React.useState<TrackState | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      const r = await fetch("/api/spotify/now-playing", { cache: "no-store" });
      const j = await r.json();
      if (active) setTrack(j);
    })();
    return () => { active = false; };
  }, []);

  // Calendar state for bottom timeline
  type CalEvent = { id: string; title: string; start: string; end: string; allDay: boolean };
  const [cal, setCal] = React.useState<CalEvent[] | null>(null);
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const r = await fetch("/api/calendar/upcoming", { cache: "no-store" });
        const j = await r.json();
        if (active) setCal(j.events || []);
      } catch {
        if (active) setCal([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // You can keep your other cards as they are; here’s a simple 2x2 + wide layout:
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Top-left: square */}
      <motion.div className="aspect-square" whileHover={{ scale: 1.03 }}>
        <StatusCard tone="grey" className="h-full text-base sm:text-lg">
          has <Pill className="mx-2">--</Pill> ---
        </StatusCard>
      </motion.div>

      {/* Top-right: square (Spotify) */}
      <motion.div className="aspect-square" whileHover={{ scale: 1.03 }}>
        <StatusCard tone="grey" className="h-full">
          {track?.title ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 opacity-80">was listening to</div>
              <a
                href={track.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${track.title} on Spotify`}
                className="group/cover relative block"
              >
                {track.albumImageUrl ? (
                  <img
                    src={track.albumImageUrl}
                    alt={track.title ?? "Album cover"}
                    className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-md object-cover shadow transition-transform duration-300 ease-out group-hover/cover:scale-105"
                  />
                ) : (
                  <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-md bg-black/10" />
                )}
                <span className="pointer-events-none absolute inset-0 rounded-md ring-0 transition duration-300 group-hover/cover:ring-2 group-hover/cover:ring-white/40 group-hover/cover:bg-black/10" />
              </a>
              <div className="mt-3 w-full max-w-[80%]">
                <div className="font-semibold">
                  <MarqueeTitle text={`${track.title} — ${track.artist ?? ""}`} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                was listening to
                <div className="mt-2">
                  <Pill>…</Pill>
                </div>
              </div>
            </div>
          )}
        </StatusCard>
      </motion.div>

      {/* Bottom wide rectangle — Today timeline */}
      <motion.div className="sm:col-span-2 h-[280px] sm:h-[320px]" whileHover={{ scale: 1.03 }}>
        <div className="group relative isolate h-full overflow-hidden rounded-2xl border-4 border-white bg-[#cfcfcf] p-5 sm:p-6 md:p-8 text-dark shadow-sm transition-colors duration-300 ease-out group-hover:bg-[#0a1a2f]">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
            <span className="absolute inset-y-0 left-0 w-0 bg-[#0a1a2f] transition-all duration-300 ease-out group-hover:w-full" />
          </div>
          <div className="relative z-10 h-full">
            {cal ? (
              cal.length ? (
                <TodayTimeline events={cal} />
              ) : (
                <div className="grid h-full place-items-center text-sm text-dark/70">No events today</div>
              )
            ) : (
              <div className="grid h-full place-items-center text-sm text-dark/70">Loading…</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Helpers and timeline component
type CalEvent = { id: string; title: string; start: string; end: string; allDay: boolean };
function minutesSinceDayStart(d: Date, dayStartHour: number) {
  return (d.getHours() - dayStartHour) * 60 + d.getMinutes();
}
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
function TodayTimeline({ events }: { events: CalEvent[] }) {
  const dayStart = 0; // 12am
  const dayEnd = 24; // 12am next day
  const totalMin = (dayEnd - dayStart) * 60;
  const [, forceTick] = React.useState(0);

  // Update "now" position once a minute
  React.useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const nowMin = clamp(minutesSinceDayStart(now, dayStart), 0, totalMin);
  const nowLeft = (nowMin / totalMin) * 100;
  return (
    <div className="flex h-full flex-col space-y-3 sm:space-y-4">
      {/* Title sized like other cards */}
      <div className="text-center text-lg sm:text-xl font-semibold text-dark/80 group-hover:text-white/80">
        Jason's schedule today
      </div>
      <div className="relative h-full w-full rounded-xl bg-white/70 overflow-x-auto">
        {/* Inner scroll surface to avoid heading overlap */}
        <div className="relative h-full min-w-[1000px]">
          <div className="absolute inset-0 rounded-xl border border-dark/20" />
          {Array.from({ length: dayEnd - dayStart + 1 }).map((_, i) => {
          const left = (i / (dayEnd - dayStart)) * 100;
          const label = dayStart + i;
          const label12 = (label % 12) || 12; // 12-hour tick labels
          return (
            <div key={i} className="absolute top-0 -translate-x-1/2 h-full" style={{ left: `${left}%` }}>
              <div className="h-full border-l border-dashed border-dark/30" />
              <div className="absolute -top-4 -translate-x-1/2 text-[10px] text-dark/60 group-hover:text-white/70">{label12}</div>
            </div>
          );
          })}
          {/* Now marker (local time) */}
          <div
            className="absolute top-0 -translate-x-1/2 h-full w-px bg-red-500"
            style={{ left: `${nowLeft}%` }}
            aria-hidden
          />
          {events.map((ev) => {
          const s = new Date(ev.start);
          const e = new Date(ev.end);
          const startMin = clamp(minutesSinceDayStart(s, dayStart), 0, totalMin);
          const endMin = clamp(minutesSinceDayStart(e, dayStart), 0, totalMin);
          const widthPct = Math.max(2, ((endMin - startMin) / totalMin) * 100);
          const leftPct = (startMin / totalMin) * 100;
          const label = ev.allDay ? `${ev.title} (All-day)` : ev.title;
          return (
            <div
              key={ev.id}
              className="group absolute top-6 h-7 overflow-hidden rounded-md border border-dark/20 bg-[#4B9CD3]/15 backdrop-blur-sm"
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              title={label}
            >
              <div className="absolute inset-0 flex items-center px-2">
                <span className="truncate text-[11px] font-medium text-dark/80 group-hover:text-white/80">{label}</span>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-md ring-0 transition group-hover:ring-2 group-hover:ring-white/40" />
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
}
