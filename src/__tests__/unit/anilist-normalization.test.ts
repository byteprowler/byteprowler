import { describe, it, expect } from "vitest";
import { normalizeActivity, determineActivityKind, type AniListActivityNode } from "../../lib/anilist";

describe("AniList API Normalization", () => {
  it("maps valid activity node to AniListActivityItem correctly", () => {
    const rawNode: AniListActivityNode = {
      id: 98765,
      status: "watched episode",
      progress: "Episode 24",
      createdAt: 1711234567,
      likeCount: 15,
      replyCount: 3,
      siteUrl: "https://anilist.co/activity/98765",
      media: {
        type: "ANIME",
        format: "TV",
        siteUrl: "https://anilist.co/anime/113415",
        title: {
          english: "JUJUTSU KAISEN",
          romaji: "Jujutsu Kaisen",
        },
        coverImage: {
          medium: "https://s4.anilist.co/cover-med.png",
          large: "https://s4.anilist.co/cover-large.png",
        },
      },
    };

    const normalized = normalizeActivity(rawNode);
    expect(normalized).not.toBeNull();
    expect(normalized?.id).toBe("98765");
    expect(normalized?.title).toBe("JUJUTSU KAISEN");
    expect(normalized?.action).toBe("watched episode");
    expect(normalized?.progress).toBe("Episode 24");
    expect(normalized?.mediaType).toBe("ANIME");
    expect(normalized?.mediaFormat).toBe("TV");
    expect(normalized?.coverImage).toBe("https://s4.anilist.co/cover-med.png");
    expect(normalized?.likes).toBe(15);
    expect(normalized?.replies).toBe(3);
    expect(normalized?.kind).toBe("watching");
  });

  it("handles missing media fields gracefully without throwing", () => {
    const incompleteNode: AniListActivityNode = {
      id: 11111,
      media: {
        title: {
          romaji: "Solo Leveling",
          english: null,
        },
      },
    };

    const normalized = normalizeActivity(incompleteNode);
    expect(normalized).not.toBeNull();
    expect(normalized?.title).toBe("Solo Leveling");
    expect(normalized?.mediaType).toBe("ANIME"); // default fallback
    expect(normalized?.action).toBe("updated");
    expect(normalized?.progress).toBeUndefined();
    expect(normalized?.likes).toBe(0);
  });

  it("returns null if node or node.media is missing", () => {
    expect(normalizeActivity({})).toBeNull();
    expect(normalizeActivity({ id: 12345 })).toBeNull();
  });

  it("determineActivityKind() detects completed, watching, reading, planning correctly", () => {
    expect(determineActivityKind("completed", "12")).toBe("completed");
    expect(determineActivityKind("watched episode", "Episode 4")).toBe("watching");
    expect(determineActivityKind("read chapter", "Chapter 10")).toBe("reading");
    expect(determineActivityKind("plans to watch")).toBe("planning");
  });
});
