import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TrackCard from "../../components/ui/TrackCard";
import type { LastFmTrack } from "../../lib/lastfm";

describe("TrackCard Component", () => {
  const sampleTrack: LastFmTrack = {
    id: "sample-1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    url: "https://www.last.fm/music/M83/_/Midnight+City",
    nowPlaying: false,
    playedAt: new Date().toISOString(),
  };

  it("renders track title, artist, and album name", () => {
    render(<TrackCard track={sampleTrack} />);

    expect(screen.getByText(/Midnight City/i)).toBeInTheDocument();
    expect(screen.getByText(/M83/i)).toBeInTheDocument();
    expect(screen.getByText(/Hurry Up, We're Dreaming/i)).toBeInTheDocument();
  });

  it("displays NOW_PLAYING badge when nowPlaying is true", () => {
    const playingTrack: LastFmTrack = { ...sampleTrack, nowPlaying: true };
    render(<TrackCard track={playingTrack} />);

    expect(screen.getByText(/NOW_PLAYING/i)).toBeInTheDocument();
  });

  it("provides proper aria-label for accessibility", () => {
    render(<TrackCard track={sampleTrack} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "Open Midnight City by M83 on Last.fm");
  });
});
