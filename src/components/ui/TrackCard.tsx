/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ExternalLink, Radio } from "lucide-react";
import type { LastFmTrack } from "../../lib/lastfm";

interface TrackCardProps {
  track: LastFmTrack;
}

function formatPlayedAt(playedAt?: string) {
  if (!playedAt) return "LIVE_SIGNAL";

  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(new Date(playedAt));
  } catch {
    return "RECENT_SIGNAL";
  }
}

export default function TrackCard({ track }: TrackCardProps) {
  const trackUrl = track.url || "https://www.last.fm/";
  const albumLabel = track.album || "Unknown Album";

  return (
    <a
      href={trackUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${track.title} by ${track.artist} on Last.fm`}
      className="group flex min-w-0 gap-3 rounded-sm border border-white/10 bg-black/55 p-3 transition hover:border-neon-blue/40 hover:bg-neon-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-neon-lime/15 bg-[#08090d]">
        {track.image ? (
          <img
            src={track.image}
            alt={`Album artwork for ${albumLabel}`}
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] font-black text-neon-lime/70">
            FM
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-gray-300">
          <Radio className={`h-3 w-3 shrink-0 ${track.nowPlaying ? "text-neon-green" : "text-neon-blue"}`} aria-hidden="true" />
          <span className={track.nowPlaying ? "font-black text-neon-green" : "font-bold text-neon-blue"}>
            {track.nowPlaying ? "NOW_PLAYING" : "RECENT_TRACK"}
          </span>
          <span className="min-w-0 truncate text-gray-500">{formatPlayedAt(track.playedAt)}</span>
        </div>

        <h4 className="min-w-0 truncate text-sm font-black uppercase text-white">
          {track.title}
        </h4>
        <p className="min-w-0 truncate font-mono text-xs font-bold uppercase text-neon-lime">
          {track.artist}
        </p>
        <p className="min-w-0 truncate font-mono text-[11px] uppercase text-gray-400">
          {albumLabel}
        </p>
      </div>

      <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-500 transition group-hover:text-neon-blue" aria-hidden="true" />
    </a>
  );
}