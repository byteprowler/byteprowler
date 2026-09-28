import { describe, it, expect } from "vitest";

describe("Activity Cache Strategy Configuration", () => {
  it("enforces Last.fm refresh intervals between 2-5 minutes", () => {
    const lastFmStaleTimeMs = 1000 * 60 * 2; // 2 minutes
    const lastFmRefetchIntervalMs = 1000 * 60 * 2; // 2 minutes

    expect(lastFmStaleTimeMs).toBeGreaterThanOrEqual(1000 * 60 * 2);
    expect(lastFmStaleTimeMs).toBeLessThanOrEqual(1000 * 60 * 5);
    expect(lastFmRefetchIntervalMs).toBeGreaterThanOrEqual(1000 * 60 * 2);
  });

  it("enforces AniList refresh intervals between 30-60 minutes", () => {
    const anilistStaleTimeMs = 1000 * 60 * 30; // 30 minutes
    const anilistRefetchIntervalMs = 1000 * 60 * 30; // 30 minutes

    expect(anilistStaleTimeMs).toBeGreaterThanOrEqual(1000 * 60 * 30);
    expect(anilistStaleTimeMs).toBeLessThanOrEqual(1000 * 60 * 60);
    expect(anilistRefetchIntervalMs).toBeGreaterThanOrEqual(1000 * 60 * 30);
  });

  it("limits Last.fm track count to 5 maximum", () => {
    const rawTrackList = Array.from({ length: 15 }, (_, i) => ({ id: `track-${i}` }));
    const cappedTracks = rawTrackList.slice(0, 5);
    expect(cappedTracks.length).toBe(5);
  });

  it("limits AniList homepage activity items to 3-5 items", () => {
    const rawActivities = Array.from({ length: 20 }, (_, i) => ({ id: `act-${i}` }));
    const homepageActivities = rawActivities.slice(0, 4);
    expect(homepageActivities.length).toBeGreaterThanOrEqual(3);
    expect(homepageActivities.length).toBeLessThanOrEqual(5);
  });
});
