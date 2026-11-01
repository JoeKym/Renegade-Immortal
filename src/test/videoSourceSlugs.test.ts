import { describe, expect, it } from "vitest";
import { DONGHUA_SERIES } from "@/data/donghuaData";
import { extractSlugFromStreamingUrl, getVideoServerSlugs } from "@/lib/videoSourceSlugs";

describe("movie streaming source slugs", () => {
  it("derives provider-specific movie slugs from the supplied source references", () => {
    const movie = DONGHUA_SERIES.find((series) => series.id === "renegade-immortal-immortal-slayer");

    expect(movie).toBeDefined();
    if (!movie) return;

    expect(getVideoServerSlugs(movie)).toEqual({
      anime4i: "renegade-immortal-movie-2-slaying-the-blood-progenitor",
      luciferdonghua: "renegade-immortal-battle-of-the-immortal-slayer-movie-2026",
      luciferdonghuain: "renegade-immortal-slaying-the-blood-progenitor-movie",
      myanime: "renegade-immortal-immortal-slayer",
    });
  });

  it("extracts a clean movie slug from episode and part reference URLs", () => {
    expect(extractSlugFromStreamingUrl(
      "https://luciferdonghua.in/battle-through-the-heavens-three-year-agreement-ep-01/",
    )).toBe("battle-through-the-heavens-three-year-agreement");
    expect(extractSlugFromStreamingUrl(
      "https://luciferdonghua.org/perfect-world-wanmei-shijie-movie-special-part-1/",
    )).toBe("perfect-world-wanmei-shijie-movie-special");
    expect(extractSlugFromStreamingUrl(
      "https://luciferdonghua.org/swallowed-star-movie-battle-on-the-original-star-arc-part-1-2026/",
    )).toBe("swallowed-star-movie-battle-on-the-original-star-arc-2026");
  });

  it("keeps unavailable movie servers unconfigured instead of reusing series sources", () => {
    const originStar = DONGHUA_SERIES.find((series) => series.id === "swallowed-star-battle-on-origin-star");
    const qiRefiningSpecial = DONGHUA_SERIES.find(
      (series) => series.id === "one-hundred-thousand-years-of-qi-refining-yang-ascendant",
    );

    expect(originStar?.streamingLinks?.anime4i).toBeUndefined();
    expect(qiRefiningSpecial?.streamingLinks?.anime4i).toBeUndefined();
    expect(qiRefiningSpecial?.streamingLinks?.luciferDonghuaIn).toBeUndefined();
  });

  it("uses each movie's source-specific slug instead of its parent series slug", () => {
    const slugExpectations: Array<[string, ReturnType<typeof getVideoServerSlugs>]> = [
      ["perfect-world-the-movie", {
        anime4i: "perfect-world-movie-ninefold-the-burning-sky",
        luciferdonghua: "perfect-world-wanmei-shijie-movie-special",
        luciferdonghuain: "perfect-world-nine-tribulations-burning-the-heavens-movie",
        myanime: "perfect-world-the-movie",
      }],
      ["swallowed-star-blood-luo-continent", {
        anime4i: "swallowed-star-blood-luo-continent",
        luciferdonghua: "swallowed-star-full-movie",
        luciferdonghuain: "swallowed-star-movie-blood-luo-continent-2024",
        myanime: "swallowed-star-blood-luo-continent",
      }],
      ["swallowed-star-battle-on-origin-star", {
        anime4i: "swallowed-star-battle-on-origin-star",
        luciferdonghua: "swallowed-star-movie-battle-on-the-original-star-arc-2026",
        luciferdonghuain: "swallowed-star-movie-the-decisive-battle-on-the-primordial-star",
        myanime: "swallowed-star-battle-on-origin-star",
      }],
      ["battle-through-the-heavens-three-year-agreement", {
        anime4i: "battle-through-the-heavens-three-year-agreement",
        luciferdonghua: "battle-through-the-heavens-three-year-agreement",
        luciferdonghuain: "battle-through-the-heavens-three-year-agreement",
        myanime: "battle-through-the-heavens-three-year-agreement",
      }],
      ["battle-through-the-heavens-origin", {
        anime4i: "battle-through-the-heavens-origin",
        luciferdonghua: "battle-through-the-heavens-origin",
        luciferdonghuain: "battle-through-the-heavens-the-origin",
        myanime: "battle-through-the-heavens-origin",
      }],
      ["shrouding-the-heavens-the-movie", {
        anime4i: "shrouding-the-heavens-the-movie",
        luciferdonghua: "shrouding-the-heavens-movie",
        luciferdonghuain: "shrouding-the-heaven-movie-battle-against-wang-teng",
        myanime: "shrouding-the-heavens-the-movie",
      }],
      ["renegade-immortal-special", {
        anime4i: "renegade-immortal-battle-of-gods-movie",
        luciferdonghua: "renegade-immortal-movie-battle-of-the-gods",
        luciferdonghuain: "renegade-immortal-battle-of-gods-movie",
        myanime: "renegade-immortal-special",
      }],
    ];

    for (const [id, expectedSlugs] of slugExpectations) {
      const movie = DONGHUA_SERIES.find((series) => series.id === id);
      expect(movie, `missing catalog entry ${id}`).toBeDefined();
      if (movie) expect(getVideoServerSlugs(movie)).toEqual(expectedSlugs);
    }
  });

  it("tracks different part counts per provider", () => {
    const perfectWorldMovie = DONGHUA_SERIES.find((series) => series.id === "perfect-world-the-movie");
    const battleOfGods = DONGHUA_SERIES.find((series) => series.id === "renegade-immortal-special");
    const immortalSlayer = DONGHUA_SERIES.find((series) => series.id === "renegade-immortal-immortal-slayer");

    expect(perfectWorldMovie?.streamingEpisodeCounts).toEqual({
      anime4i: 3,
      luciferDonghuaOrg: 3,
      luciferDonghuaIn: 2,
    });
    expect(battleOfGods?.streamingEpisodeCounts).toEqual({
      anime4i: 2,
      luciferDonghuaOrg: 3,
      luciferDonghuaIn: 2,
    });
    expect(immortalSlayer?.streamingEpisodeCounts).toEqual({
      anime4i: 3,
      luciferDonghuaOrg: 2,
      luciferDonghuaIn: 2,
    });
  });
});
