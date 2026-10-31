import { describe, it, expect } from "vitest";
import { parseWatchSlug, buildWatchUrl } from "@/lib/slugParser";
import { FEATURED_SERIES_IDS } from "@/components/watch/SmallDonghuaIframeGrid";
import { DONGHUA_SERIES, DONGHUA_SECTIONS } from "@/data/donghuaData";

describe("Featured 8 Donghua Series Slugs & Routes", () => {
  const expectedSeries = [
    { name: "Beyond Time’s Gaze", id: "beyond-times-gaze" },
    { name: "Tales of Herding Gods", id: "tales-of-herding-gods" },
    { name: "Swallowed Star", id: "swallowed-star" },
    { name: "One Hundred Thousand Years of Qi Refining", id: "one-hundred-thousand-years-of-qi-refining" },
    { name: "Battle Through The Heavens", id: "battle-through-the-heavens" },
    { name: "Eclipse of Illusion", id: "eclipse-of-illusion" },
    { name: "Tomb of Fallen Gods", id: "tomb-of-fallen-gods" },
    { name: "Spy X Sect", id: "spy-x-sect" },
  ];

  it("ensures all 8 featured series exist in DONGHUA_SERIES database", () => {
    for (const item of expectedSeries) {
      const match = DONGHUA_SERIES.find((s) => s.id === item.id);
      expect(match, `Series ${item.name} (${item.id}) should exist`).toBeDefined();
    }
  });

  it("ensures FEATURED_SERIES_IDS matches the 8 requested series", () => {
    expect(FEATURED_SERIES_IDS).toEqual(expectedSeries.map((s) => s.id));
  });

  it("resolves dedicated series URLs for all 8 series", () => {
    for (const item of expectedSeries) {
      const parsed = parseWatchSlug(item.id);
      expect(parsed).toEqual({
        donghuaId: item.id,
        episodeNumber: null,
        isEpisode: false,
      });

      const url = buildWatchUrl(item.id);
      expect(url).toBe(`/watch/${item.id}`);
    }
  });

  it("resolves dedicated episode URLs for all 8 series", () => {
    for (const item of expectedSeries) {
      const episodeNum = 1;
      const episodeSlug = `${item.id}-episode-${episodeNum}`;
      const parsed = parseWatchSlug(episodeSlug);
      expect(parsed).toEqual({
        donghuaId: item.id,
        episodeNumber: episodeNum,
        isEpisode: true,
      });

      const builtUrl = buildWatchUrl(item.id, episodeNum);
      expect(builtUrl).toBe(`/watch/${episodeSlug}`);
    }
  });

  it("rejects invalid slugs and non-numeric episode slugs", () => {
    expect(parseWatchSlug("beyond-times-gaze-episode-invalid").donghuaId).toBeNull();
    expect(parseWatchSlug("fake-donghua-series").donghuaId).toBeNull();
    expect(parseWatchSlug("unknown-series-episode-1").donghuaId).toBeNull();
  });
});

describe("Cultivation Universe Movies and Specials", () => {
  const expectedMovies = [
    { id: "renegade-immortal-special", name: "Renegade Immortal: Battle of Gods", parent: "renegade-immortal" },
    { id: "renegade-immortal-immortal-slayer", name: "Renegade Immortal: Battle of Immortal Slayer", parent: "renegade-immortal" },
    { id: "shrouding-the-heavens-the-movie", name: "Shrouding the Heavens: Imperial Path", parent: "shrouding-the-heavens" },
    { id: "one-hundred-thousand-years-of-qi-refining-yang-ascendant", name: "Qi Refining: Yang Ascendant", parent: "one-hundred-thousand-years-of-qi-refining" },
    { id: "swallowed-star-blood-luo-continent", name: "Swallowed Star: Blood Luo Continent", parent: "swallowed-star" },
    { id: "swallowed-star-battle-on-origin-star", name: "Swallowed Star: Battle on Origin Star", parent: "swallowed-star" },
    { id: "perfect-world-the-movie", name: "Perfect World: Nine Tribulations Burning Heaven", parent: "perfect-world" },
    { id: "battle-through-the-heavens-three-year-agreement", name: "BTTH: Three Year Agreement", parent: "battle-through-the-heavens" },
    { id: "battle-through-the-heavens-origin", name: "BTTH: Origin", parent: "battle-through-the-heavens" },
  ];

  it("all movies and specials exist in DONGHUA_SERIES with correct parentSeriesId", () => {
    for (const movie of expectedMovies) {
      const match = DONGHUA_SERIES.find((s) => s.id === movie.id);
      expect(match, `Movie ${movie.name} (${movie.id}) must exist`).toBeDefined();
      expect(match?.parentSeriesId).toBe(movie.parent);
    }
  });

  it("theatrical-movies section contains all universe specials and films", () => {
    const movieSection = DONGHUA_SECTIONS.find((s) => s.id === "theatrical-movies");
    expect(movieSection).toBeDefined();
    for (const movie of expectedMovies) {
      expect(movieSection?.seriesIds).toContain(movie.id);
    }
  });

  it("all movies and specials resolve accurately in slug parser", () => {
    for (const movie of expectedMovies) {
      const parsed = parseWatchSlug(movie.id);
      expect(parsed.donghuaId).toBe(movie.id);
      expect(parsed.episodeNumber).toBeNull();

      // Episode 1 playback
      const epParsed = parseWatchSlug(`${movie.id}-episode-1`);
      expect(epParsed.donghuaId).toBe(movie.id);
      expect(epParsed.episodeNumber).toBe(1);
    }
  });
});
