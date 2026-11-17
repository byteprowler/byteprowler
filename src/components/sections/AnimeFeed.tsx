import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert, Cpu, Radio } from "lucide-react";
import { fetchFavoriteAnime, fallbackAnimeList } from "../../lib/anilist";
import AnimeCard from "../ui/AnimeCard";
import { siteSettings } from "../../lib/content/siteSettings";

export default function AnimeFeed() {
  const username = siteSettings.anilistUsername || process.env.ANILIST_USERNAME || "";
  const hasUsername = !!username.trim();

  const { data, isLoading, error } = useQuery({
    queryKey: ["anilistFavorites", username],
    queryFn: () => fetchFavoriteAnime(username),
    enabled: hasUsername,
    staleTime: 1000 * 60 * 20,
  });

  const showFallback = !hasUsername || !!error;
  const animeData = showFallback ? fallbackAnimeList : data || [];

  return (
    <section id="anime" className="py-12 md:py-24 border-t border-neon-lime/5 scroll-mt-20">
      <div className="flex items-center gap-2 mb-8 font-mono text-xs text-gray-400">
        <span className="text-neon-lime font-mono">[05]</span>
        <span className="tracking-widest font-semibold uppercase">ANIMEFEED // WATCHLIST_CACHE</span>
        <div className="flex-grow h-px bg-neon-lime/10" />
        <span className="text-[10px] text-neon-lime/40 uppercase">PERSONAL_CACHE</span>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase font-sans tracking-tight">
              AnimeFeed
            </h3>
            <p className="text-sm font-mono text-gray-400 uppercase">
              {"// Personal media cache: favorite anime entries detected."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-[10px] px-3 py-1.5 bg-black/40 border border-white/5 rounded-xs">
            <Radio className={`w-3.5 h-3.5 ${hasUsername && !error ? "text-neon-green animate-pulse" : "text-neon-purple"}`} aria-hidden="true" />
            <span className="text-gray-400">CONN_GATEWAY:</span>
            <span className={hasUsername && !error ? "text-neon-green font-bold" : "text-neon-purple font-bold"}>
              {!hasUsername ? "ANILIST_USERNAME_MISSING" : error ? "FAVORITES_SIGNAL_OFFLINE" : `ANILIST_NODE_CONN (${username.toUpperCase()})`}
            </span>
          </div>
        </div>

        {!hasUsername && (
          <div className="border border-neon-purple/20 bg-neon-purple/5 p-4 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono text-[10.5px] leading-relaxed text-gray-400">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-white font-black uppercase tracking-wider">ANILIST_USERNAME_MISSING</span>
                <span className="mt-0.5 max-w-2xl font-mono text-[10px] text-gray-400 leading-normal">
                  Add NEXT_PUBLIC_ANILIST_USERNAME to show live favorites. Showing a compact local favorites cache for now.
                </span>
              </div>
            </div>
            <div className="bg-black/60 border border-white/10 px-3 py-2 rounded-xs flex flex-col gap-1 w-full md:w-auto font-mono text-[10px]">
              <span className="text-neon-purple font-bold">{"// .env.local"}</span>
              <code className="text-neon-lime break-all">NEXT_PUBLIC_ANILIST_USERNAME=your_username</code>
            </div>
          </div>
        )}

        {hasUsername && error && (
          <div className="border border-red-500/20 bg-red-500/5 p-4 rounded-sm flex items-start gap-3 font-mono text-[10.5px] leading-relaxed text-gray-400">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-white font-black uppercase tracking-wider">FAVORITES_SIGNAL_OFFLINE</span>
              <span className="mt-0.5 text-red-300 font-semibold font-mono text-[10px]">
                Favorite anime could not be synced. Showing local cache fallback.
              </span>
            </div>
          </div>
        )}

        {hasUsername && isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-4 font-mono select-none">
            <Cpu className="w-8 h-8 text-neon-purple animate-spin" aria-hidden="true" />
            <div className="flex flex-col items-center text-center gap-1">
              <span className="text-xs font-black text-white uppercase tracking-widest animate-pulse">SYNCING_FAVORITES</span>
              <span className="text-[10.5px] text-gray-500 uppercase">Querying AniList favorites cache.</span>
            </div>
          </div>
        ) : animeData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {animeData.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-white/10 bg-white/[0.03] p-4 font-mono text-sm text-gray-300">
            NO_FAVORITE_ANIME_FOUND
          </div>
        )}
      </div>
    </section>
  );
}