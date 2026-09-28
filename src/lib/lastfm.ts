export interface LastFmTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  image?: string;
  url?: string;
  nowPlaying: boolean;
  playedAt?: string;
}

interface LastFmImage {
  size: string;
  "#text": string;
}

interface LastFmRecentTrack {
  name?: string;
  artist?: { "#text"?: string };
  album?: { "#text"?: string };
  image?: LastFmImage[];
  url?: string;
  date?: { uts?: string; "#text"?: string };
  "@attr"?: { nowplaying?: string };
}

interface LastFmRecentTracksResponse {
  recenttracks?: {
    track?: LastFmRecentTrack | LastFmRecentTrack[];
  };
  error?: number;
  message?: string;
}

export function pickImage(images: LastFmImage[] = []) {
  const preferred = [...images].reverse().find((image) => image["#text"]);
  return preferred?.["#text"] || undefined;
}

export function normalizeTrack(track: LastFmRecentTrack, index = 0): LastFmTrack {
  const playedAt = track.date?.uts ? new Date(Number(track.date.uts) * 1000).toISOString() : undefined;
  const title = track.name || "Unknown Track";
  const artist = track.artist?.["#text"] || "Unknown Artist";
  const album = track.album?.["#text"] || undefined;
  const url = track.url || undefined;

  return {
    id: [artist, title, playedAt || "now", index].join("::"),
    title,
    artist,
    album,
    image: pickImage(track.image),
    url,
    nowPlaying: track["@attr"]?.nowplaying === "true",
    playedAt,
  };
}

export async function fetchRecentLastFmTracks({
  apiKey,
  username,
  limit = 6,
}: {
  apiKey: string;
  username: string;
  limit?: number;
}) {
  const safeLimit = Math.min(Math.max(limit, 1), 6);
  const params = new URLSearchParams({
    method: "user.getRecentTracks",
    user: username,
    api_key: apiKey,
    format: "json",
    limit: String(safeLimit),
  });

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Last.fm responded with HTTP ${response.status}`);
  }

  const payload = (await response.json()) as LastFmRecentTracksResponse;

  if (payload.error) {
    throw new Error(payload.message || "Last.fm request failed");
  }

  const rawTracks = payload.recenttracks?.track;
  const tracks = Array.isArray(rawTracks) ? rawTracks : rawTracks ? [rawTracks] : [];
  return tracks.slice(0, safeLimit).map(normalizeTrack);
}
