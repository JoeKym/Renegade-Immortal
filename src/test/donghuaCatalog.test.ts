import { describe, expect, it, vi } from "vitest";
import { mergeDonghuaCatalog } from "@/lib/donghuaCatalog";
import type { DonghuaSeries } from "@/data/donghuaData";

function catalogPayload(id: string, title: string): DonghuaSeries {
  return {
    id,
    title,
    searchQuery: title,
    anilistSearch: title,
    jikanSearch: title,
    nextEpisodeSlug: id,
    thumbnail: `https://example.com/${id}.jpg`,
  };
}

describe("mergeDonghuaCatalog", () => {
  it("overrides bundled entries and appends new catalog entries", () => {
    const base = [
      { ...catalogPayload("existing-series", "Old title"), knownTotalEpisodes: 2 },
    ];
    const rows = [
      { id: "existing-series", payload: { ...catalogPayload("existing-series", "Updated title"), knownTotalEpisodes: 12 } },
      { id: "new-series", payload: catalogPayload("new-series", "New title") },
    ];

    expect(mergeDonghuaCatalog(base, rows)).toEqual([
      { ...catalogPayload("existing-series", "Updated title"), knownTotalEpisodes: 12 },
      catalogPayload("new-series", "New title"),
    ]);
  });

  it("ignores payloads that do not match the row id or required shape", () => {
    const invalidPayload = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const result = mergeDonghuaCatalog([], [
      { id: "mismatched-id", payload: catalogPayload("different-id", "Bad title") },
      { id: "missing-fields", payload: { id: "missing-fields", title: "Bad title" } },
    ]);

    expect(result).toEqual([]);
    expect(invalidPayload).toHaveBeenCalledTimes(2);
    invalidPayload.mockRestore();
  });
});
