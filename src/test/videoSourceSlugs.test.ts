import { describe, expect, it } from "vitest";
import { DONGHUA_SERIES } from "@/data/donghuaData";
import { getVideoServerSlugs } from "@/lib/videoSourceSlugs";

describe("movie streaming source slugs", () => {
  it("uses each movie's slugs for the same streaming providers as the series", () => {
    const movie = DONGHUA_SERIES.find((series) => series.id === "renegade-immortal-immortal-slayer");

    expect(movie).toBeDefined();
    if (!movie) return;

    expect(getVideoServerSlugs(movie)).toEqual({
      anime4i: "renegade-immortal-movie",
      luciferdonghua: "renegade-immortal-movie",
      luciferdonghuain: "renegade-immortal-movie",
      myanime: "renegade-immortal-immortal-slayer",
    });
  });
});
