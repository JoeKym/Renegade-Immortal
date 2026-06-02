export interface DonghuaSeries {
  id: string;
  title: string;
  searchQuery: string;
  anilistSearch: string;
  jikanSearch: string;
  thumbnail: string;
  serverSlug?: string; // Optional slug for servers if different from id
}

export const DONGHUA_SERIES: DonghuaSeries[] = [
  {
    id: "renegade-immortal",
    title: "Renegade Immortal",
    searchQuery: "Xian Ni",
    anilistSearch: "Xian Ni",
    jikanSearch: "xian ni",
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx163542-m97v60G7VvT8.jpg",
    serverSlug: "renegade-immortal-xian-ni"
  },
  {
    id: "beyond-times-gaze",
    title: "Beyond Time’s Gaze",
    searchQuery: "Guang Yin Zhi Wai",
    anilistSearch: "Guang Yin Zhi Wai",
    jikanSearch: "Guang Yin Zhi Wai",
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx170135-7uYyJm8Xp8S0.jpg",
    serverSlug: "beyond-times-gaze"
  },
  {
    id: "tales-of-herding-gods",
    title: "Tales of Herding Gods",
    searchQuery: "Mu Shen Ji",
    anilistSearch: "Mu Shen Ji",
    jikanSearch: "Mu Shen Ji",
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx171311-5uYyJm8Xp8S0.jpg",
    serverSlug: "tales-of-herding-gods"
  },
  {
    id: "swallowed-star",
    title: "Swallowed Star",
    searchQuery: "Tunshi Xingkong",
    anilistSearch: "Tunshi Xingkong",
    jikanSearch: "Tunshi Xingkong",
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx124314-7uYyJm8Xp8S0.jpg",
    serverSlug: "swallowed-star"
  },
  {
    id: "one-hundred-thousand-years-of-qi-refining",
    title: "One Hundred Thousand Years of Qi Refining",
    searchQuery: "Lian Qi Shi Wan Nian",
    anilistSearch: "Lian Qi Shi Wan Nian",
    jikanSearch: "Lian Qi Shi Wan Nian",
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx162486-7uYyJm8Xp8S0.jpg",
    serverSlug: "one-hundred-thousand-years-of-qi-refining"
  },
  {
    id: "battle-through-the-heavens",
    title: "Battle Through The Heavens",
    searchQuery: "Doupo Cangqiong",
    anilistSearch: "Doupo Cangqiong",
    jikanSearch: "Doupo Cangqiong",
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx98075-7uYyJm8Xp8S0.jpg",
    serverSlug: "battle-through-the-heavens"
  },
  {
    id: "eclipse-of-illusion",
    title: "Eclipse of Illusion",
    searchQuery: "Huan Jing Zhi Yue",
    anilistSearch: "Huan Jing Zhi Yue",
    jikanSearch: "Huan Jing Zhi Yue",
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx170136-7uYyJm8Xp8S0.jpg",
    serverSlug: "eclipse-of-illusion"
  },
  {
    id: "tomb-of-fallen-gods",
    title: "Tomb of Fallen Gods",
    searchQuery: "Shen Mu",
    anilistSearch: "Shen Mu",
    jikanSearch: "Shen Mu",
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx153120-7uYyJm8Xp8S0.jpg",
    serverSlug: "tomb-of-fallen-gods"
  },
  {
    id: "spy-x-sect",
    title: "Spy X Sect",
    searchQuery: "Wo De Jia Shi Dou Shi Wo De Yan Xian",
    anilistSearch: "Wo De Jia Shi Dou Shi Wo De Yan Xian",
    jikanSearch: "Wo De Jia Shi Dou Shi Wo De Yan Xian",
    thumbnail: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx170137-7uYyJm8Xp8S0.jpg",
    serverSlug: "spy-x-sect"
  },
];
