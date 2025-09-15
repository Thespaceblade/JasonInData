"use client";
import * as React from "react";
import { StatusCard, Pill } from "@/components/status/StatusCard";

type TrackState = {
  isPlaying: boolean;
  title: string | null;
  artist: string | null;
  url: string | null;
  albumImageUrl: string | null;
};

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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {/* Top-left: keep your battery/status/etc. */}
      <div className="col-span-1 aspect-square">
        <StatusCard tone="grey" className="h-full text-base sm:text-lg">
          has <Pill className="mx-2">80%</Pill> battery left
        </StatusCard>
      </div>

      {/* Top-right: SPOTIFY (REPLACED CONTENT) */}
      <div className="col-span-1 aspect-square">
        <StatusCard tone="grey" className="h-full text-base sm:text-lg">
          {track?.title ? (
            <div className="space-y-2">
              <div>was listening to</div>
              <a
                href={track.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2"
                aria-label={`Open ${track.title} on Spotify`}
              >
                <Pill>{track.title}</Pill>
                <span className="text-sm opacity-70">by {track.artist}</span>
              </a>
            </div>
          ) : (
            <>
              was listening to
              <br />
              <Pill>…</Pill>
            </>
          )}
        </StatusCard>
      </div>

      {/* Bottom wide: keep your existing rectangle content */}
      <div className="sm:col-span-2 h-[200px]">
        <StatusCard tone="grey" className="h-full text-base sm:text-lg">
          is <Pill className="mx-2">60,735,917</Pill> seconds old! My next solar orbit is in
          <Pill className="mx-2">340</Pill> days
        </StatusCard>
      </div>
    </div>
  );
}
