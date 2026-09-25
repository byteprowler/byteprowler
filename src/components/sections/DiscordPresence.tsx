/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Gamepad2, RefreshCw, ShieldAlert, Signal, UserRound } from "lucide-react";
import { fetchDiscordPresence } from "../../lib/discordPresence";

function formatSyncTime(updatedAt: number) {
  if (!updatedAt) return "NEVER";
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(updatedAt));
}

function DiscordState({ label, copy, tone }: { label: string; copy: string; tone: "purple" | "red" | "neutral" }) {
  const toneClass =
    tone === "red"
      ? "border-red-500/25 bg-red-500/5 text-red-300"
      : tone === "purple"
        ? "border-neon-purple/20 bg-neon-purple/5 text-neon-purple"
        : "border-white/10 bg-white/3 text-gray-300";

  return (
    <div className={`rounded-sm border p-4 text-sm leading-relaxed ${toneClass}`}>
      <div className="mb-2 flex items-center gap-2 font-mono text-xs font-black uppercase tracking-widest">
        <ShieldAlert className="h-4 w-4" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="text-gray-300">{copy}</p>
    </div>
  );
}

export default function DiscordPresence() {
  const { data, error, isFetching, isLoading, dataUpdatedAt, refetch } = useQuery({
    queryKey: ["discordPresence"],
    queryFn: fetchDiscordPresence,
    staleTime: 1000 * 60,
  });

  const presence = data?.presence;
  const isMissingId = data?.configured === false || data?.message === "DISCORD_ID_MISSING";
  const isOffline = !!error || data?.message === "DISCORD_SIGNAL_OFFLINE";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-sm border border-white/5 bg-black/35 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-mono text-[10.5px] uppercase tracking-widest text-gray-300">
          <span className="font-black text-neon-purple">DISCORD_SIGNAL</span>
          <span className="ml-2">LAST_SYNC: {formatSyncTime(dataUpdatedAt)}</span>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Refresh Discord signal"
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-sm border border-neon-purple/25 bg-black/60 px-3 py-2 font-mono text-[10.5px] font-black uppercase tracking-widest text-neon-purple transition hover:border-neon-purple hover:bg-neon-purple/10 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
          {isFetching ? "SYNCING..." : "REFRESH_SIGNAL"}
        </button>
      </div>

      {isLoading ? (
        <div className="min-h-28 animate-pulse rounded-sm border border-white/10 bg-white/3">
          <span className="sr-only">SYNCING_DISCORD_SIGNAL</span>
        </div>
      ) : isMissingId ? (
        <DiscordState tone="purple" label="DISCORD_ID_MISSING" copy="Add NEXT_PUBLIC_DISCORD_USER_ID to enable the public Lanyard presence signal." />
      ) : isOffline ? (
        <DiscordState tone="red" label="DISCORD_SIGNAL_OFFLINE" copy="Discord presence could not be synced through the public signal endpoint." />
      ) : !presence || presence.status === "offline" ? (
        <DiscordState tone="neutral" label="DISCORD_SIGNAL_IDLE" copy="The operator presence signal is currently offline or idle." />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-1">
          {/* <div className="flex min-w-0 gap-3 rounded-sm border border-neon-purple/20 bg-black/55 p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-neon-purple/20 bg-[#08090d]">
              {presence.avatarUrl ? (
                <img src={presence.avatarUrl} alt={`${presence.username || "Discord user"} avatar`} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-6 w-6 text-neon-purple" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 font-mono">
              <div className="text-[10px] font-black uppercase tracking-widest text-neon-purple">
                STATUS: {presence.status}
              </div>
              <h4 className="mt-1 truncate text-sm font-black uppercase text-white">
                {presence.username || "Discord Operator"}
              </h4>
              <p className="mt-1 text-xs uppercase leading-relaxed text-gray-300">
                {presence.activityName ? `${presence.activityType || "ACTIVITY"} // ${presence.activityName}` : "NO_PUBLIC_ACTIVITY"}
              </p>
              {presence.details && <p className="mt-1 text-[11px] uppercase text-gray-400">{presence.details}</p>}
              {presence.state && <p className="mt-1 text-[11px] uppercase text-gray-400">{presence.state}</p>}
            </div>
          </div> */}

          <div className="flex min-w-0 gap-3 rounded-sm border border-neon-blue/15 bg-black/55 p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-neon-blue/20 bg-[#08090d]">
              {presence.spotify?.albumArtUrl ? (
                <img src={presence.spotify.albumArtUrl} alt={`Album artwork for ${presence.spotify.song || "Spotify track"}`} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <Signal className="h-6 w-6 text-neon-blue" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 font-mono">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neon-blue">
                <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                ACTIVITY_CACHE
              </div>
              <h4 className="mt-1 truncate text-sm font-black uppercase text-white">
                {presence.spotify?.song || presence.activityName || "NO_PUBLIC_SIGNAL"}
              </h4>
              <p className="mt-1 truncate text-xs font-bold uppercase text-neon-lime">
                {presence.spotify?.artist || presence.activityType || "SIGNAL_STANDBY"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
