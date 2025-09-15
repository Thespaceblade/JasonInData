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

      {/* Bottom wide rectangle */}
      <motion.div className="sm:col-span-2 h-[200px] sm:h-[240px]" whileHover={{ scale: 1.03 }}>
        <StatusCard tone="grey" className="h-full text-base sm:text-lg">
          is <Pill className="mx-2">---</Pill> ----
          <Pill className="mx-2">340</Pill> ---
        </StatusCard>
      </motion.div>
    </div>
  );
}
