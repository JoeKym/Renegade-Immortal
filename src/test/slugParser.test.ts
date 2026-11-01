import { describe, it, expect } from "vitest";
import { parseWatchSlug, buildWatchUrl, buildCanonicalWatchUrl } from "@/lib/slugParser";
import type { DonghuaSeries } from "@/data/donghuaData";

describe("parseWatchSlug", () => {
  it("resolves exact series ID without episode", () => {
    expect(parseWatchSlug("renegade-immortal")).toEqual({
      donghuaId: "renegade-immortal",
      episodeNumber: null,
      isEpisode: false,
    });

    expect(parseWatchSlug("beyond-times-gaze")).toEqual({
      donghuaId: "beyond-times-gaze",
      episodeNumber: null,
      isEpisode: false,
    });

    expect(parseWatchSlug("tales-of-herding-gods")).toEqual({
      donghuaId: "tales-of-herding-gods",
      episodeNumber: null,
      isEpisode: false,
    });
  });

  it("resolves series alias to canonical ID", () => {
    expect(parseWatchSlug("xian-ni")).toEqual({
      donghuaId: "renegade-immortal",
      episodeNumber: null,
      isEpisode: false,
    });
  });

  it("resolves series added to the managed catalog", () => {
    const managedSeries: DonghuaSeries = {
      id: "new-donghua-feature-film",
      title: "New Donghua Feature Film",
      searchQuery: "New Donghua Feature Film",
      anilistSearch: "New Donghua Feature Film",
      jikanSearch: "New Donghua Feature Film",
      nextEpisodeSlug: "new-donghua-feature-film",
      thumbnail: "https://example.com/film.jpg",
    };

    expect(parseWatchSlug("new-donghua-feature-film-episode-1", [managedSeries])).toEqual({
      donghuaId: "new-donghua-feature-film",
      episodeNumber: 1,
      isEpisode: true,
    });
  });

  it("resolves episode with -episode-N syntax", () => {
    expect(parseWatchSlug("renegade-immortal-episode-131")).toEqual({
      donghuaId: "renegade-immortal",
      episodeNumber: 131,
      isEpisode: true,
    });

    expect(parseWatchSlug("beyond-times-gaze-episode-1")).toEqual({
      donghuaId: "beyond-times-gaze",
      episodeNumber: 1,
      isEpisode: true,
    });

    expect(parseWatchSlug("swallowed-star-episode-246")).toEqual({
      donghuaId: "swallowed-star",
      episodeNumber: 246,
      isEpisode: true,
    });
  });

  it("resolves episode with -ep-N and -N shorthand", () => {
    expect(parseWatchSlug("renegade-immortal-ep-50")).toEqual({
      donghuaId: "renegade-immortal",
      episodeNumber: 50,
      isEpisode: true,
    });

    expect(parseWatchSlug("renegade-immortal-163")).toEqual({
      donghuaId: "renegade-immortal",
      episodeNumber: 163,
      isEpisode: true,
    });
  });

  it("differentiates longer series IDs from prefixes accurately", () => {
    expect(parseWatchSlug("battle-through-the-heavens-three-year-agreement-episode-13")).toEqual({
      donghuaId: "battle-through-the-heavens-three-year-agreement",
      episodeNumber: 13,
      isEpisode: true,
    });

    expect(parseWatchSlug("battle-through-the-heavens-episode-13")).toEqual({
      donghuaId: "battle-through-the-heavens",
      episodeNumber: 13,
      isEpisode: true,
    });
  });

  it("returns null for completely invalid slugs", () => {
    expect(parseWatchSlug("non-existent-donghua-series")).toEqual({
      donghuaId: null,
      episodeNumber: null,
      isEpisode: false,
    });

    expect(parseWatchSlug("beyond-times-gaze-episode-invalid")).toEqual({
      donghuaId: null,
      episodeNumber: null,
      isEpisode: false,
    });

    expect(parseWatchSlug("")).toEqual({
      donghuaId: null,
      episodeNumber: null,
      isEpisode: false,
    });
  });
});

describe("buildWatchUrl & buildCanonicalWatchUrl", () => {
  it("generates correct watch URLs", () => {
    expect(buildWatchUrl("beyond-times-gaze")).toBe("/watch/beyond-times-gaze");
    expect(buildWatchUrl("beyond-times-gaze", 1)).toBe("/watch/beyond-times-gaze-episode-1");
    expect(buildWatchUrl("renegade-immortal", 131)).toBe("/watch/renegade-immortal-episode-131");
  });

  it("generates correct canonical URLs", () => {
    expect(buildCanonicalWatchUrl("renegade-immortal", 131, "https://renegadeimmortal.com")).toBe(
      "https://renegadeimmortal.com/watch/renegade-immortal-episode-131"
    );
  });
});
