import { NextResponse } from "next/server";
import * as ical from "node-ical";

// Always run on demand; do not prerender
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export async function GET(req: Request) {
  try {
    const raw = process.env.APPLE_ICS_URL || "";
    if (!raw) {
      return NextResponse.json(
        { events: [], reason: "No APPLE_ICS_URL set" },
        { status: 200 }
      );
    }
    const icsUrl = toHttps(raw);

    const res = await fetch(icsUrl, {
      cache: "no-store",
      headers: {
        // Some calendar hosts are picky without a UA
        "User-Agent": "Mozilla/5.0 (compatible; JasonInDataBot/1.0)",
        Accept: "text/calendar, text/plain;q=0.9,*/*;q=0.8",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { events: [], error: await res.text() },
        { status: 200 }
      );
    }
    const text = await res.text();

    // Parse ICS (support node-ical variants)
    const parser: any = ical as any;
    const data = parser?.parseICS ? parser.parseICS(text) : parser?.sync?.parseICS(text);

    // Compute "today" window in a specific timezone (default to America/New_York)
    // This avoids server timezone drift (e.g., UTC) causing wrong-day filtering.
    const url = new URL(req.url);
    const qp = url.searchParams;
    const tz = (qp.get("tz") || process.env.CAL_TZ || "America/New_York").trim();

    function getTzParts(date: Date) {
      const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const parts = Object.fromEntries(dtf.formatToParts(date).map((p) => [p.type, p.value]));
      return {
        year: Number(parts.year),
        month: Number(parts.month),
        day: Number(parts.day),
        hour: Number(parts.hour),
        minute: Number(parts.minute),
        second: Number(parts.second),
      };
    }

    // Derive midnight in tz by subtracting the tz wall-clock hh:mm:ss
    const now = new Date();
    const np = getTzParts(now);
    const defaultStart = new Date(
      now.getTime() - (((np.hour * 60 + np.minute) * 60 + np.second) * 1000 + now.getMilliseconds())
    );
    const defaultEnd = new Date(defaultStart.getTime() + 24 * 60 * 60 * 1000 - 1);

    const timeMin = qp.get("timeMin") || qp.get("from");
    const timeMax = qp.get("timeMax") || qp.get("to");
    const winStart = timeMin ? new Date(timeMin) : defaultStart;
    const winEnd = timeMax ? new Date(timeMax) : defaultEnd;

    const events: CalEvent[] = [];

    for (const [key, val] of Object.entries<any>(data)) {
      if (!val || val.type !== "VEVENT") continue;
      const v: any = val;

      // Helper to push one instance (clamped to today)
      const pushInstance = (s: Date, e: Date, title: string) => {
        if (!inWindow(s, e, winStart, winEnd)) return;
        const allDay =
          (s.getHours() === 0 && s.getMinutes() === 0 && e.getHours() === 0 && e.getMinutes() === 0) ||
          v.datetype === "date";
        const clampedStart = new Date(Math.max(s.getTime(), winStart.getTime()));
        const clampedEnd = new Date(Math.min(e.getTime(), winEnd.getTime()));
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
        // Expand a little before the window to capture ongoing events crossing the boundary
        const padStart = new Date(winStart.getTime() - durationMs);
        const between = v.rrule.between(padStart, winEnd, true);
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
