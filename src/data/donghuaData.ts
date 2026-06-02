export interface DonghuaSeries {
  id: string;
  title: string;
  searchQuery: string;
  anilistSearch: string;
  jikanSearch: string;
  nextEpisodeSlug: string;
  thumbnail: string;
  serverSlug?: string; // Optional slug for servers if different from id
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
    searchQuery: "Xian Ni",
    anilistSearch: "Xian Ni",
    jikanSearch: "xian ni",
    nextEpisodeSlug: "renegade-immortal",
    thumbnail: "https://wsrv.nl/?url=https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx163542-m97v60G7VvT8.jpg",
    serverSlug: "renegade-immortal-xian-ni"
  },
  {
    id: "beyond-times-gaze",
    title: "Beyond Time’s Gaze",
    searchQuery: "Guang Yin Zhi Wai",
    anilistSearch: "Guang Yin Zhi Wai",
    jikanSearch: "Guang Yin Zhi Wai",
    nextEpisodeSlug: "beyond-times-gaze",
    thumbnail: "https://wsrv.nl/?url=https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx170135-7uYyJm8Xp8S0.jpg",
    serverSlug: "beyond-times-gaze"
  },
  {
    id: "tales-of-herding-gods",
    title: "Tales of Herding Gods",
    searchQuery: "Mu Shen Ji",
    anilistSearch: "Mu Shen Ji",
    jikanSearch: "Mu Shen Ji",
    nextEpisodeSlug: "tales-of-herding-gods",
    thumbnail: "https://wsrv.nl/?url=https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx171311-5uYyJm8Xp8S0.jpg",
    serverSlug: "tales-of-herding-gods"
  },
  {
    id: "swallowed-star",
    title: "Swallowed Star",
    searchQuery: "Tunshi Xingkong",
    anilistSearch: "Tunshi Xingkong",
    jikanSearch: "Tunshi Xingkong",
    nextEpisodeSlug: "swallowed-star",
    thumbnail: "https://wsrv.nl/?url=https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx124314-7uYyJm8Xp8S0.jpg",
    serverSlug: "swallowed-star"
  },
  {
    id: "one-hundred-thousand-years-of-qi-refining",
    title: "One Hundred Thousand Years of Qi Refining",
    searchQuery: "Lian Qi Shi Wan Nian",
    anilistSearch: "Lian Qi Shi Wan Nian",
    jikanSearch: "Lian Qi Shi Wan Nian",
    nextEpisodeSlug: "one-hundred-thousand-years-of-qi-refining",
    thumbnail: "https://wsrv.nl/?url=https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx162486-7uYyJm8Xp8S0.jpg",
    serverSlug: "one-hundred-thousand-years-of-qi-refining"
  },
  {
    id: "battle-through-the-heavens",
    title: "Battle Through The Heavens",
    searchQuery: "Doupo Cangqiong",
    anilistSearch: "Doupo Cangqiong",
    jikanSearch: "Doupo Cangqiong",
    nextEpisodeSlug: "battle-through-the-heavens",
    thumbnail: "https://wsrv.nl/?url=https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx98075-7uYyJm8Xp8S0.jpg",
    serverSlug: "battle-through-the-heavens"
  },
  {
    id: "eclipse-of-illusion",
    title: "Eclipse of Illusion",
    searchQuery: "Huan Jing Zhi Yue",
    anilistSearch: "Huan Jing Zhi Yue",
    jikanSearch: "Huan Jing Zhi Yue",
    nextEpisodeSlug: "eclipse-of-illusion",
    thumbnail: "https://wsrv.nl/?url=https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx206160-l36djxNn7Mm2.jpg",
    serverSlug: "eclipse-of-illusion"
  },
  {
    id: "tomb-of-fallen-gods",
    title: "Tomb of Fallen Gods",
    searchQuery: "Shen Mu",
    anilistSearch: "Shen Mu",
    jikanSearch: "Shen Mu",
    nextEpisodeSlug: "tomb-of-fallen-gods",
    thumbnail: "https://wsrv.nl/?url=https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx153120-7uYyJm8Xp8S0.jpg",
    serverSlug: "tomb-of-fallen-gods"
  },
  {
    id: "spy-x-sect",
    title: "Spy X Sect",
    searchQuery: "Wo De Jia Shi Dou Shi Wo De Yan Xian",
    anilistSearch: "Wo De Jia Shi Dou Shi Wo De Yan Xian",
    jikanSearch: "Wo De Jia Shi Dou Shi Wo De Yan Xian",
    nextEpisodeSlug: "spy-x-sect",
    thumbnail: "https://wsrv.nl/?url=https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx170137-7uYyJm8Xp8S0.jpg",
    serverSlug: "spy-x-sect"
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
