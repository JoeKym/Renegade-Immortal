import { describe, expect, it } from "vitest";
import { DONGHUA_SERIES } from "@/data/donghuaData";
import { getAutoReleasedEpisodes, getNextReleaseInfo } from "@/lib/releaseSchedule";

const renegadeImmortal = DONGHUA_SERIES.find((series) => series.id === "renegade-immortal");
const perfectWorld = DONGHUA_SERIES.find((series) => series.id === "perfect-world");

describe("donghua release schedule", () => {
  it("automatically advances Renegade Immortal on its weekly Sunday schedule", () => {
    expect(renegadeImmortal).toBeDefined();
    if (!renegadeImmortal) return;

    const now = new Date("2026-11-02T13:00:00+03:00");
    const nextRelease = getNextReleaseInfo(renegadeImmortal, now);

    expect(getAutoReleasedEpisodes(renegadeImmortal, now)).toBe(165);
    expect(nextRelease.nextEpisodeNumber).toBe(166);
    expect(nextRelease.nextAiringDate.toISOString()).toBe("2026-11-08T10:00:00.000Z");

    const afterNextRelease = new Date("2026-11-08T13:00:00+03:00");
    const followingRelease = getNextReleaseInfo(renegadeImmortal, afterNextRelease);
    expect(getAutoReleasedEpisodes(renegadeImmortal, afterNextRelease)).toBe(166);
    expect(followingRelease.nextEpisodeNumber).toBe(167);
    expect(followingRelease.nextAiringDate.toISOString()).toBe("2026-11-15T10:00:00.000Z");
  });

  it("caps Perfect World at episode 288 during its production hiatus", () => {
    expect(perfectWorld).toBeDefined();
    if (!perfectWorld) return;

    expect(getAutoReleasedEpisodes(perfectWorld, new Date("2026-11-01T10:27:00+03:00"))).toBe(288);
  });
});
