import { describe, it, expect } from "vitest";
import { normalizeTrack, pickImage } from "../../lib/lastfm";

describe("Last.fm Normalization", () => {
  it("normalizes standard track accurately", () => {
    const rawTrack = {
      name: "Resonance",
      artist: { "#text": "HOME" },
      album: { "#text": "Odyssey" },
      url: "https://www.last.fm/music/HOME/_/Resonance",
      date: { uts: "1711234000", "#text": "23 Mar 2024, 22:46" },
      image: [
        { size: "small", "#text": "https://lastfm.freetls.fastly.net/small.png" },
        { size: "large", "#text": "https://lastfm.freetls.fastly.net/large.png" },
      ],
    };

    const track = normalizeTrack(rawTrack, 1);
    expect(track.title).toBe("Resonance");
    expect(track.artist).toBe("HOME");
    expect(track.album).toBe("Odyssey");
    expect(track.url).toBe("https://www.last.fm/music/HOME/_/Resonance");
    expect(track.nowPlaying).toBe(false);
    expect(track.image).toBe("https://lastfm.freetls.fastly.net/large.png");
    expect(track.playedAt).toBeDefined();
  });

  it("detects now playing track correctly", () => {
    const rawPlaying = {
      name: "Cyberpunk 2077 Theme",
      artist: { "#text": "Marcin Przybyłowicz" },
      "@attr": { nowplaying: "true" },
    };

    const track = normalizeTrack(rawPlaying, 0);
    expect(track.nowPlaying).toBe(true);
    expect(track.playedAt).toBeUndefined();
    expect(track.title).toBe("Cyberpunk 2077 Theme");
  });

  it("handles missing track fields safely with fallbacks", () => {
    const emptyTrack = {};
    const track = normalizeTrack(emptyTrack, 0);
    expect(track.title).toBe("Unknown Track");
    expect(track.artist).toBe("Unknown Artist");
    expect(track.nowPlaying).toBe(false);
    expect(track.image).toBeUndefined();
  });

  it("pickImage() selects highest resolution available image", () => {
    const images = [
      { size: "small", "#text": "small.jpg" },
      { size: "medium", "#text": "medium.jpg" },
      { size: "extralarge", "#text": "extralarge.jpg" },
    ];
    expect(pickImage(images)).toBe("extralarge.jpg");
    expect(pickImage([])).toBeUndefined();
  });
});
