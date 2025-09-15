import { NextResponse } from "next/server";
import * as ical from "node-ical";

function toHttps(url: string) {
  return url.startsWith("webcal://") ? "https://" + url.slice("webcal://".length) : url;
}

type CalEvent = {
  id: string;
  title: string;
  start: string; // ISO
  end: string; // ISO
  allDay: boolean;
};

function inWindow(s: Date, e: Date, winStart: Date, winEnd: Date) {
  return e >= winStart && s <= winEnd;
}

export async function GET() {
  try {
    const raw = process.env.APPLE_ICS_URL || "";
    if (!raw) {
      return NextResponse.json(
        { events: [], reason: "No APPLE_ICS_URL set" },
        { status: 200 }
      );
    }
    const icsUrl = toHttps(raw);

    const res = await fetch(icsUrl, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { events: [], error: await res.text() },
        { status: 200 }
      );
    }
    const text = await res.text();

    // Parse ICS (support node-ical variants)
    const parser: any = (ical as any);
    const data = parser?.sync?.parseICS ? parser.sync.parseICS(text) : parser.parseICS(text);

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const events: CalEvent[] = [];

    for (const [key, val] of Object.entries<any>(data)) {
      if (!val || val.type !== "VEVENT") continue;
      const v: any = val;

      // Helper to push one instance (clamped to today)
      const pushInstance = (s: Date, e: Date, title: string) => {
        if (!inWindow(s, e, startOfDay, endOfDay)) return;
        const allDay =
          (s.getHours() === 0 && s.getMinutes() === 0 && e.getHours() === 0 && e.getMinutes() === 0) ||
          v.datetype === "date";
        const clampedStart = new Date(Math.max(s.getTime(), startOfDay.getTime()));
        const clampedEnd = new Date(Math.min(e.getTime(), endOfDay.getTime()));
        events.push({
          id: (v.uid || key) + "_" + clampedStart.toISOString(),
          title: title || "Event",
          start: clampedStart.toISOString(),
          end: clampedEnd.toISOString(),
          allDay,
        });
      };

      const baseStart: Date = new Date(v.start);
      const baseEnd: Date = new Date(v.end || v.start);
      const durationMs = baseEnd.getTime() - baseStart.getTime();

      // Recurrence expansion
      if (v.rrule) {
        // Respect EXDATE
        const exdates: Record<string, true> = {};
        if (v.exdate) {
          for (const ex of Object.values(v.exdate as Record<string, Date>)) {
            const d = new Date(ex as any).toISOString();
            exdates[d] = true;
          }
        }
        const between = v.rrule.between(startOfDay, endOfDay, true);
        for (const dt of between) {
          const start = new Date(dt);
          const end = new Date(start.getTime() + durationMs);
          const keyIso = start.toISOString();
          if (exdates[keyIso]) continue;
          pushInstance(start, end, v.summary);
        }
        // Also include explicit recurrences if present
        if (v.recurrences) {
          for (const inst of Object.values(v.recurrences)) {
            const s = new Date((inst as any).start || baseStart);
            const e = new Date((inst as any).end || new Date(s.getTime() + durationMs));
            pushInstance(s, e, (inst as any).summary || v.summary);
          }
        }
      } else {
        // Single event
        pushInstance(baseStart, baseEnd, v.summary);
      }
    }

    events.sort((a, b) => +new Date(a.start) - +new Date(b.start));

    return NextResponse.json(
      { events },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { events: [], error: e?.message || "parse error" },
      { status: 200 }
    );
  }
}

