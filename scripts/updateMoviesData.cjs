const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "src", "data", "donghuaData.ts");
let content = fs.readFileSync(dataPath, "utf8");

// 1. Add parentSeriesId to DonghuaSeries interface if not present
if (!content.includes("parentSeriesId?: string;")) {
  content = content.replace(
    "streamingLinks?: DonghuaStreamingLinks;",
    "streamingLinks?: DonghuaStreamingLinks;\n  parentSeriesId?: string;"
  );
}

// 2. Update existing entries with parentSeriesId and expanded titles/aliases
content = content.replace(
  'id: "perfect-world-the-movie",',
  'id: "perfect-world-the-movie",\n    parentSeriesId: "perfect-world",'
);

content = content.replace(
  'id: "swallowed-star-blood-luo-continent",',
  'id: "swallowed-star-blood-luo-continent",\n    parentSeriesId: "swallowed-star",'
);

content = content.replace(
  'id: "battle-through-the-heavens-three-year-agreement",',
  'id: "battle-through-the-heavens-three-year-agreement",\n    parentSeriesId: "battle-through-the-heavens",'
);

content = content.replace(
  'id: "battle-through-the-heavens-origin",',
  'id: "battle-through-the-heavens-origin",\n    parentSeriesId: "battle-through-the-heavens",'
);

// Update shrouding the heavens movie title & aliases
content = content.replace(
  'title: "Shrouding the Heavens: Ancient Star Road (Movie)",',
  'title: "Shrouding the Heavens: Imperial Path (Battle Against Wang Teng)",'
);
if (!content.includes('parentSeriesId: "shrouding-the-heavens",')) {
  content = content.replace(
    'id: "shrouding-the-heavens-the-movie",',
    'id: "shrouding-the-heavens-the-movie",\n    parentSeriesId: "shrouding-the-heavens",'
  );
}

// Update renegade immortal special
content = content.replace(
  'title: "Renegade Immortal: War of the Domains (Special Film)",',
  'title: "Renegade Immortal: Battle of Gods (War of the Domains)",'
);
if (!content.includes('parentSeriesId: "renegade-immortal",')) {
  content = content.replace(
    'id: "renegade-immortal-special",',
    'id: "renegade-immortal-special",\n    parentSeriesId: "renegade-immortal",'
  );
}

// 3. New entries to add if not already present
const newEntries = [];

if (!content.includes('id: "renegade-immortal-immortal-slayer"')) {
  newEntries.push(`  {
    id: "renegade-immortal-immortal-slayer",
    title: "Renegade Immortal: Battle of Immortal Slayer (Movie)",
    searchQuery: "Renegade Immortal Immortal Slayer",
    anilistSearch: "Renegade Immortal Movie",
    jikanSearch: "Xian Ni Movie",
    nextEpisodeSlug: "renegade-immortal-immortal-slayer",
    aliases: ["renegade immortal immortal slayer", "battle of immortal slayer", "immortal slayer", "xian ni immortal slayer", "仙逆斩仙"],
    thumbnail: "/covers/xian-ni-immortal-slayer.jpg",
    serverSlug: "renegade-immortal-immortal-slayer",
    parentSeriesId: "renegade-immortal",
    knownTotalEpisodes: 1,
    episodesSeason: "Feature Film (Theatrical Movie)",
    releaseSchedule: "Completed (Feature Film)",
    statusTag: "Movie",
    streamingLinks: {
      anime4i: "https://anime4i.com/renegade-immortal-movie-episode-1-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/renegade-immortal-movie-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/renegade-immortal-movie-lucifer-donghua/",
    },
  },`);
}

