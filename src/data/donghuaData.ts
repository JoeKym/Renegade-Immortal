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
    jikanSearch: "xian ni",
    nextEpisodeSlug: "renegade-immortal",
    aliases: ["xian ni", "renegade immortal", "immortal renegade", "仙逆"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx137653-1wHbCVvABGOr.png",
    serverSlug: "renegade-immortal-xian-ni",
    knownTotalEpisodes: 128,
    episodesSeason: "1–153+ episodes | Ongoing (Nian Fan)",
    releaseSchedule: "Mondays at 10:00 AM (GMT+8)",
    releaseDay: "Monday",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Ongoing (Nian Fan)",
    streamingLinks: {
      anime4i: "https://anime4i.com/renegade-immortal-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/renegade-immortal-xian-ni-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/renegade-immortal-xian-ni-lucifer-donghua/",
    },
  },
  {
    id: "beyond-times-gaze",
    title: "Beyond Time’s Gaze",
    searchQuery: "Beyond Time's Gaze",
    anilistSearch: "Beyond Time's Gaze",
    jikanSearch: "Guangyin Zhi Wai",
    nextEpisodeSlug: "beyond-times-gaze",
    aliases: ["guang yin zhi wai", "beyond time's gaze", "beyond times gaze", "Guangyin Zhi Wai 2"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx213356-nYFTX2yeMBd5.jpg",
    serverSlug: "beyond-times-gaze",
    knownTotalEpisodes: 31,
    episodesSeason: "Season 1: 1–31 episodes | Season 2: Ongoing",
    releaseSchedule: "Saturdays at 10:00 AM (GMT+8)",
    releaseDay: "Saturday",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/beyond-times-gaze-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/beyond-times-gaze-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/beyond-times-gaze-lucifer-donghua/",
    },
  },
  {
    id: "tales-of-herding-gods",
    title: "Tales of Herding Gods",
    searchQuery: "Tales of Herding Gods",
    anilistSearch: "Tales of Herding Gods",
    jikanSearch: "Mu Shen Ji",
    nextEpisodeSlug: "tales-of-herding-gods",
    aliases: ["mu shen ji", "tales of herding gods", "牧神记", "Mu Shen Ji 4"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx211181-93dehu3v5xHE.png",
    serverSlug: "tales-of-herding-gods",
    knownTotalEpisodes: 94,
    episodesSeason: "Season 1: 1–94+ episodes | Ongoing (Nian Fan)",
    releaseSchedule: "Sundays at 10:00 AM (GMT+8)",
    releaseDay: "Sunday",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Ongoing (Nian Fan)",
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
    aliases: ["tunshi xingkong", "swallowed star", "吞噬星空", "Tunshi Xingkong 4"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx166219-tREIb5l5huVe.png",
    serverSlug: "swallowed-star",
    knownTotalEpisodes: 260,
    episodesSeason: "S1–S4 (Episodes 1–260+) | Ongoing",
    releaseSchedule: "Wednesdays at 10:00 AM (GMT+8)",
    releaseDay: "Wednesday",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/swallowed-star-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/swallowed-star-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/swallowed-star-lucifer-donghua/",
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
    episodesSeason: "1–26 episodes | Completed / Ongoing Season 2",
    releaseSchedule: "Fridays at 10:00 AM (GMT+8)",
    releaseDay: "Friday",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Completed / Ongoing Season 2",
    streamingLinks: {
      anime4i: "https://anime4i.com/eclipse-of-illusion-s1-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/eclipse-of-illusion-s1-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/eclipse-of-illusion-s1-lucifer-donghua/",
    },
  },
  {
    id: "the-miasma-war",
    title: "Eclipse of Illusion Special War: The Miasma War",
    searchQuery: "The Miasma War",
    anilistSearch: "Eclipse of Illusion: The Miasma War",
    jikanSearch: "Yun Shen Buzhi Meng",
    nextEpisodeSlug: "the-miasma-war",
    aliases: ["the miasma war", "eclipse of illusion special war", "huan jing zhi yue miasma war"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx198697-UHaozIRuLiEA.png",
    serverSlug: "the-miasma-war",
    knownTotalEpisodes: 6,
    episodesSeason: "1–6 episodes | Completed Special Series",
    releaseSchedule: "Wednesdays at 10:00 AM (GMT+8)",
    releaseDay: "Wednesday",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Completed Special Series",
    streamingLinks: {
      anime4i: "https://anime4i.com/the-miasma-war-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/the-miasma-war-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/the-miasma-war-lucifer-donghua/",
    },
  },
  {
    id: "battle-through-the-heavens",
    title: "Battle Through The Heavens",
    searchQuery: "Battle Through the Heavens",
    anilistSearch: "Battle Through the Heavens",
    jikanSearch: "Dou Po Cangqiong",
    nextEpisodeSlug: "battle-through-the-heavens",
    aliases: ["doupo cangqiong", "battle through the heavens", "斗破苍穹", "Dou Po Cangqiong: Nian Fan 4"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx196613-20kz65bVsHl7.jpg",
    serverSlug: "battle-through-the-heavens",
    knownTotalEpisodes: 209,
    episodesSeason: "S1–S5 (Episodes 1–209+) | Ongoing (Nian Fan)",
    releaseSchedule: "Sundays at 10:00 AM (GMT+8)",
    releaseDay: "Sunday",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Ongoing (Nian Fan)",
    streamingLinks: {
      anime4i: "https://anime4i.com/battle-through-the-heavens-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/battle-through-the-heavens-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/battle-through-the-heavens-lucifer-donghua/",
    },
  },
  {
    id: "one-hundred-thousand-years-of-qi-refining",
    title: "One Hundred Thousand Years of Qi Refining",
    searchQuery: "One Hundred Thousand Years of Refining Qi",
    anilistSearch: "One Hundred Thousand Years of Qi Refining",
    jikanSearch: "Lian Qi Shiwan Nian",
    nextEpisodeSlug: "one-hundred-thousand-years-of-qi-refining",
    aliases: ["lian qi shi wan nian", "100,000 Years of Qi Refining", "炼气十万年", "Lian Qi Shiwan Nian"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b165524-XMXXm35IgGAB.jpg",
    serverSlug: "one-hundred-thousand-years-of-qi-refining",
    knownTotalEpisodes: 359,
    episodesSeason: "1–359+ episodes | Ongoing",
    releaseSchedule: "Tuesdays and Saturdays at 10:00 AM (GMT+8)",
    releaseDay: "Multiple",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/one-hundred-thousand-years-of-qi-refining-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/one-hundred-thousand-years-of-qi-refining-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/one-hundred-thousand-years-of-qi-refining-lucifer-donghua/",
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
    knownTotalEpisodes: 286,
    episodesSeason: "1–286+ episodes | Ongoing",
    releaseSchedule: "Fridays at 10:00 AM (GMT+8)",
    releaseDay: "Friday",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/perfect-world-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/perfect-world-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/perfect-world-lucifer-donghua/",
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
    knownTotalEpisodes: 170,
    episodesSeason: "1–170+ episodes | Ongoing (Nian Fan)",
    releaseSchedule: "Wednesdays at 10:00 AM (GMT+8)",
    releaseDay: "Wednesday",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Ongoing (Nian Fan)",
    streamingLinks: {
      anime4i: "https://anime4i.com/shrouding-the-heavens-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/shrouding-the-heavens-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/shrouding-the-heavens-lucifer-donghua/",
    },
  },
  {
    id: "tomb-of-fallen-gods",
    title: "Tomb of Fallen Gods",
    searchQuery: "Tomb of Fallen Gods",
    anilistSearch: "Tomb of Fallen Gods",
    jikanSearch: "Shen Mu",
    nextEpisodeSlug: "tomb-of-fallen-gods",
    aliases: ["shen mu", "tomb of fallen gods", "神墓", "Shen Mu 3"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx198701-lyhCxTRIvuXA.jpg",
    serverSlug: "tomb-of-fallen-gods",
    knownTotalEpisodes: 60,
    episodesSeason: "Season 1: 1–16 episodes | Season 2: 1–44+ episodes | Ongoing",
    releaseSchedule: "Saturdays at 10:00 AM (GMT+8)",
    releaseDay: "Saturday",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/tomb-of-fallen-gods-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/tomb-of-fallen-gods-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/tomb-of-fallen-gods-lucifer-donghua/",
    },
  },
  {
    id: "spy-x-sect",
    title: "Spy X Sect (All female spies are in my sect)",
    searchQuery: "Wo De Jia Shi Dou Shi Wo De Yan Xian",
    anilistSearch: "Wo De Jia Shi Dou Shi Wo De Yan Xian",
    jikanSearch: "Wo De Jia Shi Dou Shi Wo De Yan Xian",
    nextEpisodeSlug: "spy-x-sect",
    aliases: ["wo de jia shi dou shi wo de yan xian", "spy x sect", "All Female Spies In My Sect"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101966-05APsz77zSsu.png",
    serverSlug: "spy-x-sect",
    knownTotalEpisodes: 92,
    episodesSeason: "1–92+ episodes | Ongoing",
    releaseSchedule: "Thursdays at 10:00 AM (GMT+8)",
    releaseDay: "Thursday",
    releaseTime: "10:00 AM (GMT+8)",
    statusTag: "Ongoing",
    streamingLinks: {
      anime4i: "https://anime4i.com/spy-x-sect-english-subtitles/",
      luciferDonghuaOrg: "https://luciferdonghua.org/spy-x-sect-english-sub/",
      luciferDonghuaIn: "https://luciferdonghua.in/spy-x-sect-lucifer-donghua/",
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

