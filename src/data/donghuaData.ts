export interface DonghuaStreamingLinks {
  anime4i?: string;
  luciferDonghuaOrg?: string;
  luciferDonghuaIn?: string;
}

export interface DonghuaSeries {
  id: string;
  title: string;
  searchQuery: string;
  anilistSearch: string;
  jikanSearch: string;
  nextEpisodeSlug: string;
  aliases?: string[];
  thumbnail: string;
  serverSlug?: string;
  knownTotalEpisodes?: number;
  episodesSeason?: string;
  releaseSchedule?: string;
  releaseDay?: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | "Multiple";
  releaseTime?: string;
  statusTag?: "Ongoing" | "Completed" | "Ongoing (Nian Fan)" | "Completed Special Series" | "Completed / Ongoing Season 2";
  streamingLinks?: DonghuaStreamingLinks;
}

export interface DonghuaSection {
  id: string;
  title: string;
  description: string;
  seriesIds: string[];
}

export const DONGHUA_SERIES: DonghuaSeries[] = [
  {
    id: "renegade-immortal",
    title: "Renegade Immortal",
    searchQuery: "Renegade Immortal",
    anilistSearch: "Renegade Immortal",
    jikanSearch: "Xian Ni",
    nextEpisodeSlug: "renegade-immortal",
    aliases: ["xian ni", "renegade immortal", "immortal renegade", "仙逆"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx137653-1wHbCVvABGOr.png",
    serverSlug: "renegade-immortal",
    knownTotalEpisodes: 153,
    episodesSeason: "Episodes 1–153+ | Ongoing",
    releaseSchedule: "Sundays at 3:00 PM (EAT)",
    releaseDay: "Sunday",
    releaseTime: "3:00 PM (EAT)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/renegade-immortal-xian-ni-episode-153-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/renegade-immortal-xian-ni-episode-153-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/renegade-immortal-xian-ni-episode-153-lucifer-donghua/",
    },
  },
  {
    id: "beyond-times-gaze",
    title: "Beyond Time’s Gaze",
    searchQuery: "Beyond Time's Gaze",
    anilistSearch: "Beyond Time's Gaze",
    jikanSearch: "Guangyin Zhi Wai",
    nextEpisodeSlug: "beyond-times-gaze",
    aliases: ["guang yin zhi wai", "beyond time's gaze", "beyond times gaze", "Guangyin Zhi Wai"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx213356-nYFTX2yeMBd5.jpg",
    serverSlug: "beyond-times-gaze",
    knownTotalEpisodes: 31,
    episodesSeason: "Season 1: 1–31 episodes | Ongoing",
    releaseSchedule: "Saturdays at 3:00 PM (EAT)",
    releaseDay: "Saturday",
    releaseTime: "3:00 PM (EAT)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/beyond-times-gaze-episode-34-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/beyond-times-gaze-episode-34-english-subtitle/",
      luciferDonghuaIn: "https://luciferdonghua.in/beyond-the-timescape-episode-34-lucifer-donghua/",
    },
  },
  {
    id: "tales-of-herding-gods",
    title: "Tales of Herding Gods",
    searchQuery: "Tales of Herding Gods",
    anilistSearch: "Tales of Herding Gods",
    jikanSearch: "Mu Shen Ji",
    nextEpisodeSlug: "tales-of-herding-gods",
    aliases: ["mu shen ji", "tales of herding gods", "牧神记"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx211181-93dehu3v5xHE.png",
    serverSlug: "tales-of-herding-gods",
    knownTotalEpisodes: 95,
    episodesSeason: "Episodes 1–95 | Ongoing",
    releaseSchedule: "Thursdays at 3:00 PM (EAT)",
    releaseDay: "Thursday",
    releaseTime: "3:00 PM (EAT)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/tales-of-herding-gods-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/tales-of-herding-gods-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/tales-of-herding-gods-lucifer-donghua/",
    },
  },
  {
    id: "swallowed-star",
    title: "Swallowed Star",
    searchQuery: "Swallowed Star",
    anilistSearch: "Swallowed Star",
    jikanSearch: "Tunshi Xingkong",
    nextEpisodeSlug: "swallowed-star",
    aliases: ["tunshi xingkong", "swallowed star", "吞噬星空"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx166219-tREIb5l5huVe.png",
    serverSlug: "swallowed-star",
    knownTotalEpisodes: 236,
    episodesSeason: "S1–S4 (Episodes 1–236+) | Ongoing",
    releaseSchedule: "Tuesdays at 3:00 PM (EAT)",
    releaseDay: "Tuesday",
    releaseTime: "3:00 PM (EAT)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/swallowed-star-episode-236-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/swallowed-star-season-4-episode-236-english-subtitles/",
      luciferDonghuaIn: "https://luciferdonghua.in/swallowed-star-season-4-episode-151-236-lucifer-donghua/",
    },
  },
  {
    id: "eclipse-of-illusion",
    title: "Eclipse of Illusion S1",
    searchQuery: "Eclipse of Illusion",
    anilistSearch: "Eclipse of Illusion",
    jikanSearch: "Yun Shen Buzhi Meng",
    nextEpisodeSlug: "eclipse-of-illusion",
    aliases: ["huan jing zhi yue", "eclipse of illusion", "幻境之月", "Yun Shen Buzhi Meng"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx198697-UHaozIRuLiEA.png",
    serverSlug: "eclipse-of-illusion",
    knownTotalEpisodes: 26,
    episodesSeason: "1–26 episodes | Completed",
    releaseSchedule: "Completed (Season 1 Finished)",
    statusTag: "Completed",
    streamingLinks: {
      anime4i: "https://anime4i.com/eclipse-of-illusion-episode-26-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/eclipse-of-illusion-episode-26-english-subtitles/",
      luciferDonghuaIn: "https://luciferdonghua.in/eclipse-of-illusion-2025-episode-26-lucifer-donghua/",
    },
  },
  {
    id: "the-miasma-war",
    title: "Eclipse of Illusion Special War: The Miasma War",
    searchQuery: "The Miasma War",
    anilistSearch: "Eclipse of Illusion: The Miasma War",
    jikanSearch: "Eclipse of Illusion: The Miasma War",
    nextEpisodeSlug: "the-miasma-war",
    aliases: ["the miasma war", "eclipse of illusion special war", "huan jing zhi yue miasma war"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx198697-UHaozIRuLiEA.png",
    serverSlug: "the-miasma-war",
    knownTotalEpisodes: 6,
    episodesSeason: "1–6 episodes | Completed",
    releaseSchedule: "Completed (Special 6-episode bridge arc ended July 2026)",
    statusTag: "Completed Special Series",
    streamingLinks: {
      anime4i: "https://anime4i.com/eclipse-of-illusion-episode-6-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/eclipse-of-illusion-special-the-miasma-war-episode-6-english-subtitle/",
      luciferDonghuaIn: "https://luciferdonghua.in/eclipse-of-illusion-special-the-miasma-war-episode-06-lucifer-donghua/",
    },
  },
  {
    id: "battle-through-the-heavens",
    title: "Battle Through The Heavens",
    searchQuery: "Battle Through the Heavens",
    anilistSearch: "Battle Through the Heavens",
    jikanSearch: "Dou Po Cangqiong",
    nextEpisodeSlug: "battle-through-the-heavens",
    aliases: ["doupo cangqiong", "battle through the heavens", "斗破苍穹", "Dou Po Cangqiong: Nian Fan"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx196613-20kz65bVsHl7.jpg",
    serverSlug: "battle-through-the-heavens",
    knownTotalEpisodes: 208,
    episodesSeason: "S1–S5 (Episodes 1–208+) | Ongoing",
    releaseSchedule: "Saturdays at 3:00 PM (EAT)",
    releaseDay: "Saturday",
    releaseTime: "3:00 PM (EAT)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/battle-through-the-heavens-season-5-episode-208-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/fights-break-sphere-season-5-episod-208-english-subtitle/",
      luciferDonghuaIn: "https://luciferdonghua.in/battle-through-the-heavens-season-5-episode-new-207/",
    },
  },
  {
    id: "one-hundred-thousand-years-of-qi-refining",
    title: "One Hundred Thousand Years of Qi Refining",
    searchQuery: "One Hundred Thousand Years of Qi Refining",
    anilistSearch: "One Hundred Thousand Years of Qi Refining",
    jikanSearch: "Lian Qi Shiwan Nian",
    nextEpisodeSlug: "one-hundred-thousand-years-of-qi-refining",
    aliases: ["lian qi shi wan nian", "100,000 Years of Qi Refining", "炼气十万年"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b165524-XMXXm35IgGAB.jpg",
    serverSlug: "one-hundred-thousand-years-of-qi-refining",
    knownTotalEpisodes: 367,
    episodesSeason: "1–367+ episodes | Ongoing",
    releaseSchedule: "Multiple drops (Tuesdays & Saturdays) at 3:00 PM (EAT)",
    releaseDay: "Multiple",
    releaseTime: "3:00 PM (EAT)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/one-hundred-thousand-years-of-qi-refining-episode-367-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/one-hundred-thousand-years-of-gas-refining-episode-366-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/one-hundred-thousand-years-of-qi-refining-episode-367-lucifer-donghua/",
    },
  },
  {
    id: "perfect-world",
    title: "Perfect World",
    searchQuery: "Perfect World",
    anilistSearch: "Perfect World",
    jikanSearch: "Wanmei Shijie",
    nextEpisodeSlug: "perfect-world",
    aliases: ["wanmei shijie", "perfect world", "完美世界"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx120218-J6LXCFOHO9cT.jpg",
    serverSlug: "perfect-world",
    knownTotalEpisodes: 282,
    episodesSeason: "1–282+ episodes | Ongoing",
    releaseSchedule: "Thursdays at 3:00 PM (EAT)",
    releaseDay: "Thursday",
    releaseTime: "3:00 PM (EAT)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/perfect-world-episode-282-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/perfect-world-wanmei-shijie-episode-282-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/perfect-world-wanmei-shijie-episode-282-lucifer-donghua/",
    },
  },
  {
    id: "shrouding-the-heavens",
    title: "Shrouding the Heavens",
    searchQuery: "Shrouding the Heavens",
    anilistSearch: "Shrouding the Heavens",
    jikanSearch: "Zhe Tian",
    nextEpisodeSlug: "shrouding-the-heavens",
    aliases: ["zhe tian", "shrouding the heavens", "遮天"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx137671-PzYKwpStSLIF.png",
    serverSlug: "shrouding-the-heavens",
    knownTotalEpisodes: 175,
    episodesSeason: "1–175+ episodes | Ongoing",
    releaseSchedule: "Tuesdays at 3:00 PM (EAT)",
    releaseDay: "Tuesday",
    releaseTime: "3:00 PM (EAT)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/shrouding-the-heavens-episode-175-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/shrouding-the-heavens-episode-175-english-subtitles/",
      luciferDonghuaIn: "https://luciferdonghua.in/shrouding-the-heavens-episode-175-lucifer-donghua/",
    },
  },
  {
    id: "tomb-of-fallen-gods",
    title: "Tomb of Fallen Gods",
    searchQuery: "Tomb of Fallen Gods",
    anilistSearch: "Tomb of Fallen Gods",
    jikanSearch: "Shen Mu",
    nextEpisodeSlug: "tomb-of-fallen-gods",
    aliases: ["shen mu", "tomb of fallen gods", "神墓"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx198701-lyhCxTRIvuXA.jpg",
    serverSlug: "tomb-of-fallen-gods",
    knownTotalEpisodes: 52,
    episodesSeason: "Season 1: 1–16 episodes | Season 2: 1–27 episodes | Season 3: 1–52 episodes",
    releaseSchedule: "Completed (Season 3 ended July 2026)",
    statusTag: "Completed",
    streamingLinks: {
      anime4i: "https://anime4i.com/tomb-of-fallen-gods-season-3-episode-52-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/tomb-of-fallen-gods-season-3-episode-52-eng-subtitle/",
      luciferDonghuaIn: "https://luciferdonghua.in/tomb-of-fallen-gods-season-3-episode-52-lucifer-donghua/",
    },
  },
  {
    id: "spy-x-sect",
    title: "Spy X Sect (All female spies are in my sect)",
    searchQuery: "Spy X Sect",
    anilistSearch: "Spy X Sect",
    jikanSearch: "Spy X Sect",
    nextEpisodeSlug: "spy-x-sect",
    aliases: ["wo de jia shi dou shi wo de yan xian", "spy x sect", "All Female Spies In My Sect", "My Disciples Are All Female Spies"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101966-05APsz77zSsu.png",
    serverSlug: "spy-x-sect",
    knownTotalEpisodes: 152,
    episodesSeason: "S1: 1–152 episodes | Completed",
    releaseSchedule: "Completed (Season 1 ended May 2026)",
    statusTag: "Completed",
    streamingLinks: {
      anime4i: "https://anime4i.com/my-sectarian-members-are-spies-episode-152-english-subtitles",
      luciferDonghuaOrg: "https://luciferdonghua.org/the-sect-members-are-spies-episode-152-english-subtitle/",
      luciferDonghuaIn: "https://luciferdonghua.in/all-female-spies-are-in-my-sect-episode-151-lucifer-donghua/",
    },
  },
];

export const DONGHUA_SECTIONS: DonghuaSection[] = [
  {
    id: "watch-more-donghua",
    title: "More Donghua Series",
    description: "Series highlighted in the watch page recommendations panel.",
    seriesIds: DONGHUA_SERIES.map((series) => series.id),
  },
];