import { describe, expect, it } from "vitest";
import { characters } from "@/data/charactersData";
import { DONGHUA_SERIES } from "@/data/donghuaData";
import type { Json } from "@/integrations/supabase/types";
import type { LoreContentRecord } from "@/lib/loreContent";
import { buildSearchIndex, createSiteSearch } from "@/lib/searchIndex";
import { ARTIFACT_ITEMS } from "@/pages/Artifacts";

const renegadeImmortal = DONGHUA_SERIES.find((series) => series.id === "renegade-immortal");

describe("site search index", () => {
  it("includes published CMS characters and techniques without curated search entries", () => {
    const records: LoreContentRecord[] = [
      {
        id: "search-test-cultivator",
        content_type: "character",
        payload: {
          name: "Search Test Cultivator",
          race: "Human",
          alignment: "Ally",
          subtitle: "A recently published cultivator",
          description: "Known for a rare silver flame.",
          tags: ["silver flame"],
        } as Json,
      },
      {
        id: "search-test-art",
        content_type: "technique",
        payload: {
          name: "Silver Flame Art",
          type: "technique",
          origin: "New inheritance",
          owner: "Search Test Cultivator",
          power: "Channels a silver flame through the meridians.",
          firstAppearance: "Chapter 2000",
          storyArc: "Final arc",
        } as Json,
      },
    ];

    const index = buildSearchIndex({
      baseResults: [],
      characters,
      loreRecords: records,
      artifactItems: ARTIFACT_ITEMS,
      series: [],
      communities: [{
        id: "community-id",
        name: "Silver Flame Theory",
        description: "Discuss the silver flame inheritance.",
        category: "Theories",
      }],
      profiles: [{
        username: "silver-cultivator",
        display_name: "Silver Cultivator",
        bio: "A student of flame arts.",
      }],
    });
    const fuse = createSiteSearch(index);

    expect(fuse.search("Search Test Cultivator")[0]?.item).toMatchObject({
      category: "Character",
      path: "/characters?q=Search%20Test%20Cultivator",
    });
    expect(fuse.search("Silver Flame Art")[0]?.item).toMatchObject({
      category: "Technique",
      path: "/artifacts?q=Silver%20Flame%20Art",
    });
    expect(fuse.search("Silver Flame Theory")[0]?.item).toMatchObject({
      category: "Community",
      path: "/communities/community-id",
    });
    expect(fuse.search("silver-cultivator")[0]?.item).toMatchObject({
      category: "Account",
      path: "/cultivator/silver-cultivator",
    });
  });

  it("generates episode search results from the current release schedule", () => {
    expect(renegadeImmortal).toBeDefined();
    if (!renegadeImmortal) return;

    const index = buildSearchIndex({
      baseResults: [],
      characters: [],
      loreRecords: [],
      artifactItems: [],
      series: [renegadeImmortal],
      now: new Date("2026-11-02T13:00:00+03:00"),
    });
    const episode = index.find((result) => result.id === "episode:renegade-immortal:166");

    expect(episode).toMatchObject({
      category: "Episode",
      title: "Renegade Immortal Episode 166",
      path: "/watch/renegade-immortal-episode-166",
    });
    expect(createSiteSearch(index).search("episode 166")[0]?.item.id)
      .toBe("episode:renegade-immortal:166");
  });
});