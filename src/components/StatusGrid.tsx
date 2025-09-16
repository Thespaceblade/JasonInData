"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { StatusCard, Pill } from "@/components/status/StatusCard";
import { cn } from "@/lib/utils";

type TrackState = {
  isPlaying: boolean;
  title: string | null;
  artist: string | null;
  url: string | null;
  albumImageUrl: string | null;
};

// Robust timestamp parser: treat naive strings as local time (Safari-safe)
function parseCalDate(s: string): Date {
  if (typeof s === "string" && !/[zZ]|[+-]\d{2}:\d{2}$/.test(s)) {
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || "0"));
  }
  return new Date(s);
}

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

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "text-base sm:text-lg font-semibold leading-snug text-dark",
        "transition-colors duration-300 ease-out group-hover:text-white",
        className
      )}
    >
      {children}
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

  async function fetchTodayEvents(): Promise<CalEvent[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const tryFetch = async (url: string) => {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    };

    let j: any;
    try {
      j = await tryFetch(
        `/api/calendar/range?from=${encodeURIComponent(startOfDay.toISOString())}` +
          `&to=${encodeURIComponent(endOfDay.toISOString())}` +
          `&tz=${encodeURIComponent(tz)}&includeOngoing=1`
      );
    } catch {
      j = await tryFetch(
        `/api/calendar/upcoming?timeMin=${encodeURIComponent(startOfDay.toISOString())}` +
          `&timeMax=${encodeURIComponent(endOfDay.toISOString())}` +
          `&tz=${encodeURIComponent(tz)}&includeOngoing=1`
      );
    }

    return (j.events || [])
      .filter((e: any) => +parseCalDate(e.end) > +startOfDay && +parseCalDate(e.start) < +endOfDay)
      .sort((a: any, b: any) => +parseCalDate(a.start) - +parseCalDate(b.start));
  }
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const todays = await fetchTodayEvents();
        if (active) {
          setCal(todays);
          if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
            try {
              const rows = todays.map((e: any) => ({
                title: e.title,
                start: e.start,
                end: e.end,
                allDay: e.allDay,
                minutes: Math.round((+parseCalDate(e.end) - +parseCalDate(e.start)) / 60000),
              }));
              console.groupCollapsed("Calendar events (today)");
              console.table(rows);
              console.groupEnd();
            } catch {}
          }
        }
      } catch {
        if (active) setCal([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Periodically refresh calendar so the day view stays current (e.g., at midnight)
  React.useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const todays = await fetchTodayEvents();
        if (active) setCal(todays);
      } catch {
        // Ignore transient errors
      }
    };
    // Refresh every 5 minutes; also handles crossing midnight without a page reload
    const id = setInterval(refresh, 5 * 60 * 1000);
    return () => {
      active = false;
      clearInterval(id);
    };
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
              <SectionTitle className="mb-3">was listening to</SectionTitle>
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
                <SectionTitle>was listening to</SectionTitle>
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
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
function TodayTimeline({ events }: { events: CalEvent[] }) {
  const dayStart = 0; // for tick labels only
  const dayEnd = 24;
  // Local start/end of day for positioning
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  const totalMin = (endOfDay.getTime() - startOfDay.getTime()) / 60000;
  const [, forceTick] = React.useState(0);

  // Update "now" position once a minute
  React.useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const nowMin = clamp((Date.now() - startOfDay.getTime()) / 60000, 0, totalMin);
  const nowLeft = (nowMin / totalMin) * 100;

  const MIN_EVENT_MINUTES = 15;
  const layoutEvents = React.useMemo(() => {
    type Layout = {
      id: string;
      label: string;
      leftPct: number;
      widthPct: number;
      showText: boolean;
      allDay: boolean;
      lane: number;
      laneCount: number;
      groupId: number;
      startMin: number;
      endMin: number;
      eventDurationMin: number;
    };

    const prepared: Layout[] = events
      .map((ev) => {
        const s = parseCalDate(ev.start).getTime();
        const e = parseCalDate(ev.end).getTime();
        const cs = Math.max(s, startOfDay.getTime());
        const ce = Math.min(e, endOfDay.getTime());
        const startMin = clamp((cs - startOfDay.getTime()) / 60000, 0, totalMin);
        const endMin = clamp((ce - startOfDay.getTime()) / 60000, 0, totalMin);
        const eventDurationMin = Math.max(0, endMin - startMin);
        const widthPct = Math.max(2, (eventDurationMin / totalMin) * 100);
        const leftPct = (startMin / totalMin) * 100;
        const allDay = ev.allDay;
        const label = allDay ? `${ev.title} (All-day)` : ev.title;
        const showText = widthPct >= 6;
        return {
          id: ev.id,
          label,
          leftPct,
          widthPct,
          showText,
          allDay,
          lane: 0,
          laneCount: 1,
          groupId: -1,
          startMin,
          endMin,
          eventDurationMin,
        } as Layout;
      })
      .filter((item) => {
        if (item.allDay) return true;
        return item.eventDurationMin >= MIN_EVENT_MINUTES;
      })
      .sort((a, b) => {
        if (a.startMin !== b.startMin) return a.startMin - b.startMin;
        return a.endMin - b.endMin;
      });

    const active: { lane: number; endMin: number }[] = [];
    let currentGroupId = -1;
    const groupLaneCounts = new Map<number, number>();

    for (const item of prepared) {
      for (let i = active.length - 1; i >= 0; i--) {
        if (active[i].endMin <= item.startMin) {
          active.splice(i, 1);
        }
      }

      if (active.length === 0) {
        currentGroupId += 1;
      }

      const used = new Set(active.map((a) => a.lane));
      let lane = 0;
      while (used.has(lane)) lane += 1;

      item.lane = lane;
      item.groupId = currentGroupId;
      active.push({ lane, endMin: item.endMin });

      const prev = groupLaneCounts.get(currentGroupId) || 0;
      if (lane + 1 > prev) groupLaneCounts.set(currentGroupId, lane + 1);
    }

    return prepared.map((item) => ({
      ...item,
      laneCount: groupLaneCounts.get(item.groupId) || 1,
    }));
  }, [events, startOfDay.getTime(), endOfDay.getTime(), totalMin]);
  return (
    <div className="flex h-full flex-col space-y-3 sm:space-y-4">
      {/* Title sized like other cards */}
      <SectionTitle className="text-center">Jason's schedule today</SectionTitle>
      <div className="relative h-full w-full rounded-xl bg-white/70 overflow-hidden">
        <div className="absolute inset-0 rounded-xl border border-dark/20" />
        {Array.from({ length: dayEnd - dayStart + 1 }).map((_, i) => {
        const left = (i / (dayEnd - dayStart)) * 100;
        const label = dayStart + i; // 0..24 labels
        const isFirst = i === 0;
        const isLast = i === (dayEnd - dayStart);
        const leftStyle = isLast ? "calc(100% - 1px)" : `${left}%`;
        return (
          <div key={i} className="absolute top-0 h-full" style={{ left: leftStyle }}>
            <div className="h-full border-l border-dashed border-dark/30" />
            <div className={`absolute top-1 text-[10px] text-dark/60 group-hover:text-white/70 ${isFirst ? "" : isLast ? "-translate-x-full" : "-translate-x-1/2"}`}>{label}</div>
          </div>
        );
        })}
        {/* Now marker (local time) - spans entire day area and stays above events */}
        <div
          className="absolute inset-y-0 -translate-x-1/2 w-px bg-red-500 z-30"
          style={{ left: `${nowLeft}%` }}
          aria-hidden
        />
        <div className="absolute inset-0 pt-10 pb-5">
          <div className="relative h-full">
            {layoutEvents.map((item) => {
            const { leftPct, widthPct, label, showText, id, lane, laneCount } = item;
            const gapPct = laneCount > 1 ? 2 : 0;
            const totalGap = gapPct * (laneCount - 1);
            const heightPercent = laneCount ? Math.max(0, (100 - totalGap) / laneCount) : 100;
            const topPercent = lane * (heightPercent + gapPct);
            return (
              <div
                key={id}
                className="group absolute z-20 overflow-hidden rounded-md border border-dark/20 bg-[#4B9CD3]/15 backdrop-blur-sm"
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  top: `${topPercent}%`,
                  height: `${heightPercent}%`,
                }}
                title={label}
              >
                {showText && (
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="truncate text-[11px] font-medium text-dark/80 group-hover:text-white/80">{label}</span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 rounded-md ring-0 transition group-hover:ring-2 group-hover:ring-white/40" />
              </div>
            );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
