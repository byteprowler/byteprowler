import type { NextApiRequest, NextApiResponse } from "next";
import { fetchRecentLastFmTracks, type LastFmTrack } from "../../../lib/lastfm";

interface LastFmRecentResponse {
  configured: boolean;
  tracks: LastFmTrack[];
  message?: "METHOD_NOT_ALLOWED" | "LASTFM_CONFIG_MISSING" | "LASTFM_SIGNAL_OFFLINE";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<LastFmRecentResponse>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ configured: false, tracks: [], message: "METHOD_NOT_ALLOWED" });
  }

  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      configured: false,
      tracks: [],
      message: "LASTFM_CONFIG_MISSING",
    });
  }

  try {
    const refreshToken = typeof req.query.refresh === "string" ? req.query.refresh : undefined;
    const tracks = await fetchRecentLastFmTracks({ apiKey, username, limit: 6, cacheBust: refreshToken });
    const isManualRefresh = Boolean(refreshToken);
    res.setHeader(
      "Cache-Control",
      isManualRefresh ? "no-store, max-age=0" : "s-maxage=60, stale-while-revalidate=240"
    );
    return res.status(200).json({ configured: true, tracks: tracks.slice(0, 6) });
  } catch (error) {
    console.error("LASTFM_SIGNAL_OFFLINE", error instanceof Error ? error.message : error);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      configured: true,
      tracks: [],
      message: "LASTFM_SIGNAL_OFFLINE",
    });
  }
}