if (!content.includes('id: "swallowed-star-battle-on-origin-star"')) {
  newEntries.push(`  {
    id: "swallowed-star-battle-on-origin-star",
    title: "Swallowed Star: Battle on Origin Star (Movie)",
    searchQuery: "Swallowed Star Battle on Origin Star",
    anilistSearch: "Tunshi Xingkong: Yuanshi Xing",
    jikanSearch: "Tunshi Xingkong Movie",
    nextEpisodeSlug: "swallowed-star-battle-on-origin-star",
    aliases: ["swallowed star battle on origin star", "origin star", "battle on origin star", "tunshi xingkong movie 2", "吞噬星空原始星"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx166219-tREIb5l5huVe.png",
    serverSlug: "swallowed-star-battle-on-origin-star",
    parentSeriesId: "swallowed-star",
    knownTotalEpisodes: 1,
    episodesSeason: "Feature Film (Theatrical Movie)",
    releaseSchedule: "Completed (Feature Film)",
    statusTag: "Movie",
    streamingLinks: {
      anime4i: "https://anime4i.com/swallowed-star-movie-2-episode-1-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/swallowed-star-movie-battle-on-origin-star-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/swallowed-star-battle-on-origin-star-lucifer-donghua/",
    },
  },`);
}

if (!content.includes('id: "one-hundred-thousand-years-of-qi-refining-yang-ascendant"')) {
  newEntries.push(`  {
    id: "one-hundred-thousand-years-of-qi-refining-yang-ascendant",
    title: "One Hundred Thousand Years of Qi Refining: Yang Ascendant (Special)",
    searchQuery: "One Hundred Thousand Years of Qi Refining Yang Ascendant",
    anilistSearch: "Lian Qi Shi Wan Nian Movie",
    jikanSearch: "Lian Qi Shi Wan Nian Special",
    nextEpisodeSlug: "one-hundred-thousand-years-of-qi-refining-yang-ascendant",
    aliases: ["yang ascendant", "lian qi shi wan nian yang ascendant", "one hundred thousand years of qi refining yang ascendant", "炼气十万年纯阳篇"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b165524-XMXXm35IgGAB.jpg",
    serverSlug: "one-hundred-thousand-years-of-qi-refining-yang-ascendant",
    parentSeriesId: "one-hundred-thousand-years-of-qi-refining",
    knownTotalEpisodes: 1,
    episodesSeason: "Special Extended Movie Arc",
    releaseSchedule: "Completed (Special Film)",
    statusTag: "Special",
    streamingLinks: {
      anime4i: "https://anime4i.com/one-hundred-thousand-years-of-qi-refining-special-episode-1-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/one-hundred-thousand-years-of-gas-refining-yang-ascendant-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/one-hundred-thousand-years-of-qi-refining-special-lucifer-donghua/",
    },
  },`);
}

if (newEntries.length > 0) {
  content = content.replace(
    "\n];\n\nexport const DONGHUA_SECTIONS",
    `,\n${newEntries.join("\n")}\n];\n\nexport const DONGHUA_SECTIONS`
  );
}

// 4. Update theatrical-movies in DONGHUA_SECTIONS
const movieSectionRegex = /id:\s*"theatrical-movies"[\s\S]*?seriesIds:\s*\[[\s\S]*?\]/;
const updatedMovieSection = `id: "theatrical-movies",
    title: "Donghua Theatrical Movies & Specials",
    description: "Feature films and special bridge arcs from top cultivation universes.",
    seriesIds: [
      "renegade-immortal-special",
      "renegade-immortal-immortal-slayer",
      "shrouding-the-heavens-the-movie",
      "one-hundred-thousand-years-of-qi-refining-yang-ascendant",
      "swallowed-star-blood-luo-continent",
      "swallowed-star-battle-on-origin-star",
      "perfect-world-the-movie",
      "battle-through-the-heavens-three-year-agreement",
      "battle-through-the-heavens-origin",
    ]`;

content = content.replace(movieSectionRegex, updatedMovieSection);

fs.writeFileSync(dataPath, content, "utf8");
console.log("Successfully updated donghuaData.ts with all movies & specials!");

