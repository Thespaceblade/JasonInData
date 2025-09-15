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
        <div ref={textRef}>{text}</div>
      </div>
    );
  }

  const duration = Math.max(6, Math.min(18, delta / 20));

  return (
    <div ref={containerRef} className="overflow-hidden">
      <motion.div
        ref={textRef}
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
      {/* Top-left: keep your battery/status/etc. */}
      <motion.div whileHover={{ scale: 1.03 }}>
        <StatusCard tone="grey" className="h-full text-base sm:text-lg">
          has <Pill className="mx-2">80%</Pill> battery left
        </StatusCard>
      </motion.div>

      {/* Top-right: SPOTIFY (REPLACED CONTENT) */}
      <motion.div whileHover={{ scale: 1.03 }}>
        <StatusCard tone="grey" className="h-full">
          {track?.title ? (
            <div className="flex items-center gap-4">
              {track.albumImageUrl ? (
                <img
                  src={track.albumImageUrl}
                  alt={track.title ?? "Album cover"}
                  className="h-20 w-20 rounded-md object-cover flex-shrink-0"
                />)
              : (
                <div className="h-20 w-20 rounded-md bg-black/10 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold">
                  <MarqueeTitle text={track.title} />
                </div>
                <div className="text-sm opacity-70 truncate">{track.artist}</div>
                <a
                  href={track.url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${track.title} on Spotify`}
                  className="sr-only"
                >Open on Spotify</a>
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

      {/* Bottom wide: keep your existing rectangle content */}
      <motion.div className="sm:col-span-2" whileHover={{ scale: 1.03 }}>
        <StatusCard tone="grey" className="h-full text-base sm:text-lg">
          is <Pill className="mx-2">60,735,917</Pill> seconds old! My next solar orbit is in
          <Pill className="mx-2">340</Pill> days
        </StatusCard>
      </motion.div>
    </div>
  );
}
