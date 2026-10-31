import { describe, it, expect } from "vitest";
import { parseWatchSlug, buildWatchUrl } from "@/lib/slugParser";
import { FEATURED_SERIES_IDS } from "@/components/watch/SmallDonghuaIframeGrid";
import { DONGHUA_SERIES } from "@/data/donghuaData";

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

