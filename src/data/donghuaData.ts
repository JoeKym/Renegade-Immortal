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
    serverSlug: "renegade-immortal-xian-ni"
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
    serverSlug: "beyond-times-gaze"
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
    serverSlug: "tales-of-herding-gods"
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
    serverSlug: "swallowed-star"
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
    serverSlug: "one-hundred-thousand-years-of-qi-refining"
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
    serverSlug: "battle-through-the-heavens"
  },
  {
    id: "eclipse-of-illusion",
    title: "Eclipse of Illusion",
    searchQuery: "Eclipse of Illusion",
    anilistSearch: "Eclipse of Illusion",
    jikanSearch: "Yun Shen Buzhi Meng",
    nextEpisodeSlug: "eclipse-of-illusion",
    aliases: ["huan jing zhi yue", "eclipse of illusion", "幻境之月", "Yun Shen Buzhi Meng"],
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx198697-UHaozIRuLiEA.png",
    serverSlug: "eclipse-of-illusion"
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
    serverSlug: "tomb-of-fallen-gods"
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
    serverSlug: "spy-x-sect"
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
    serverSlug: "perfect-world"
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
    serverSlug: "shrouding-the-heavens"
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
