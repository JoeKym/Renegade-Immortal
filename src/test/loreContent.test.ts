import { describe, expect, it, vi } from "vitest";
import {
  getDistinctLoreArcs,
  getLoreStoryArcs,
  isArtifactPayload,
  isCharacterPayload,
  loreContentId,
  mergeLoreContent,
  normalizeArtifactPayload,
  normalizeCharacterPayload,
} from "@/lib/loreContent";
import type { Character } from "@/data/charactersData";
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

  it("uses explicit arc associations and preserves legacy artifact arc labels", () => {
    expect(getLoreStoryArcs({ storyArcs: ["Zhao Country", " Sea of Devils ", "zhao country"] }))
      .toEqual(["Sea of Devils", "Zhao Country"]);
    expect(getLoreStoryArcs({ storyArc: "The Beginning" })).toEqual(["The Beginning"]);
    expect(getLoreStoryArcs({ storyArcs: [] })).toEqual([]);
    expect(getLoreStoryArcs({ storyArc: "Legacy arc", storyArcs: [] })).toEqual([]);
    expect(getLoreStoryArcs({})).toEqual([]);
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
      status: "Deceased",
      cultivationRealm: "Third Step",
      image: "/assets/bai-fan.jpg",
    });

    expect(updated).toMatchObject({
      name: "Thunder Immortal Emperor Bai Fan",
      alignment: "Master",
      race: "Human / Celestial",
      tags: ["Formations", "Restrictions"],
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
