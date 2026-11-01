import { describe, expect, it, vi } from "vitest";
import {
  getDistinctLoreArcs,
  getLoreFirstAppearanceBook,
  getLoreStoryArcs,
  isArtifactPayload,
  isCharacterPayload,
  loreContentId,
  mergeLoreContent,
  normalizeArtifactPayload,
  normalizeCharacterPayload,
} from "@/lib/loreContent";
import { getNovelBookForChapter, NOVEL_BOOK_OPTIONS } from "@/lib/novelBooks";
import { characters, type Character } from "@/data/charactersData";
import type { ArtifactItem } from "@/pages/Artifacts";

const bundledCharacter: Character = {
  name: "Wang Lin",
  race: "Human",
  alignment: "Protagonist",
  subtitle: "Defier of Heavens",
  description: "A cultivator.",
  tags: ["Main character"],
};

const bundledArtifact: ArtifactItem = {
  name: "Heaven-Defying Bead",
  type: "artifact",
  origin: "Unknown",
  owner: "Wang Lin",
  power: "Enters Dream Space.",
  firstAppearance: "Chapter 1",
  storyArc: "The Beginning",
};

describe("loreContent", () => {
  it("creates stable URL-safe ids from content names", () => {
    expect(loreContentId("Heaven-Defying Bead")).toBe("heaven-defying-bead");
    expect(loreContentId("  Wang Lin! ")).toBe("wang-lin");
  });

  it("limits lore grouping to the 13 numbered novel books", () => {
    expect(NOVEL_BOOK_OPTIONS).toHaveLength(13);
    NOVEL_BOOK_OPTIONS.slice(1).forEach((book, index) => {
      expect(book.startChapter).toBe(NOVEL_BOOK_OPTIONS[index].endChapter + 1);
    });
    expect(NOVEL_BOOK_OPTIONS[0]).toMatchObject({
      title: "The Mediocre Youth",
      startChapter: 1,
      endChapter: 64,
    });
    expect(NOVEL_BOOK_OPTIONS[12]).toMatchObject({
      title: "Light of the coming end",
      startChapter: 2003,
      endChapter: 2088,
    });
    expect(getNovelBookForChapter(64)).toBe(1);
    expect(getNovelBookForChapter(65)).toBe(2);
    expect(getNovelBookForChapter(2088)).toBe(13);
    expect(getNovelBookForChapter(2089)).toBeUndefined();
    expect(characters.filter((character) => character.firstAppearanceBook === 1).map((character) => character.name).sort())
      .toEqual([
        "Liu Mei",
        "Situ Nan",
        "Sun Dazhu",
        "Wang Lin",
        "Wang Tian Shui & Zhou Tingsu",
        "Wang Zhou",
      ]);
    expect(characters.find((character) => character.name === "Wang Zhou"))
      .toMatchObject({ firstAppearance: "Chapter 2", firstAppearanceBook: 1 });
    expect(characters.find((character) => character.name === "Zhou Ru"))
      .toMatchObject({ firstAppearance: "Chapter 356", firstAppearanceBook: 4 });
    expect(characters.find((character) => character.name === "Qing Shui"))
      .toMatchObject({ firstAppearance: "Chapter 787", firstAppearanceBook: 7 });
    expect(characters.find((character) => character.name === "Azure Dragon Divine Emperor"))
      .toMatchObject({ firstAppearance: "Chapter 1114", firstAppearanceBook: 8 });
    expect(getLoreStoryArcs({ firstAppearanceBook: 5 })).toEqual(["Volume 5"]);
    expect(getLoreStoryArcs({ storyArcs: ["Volume 2", "Volume 3"] })).toEqual(["Volume 2"]);
    expect(getLoreStoryArcs({ storyArcs: ["Book 2", "Book 3"] })).toEqual([]);
    expect(getLoreStoryArcs({ storyArc: "Volume 3" })).toEqual(["Volume 3"]);
    expect(getLoreStoryArcs({ firstAppearance: "Book 4" })).toEqual([]);
    expect(getLoreStoryArcs({ firstAppearance: "Chapter 1" })).toEqual(["Volume 1"]);
    expect(getLoreStoryArcs({ firstAppearance: "Chapter 130" })).toEqual(["Volume 2"]);
    expect(getLoreStoryArcs({ firstAppearance: "Chapter 787 (actual appearance)" })).toEqual(["Volume 7"]);
    expect(getLoreStoryArcs({ storyArcs: ["The Beginning", "Sea of Devils"] })).toEqual([]);
    expect(getLoreStoryArcs({ firstAppearanceBook: null, storyArcs: ["Book 2"] })).toEqual([]);
    expect(getLoreStoryArcs({})).toEqual([]);
    expect(getLoreFirstAppearanceBook({ firstAppearanceBook: 13 })).toBe(13);
    expect(getLoreFirstAppearanceBook({ firstAppearanceBook: 14 })).toBeUndefined();
    expect(getDistinctLoreArcs(["Arc B", "Arc A", "arc a"])).toEqual(["Arc A", "Arc B"]);
  });

  it("accepts role as an alias and allows partial character edits", () => {
    const updated = normalizeCharacterPayload({
      name: "Thunder Immortal Emperor Bai Fan",
      race: "Human / Celestial",
      role: "Master",
      subtitle: "Celestial Master of Restrictions",
      description: "A legendary Immortal Emperor.",
      tags: ["Formations", "Restrictions"],
      firstAppearanceBook: 11,
      status: "Deceased",
      cultivationRealm: "Third Step",
      image: "/assets/bai-fan.jpg",
    });

    expect(updated).toMatchObject({
      name: "Thunder Immortal Emperor Bai Fan",
      alignment: "Master",
      race: "Human / Celestial",
      tags: ["Formations", "Restrictions"],
      firstAppearanceBook: 11,
      status: "Deceased",
    });
    expect(updated).not.toHaveProperty("role");
    expect(normalizeCharacterPayload({ name: "New Character", status: "Active" }))
      .toMatchObject({ name: "New Character", status: "Active", alignment: "Ally" });
    expect(normalizeCharacterPayload({ status: "Active" }, bundledCharacter))
      .toMatchObject({ ...bundledCharacter, status: "Active" });
    expect(normalizeCharacterPayload({ name: "Bad", role: "Unknown" })).toBeNull();
  });

  it("allows partial artifact and technique edits while retaining other fields", () => {
    expect(normalizeArtifactPayload(
      { power: "Updated power" },
      "artifact",
      bundledArtifact,
    )).toMatchObject({ ...bundledArtifact, power: "Updated power" });
    expect(normalizeArtifactPayload({ name: "New technique" }, "technique"))
      .toMatchObject({ name: "New technique", type: "technique" });
  });

  it("overrides bundled content and appends published CMS entries", () => {
    const updatedCharacter = { ...bundledCharacter, description: "Updated" };
    const addedCharacter = { ...bundledCharacter, name: "Situ Nan" };
    const result = mergeLoreContent(
      "character",
      [bundledCharacter],
      [
        { id: "wang-lin", content_type: "character", payload: updatedCharacter },
        { id: "situ-nan", content_type: "character", payload: addedCharacter },
      ],
      isCharacterPayload,
    );

    expect(result).toEqual([updatedCharacter, addedCharacter]);
  });

  it("keeps unrelated domains separate and ignores invalid records", () => {
    const invalidPayload = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const result = mergeLoreContent(
      "artifact",
      [bundledArtifact],
      [
        { id: "new-technique", content_type: "technique", payload: { ...bundledArtifact, type: "technique" } },
        { id: "invalid", content_type: "artifact", payload: { name: "Incomplete" } },
      ],
      isArtifactPayload,
    );

    expect(result).toEqual([bundledArtifact]);
    expect(invalidPayload).toHaveBeenCalledOnce();
    invalidPayload.mockRestore();
  });
});
