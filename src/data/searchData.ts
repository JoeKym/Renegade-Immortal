export interface SearchResult {
  id?: string;
  title: string;
  category:
    | "Character"
    | "Dao"
    | "Cultivation"
    | "Lore"
    | "Multiverse"
    | "Timeline"
    | "Donghua"
    | "Episode"
    | "Artifact"
    | "Technique"
    | "Location"
    | "Community"
    | "Account"
    | "Guide"
    | "Page"
    | "Series"
    | "News";
  description: string;
  path: string;
  keywords?: string[];
  realm?: string;
  alignment?: string;
  tags?: string[];
}

export const searchableData: SearchResult[] = [
  // CHARACTERS
  {
    title: "Wang Lin",
    category: "Character",
    description: "The central protagonist of Renegade Immortal. Rises from a talentless mortal in Zhao Country to a Transcendent 4th-Step God who wields 14 Essences.",
    path: "/characters?q=Wang+Lin",
    realm: "Transcendence (4th Step)",
    alignment: "Protagonist",
    keywords: ["wang lin", "xu mu", "ceng niu", "ma liang", "master demon", "slaughter clone", "14 essences", "tian ni pearl", "xian ni"],
    tags: ["protagonist", "4th-step", "ancient-god", "slaughter"]
  },
  {
    title: "Xu Mu",
    category: "Character",
    description: "Wang Lin's famous alias — Master Demon Xu Mu in the Luotian Star Domain. Known for wearing magic armor and wielding unmatched slaughter intent.",
    path: "/characters?q=Wang+Lin",
    realm: "Nirvana Scryer",
    alignment: "Protagonist",
    keywords: ["xu mu", "master demon", "luotian star domain", "magic armor", "wang lin alias"],
    tags: ["alias", "luotian", "slaughter"]
  },
  {
    title: "Ceng Niu",
    category: "Character",
    description: "Wang Lin's covert alias used while infiltrating medicine gardens and sects in the Luotian and Yunhai Star Domains.",
    path: "/characters?q=Wang+Lin",
    realm: "Ascendant",
    alignment: "Protagonist",
    keywords: ["ceng niu", "wang lin alias", "medicine garden", "yunhai"],
    tags: ["alias", "yunhai"]
  },
  {
    title: "Ma Liang",
    category: "Character",
    description: "Wang Lin's early alias after possessing the body of a War Shrine disciple on Planet Suzaku.",
    path: "/characters?q=Wang+Lin",
    realm: "Foundation Establishment",
    alignment: "Protagonist",
    keywords: ["ma liang", "war shrine", "possession", "suzaku"],
    tags: ["alias", "early-story"]
  },
  {
    title: "Li Muwan",
    category: "Character",
    description: "Wang Lin's wife and greatest emotional anchor. Master Alchemist whose soul Wang Lin spent centuries fighting fate and heaven to resurrect.",
    path: "/characters?q=Li+Muwan",
    realm: "Core Formation",
    alignment: "Ally",
    keywords: ["li muwan", "wan'er", "alchemist", "sea of devils", "resurrection", "heaven avoiding coffin"],
    tags: ["heroine", "alchemist", "romance"]
  },
  {
    title: "Situ Nan",
    category: "Character",
    description: "Wang Lin's first teacher and former Lord of Suzaku. A rogue cultivator spirit inside the Heaven-Defying Pearl who taught Wang Lin underworld arts.",
    path: "/characters?q=Situ+Nan",
    realm: "Nirvana Seeker",
    alignment: "Master",
    keywords: ["situ nan", "heaven defying bead", "underworld pearl", "suzaku lord", "master", "yin yang illusory"],
    tags: ["mentor", "suzaku", "underworld"]
  },
  {
    title: "Qing Shui",
    category: "Character",
    description: "Wang Lin's senior brother under Celestial Emperor Bai Fan. Legendary powerhouse of the Slaughter Dao with white hair and tragic karmic destiny.",
    path: "/characters?q=Qing+Shui",
    realm: "Nirvana Seeker",
    alignment: "Ally",
    keywords: ["qing shui", "slaughter dao", "white hair", "bai fan", "celestial realm", "senior brother"],
    tags: ["senior-brother", "slaughter", "celestial"]
  },
  {
    title: "All-Seer",
    category: "Character",
    description: "Tian Yunzi — Master of Tian Yun Sect and the Purple Fragment of Seven Souls. Wang Lin's arch-nemesis who raised disciples only to devour them.",
    path: "/characters?q=All-Seer",
    realm: "Third Step",
    alignment: "Antagonist",
    keywords: ["all-seer", "tian yunzi", "tian yun sect", "seven fragments", "fate manipulator", "purple fragment"],
    tags: ["villain", "master-antagonist", "manipulator"]
  },
  {
    title: "Liu Mei",
    category: "Character",
    description: "Indigo Fragment of Seven Souls. Cultivated the Dao of Heartless Love using Wang Lin, resulting in the birth of Wang Ping.",
    path: "/characters?q=Liu+Mei",
    realm: "Ascendant",
    alignment: "Rival",
    keywords: ["liu mei", "heartless love", "indigo fragment", "wang ping mother", "huan liu mei"],
    tags: ["rival", "heartless-dao"]
  },
  {
    title: "Tu Si",
    category: "Character",
    description: "Royal 8-Star Ancient God of the Tu Clan. His tomb on Planet Suzaku contained the Ancient God Inheritance that transformed Wang Lin's destiny.",
    path: "/characters?q=Tu+Si",
    realm: "8-Star Ancient God",
    alignment: "Master",
    keywords: ["tu si", "ancient god", "royal ancient god", "tu si tomb", "ancient god inheritance"],
    tags: ["ancient-race", "god-lineage"]
  },
  {
    title: "Tuo Sen",
    category: "Character",
    description: "Tu Si's inner devil reborn as a powerful Ancient Demon. Wang Lin's formidable rival for the full body of Tu Si in the Ancient God Tomb.",
    path: "/characters?q=Tou+Sen",
    realm: "8-Star Ancient Demon",
    alignment: "Antagonist",
    keywords: ["tuo sen", "tou sen", "ancient demon", "inner devil", "tu si body", "ancient god tomb"],
    tags: ["ancient-demon", "antagonist"]
  },
  {
    title: "Bei Luo",
    category: "Character",
    description: "Ancient Demon Commander of Sky Demon Country. Allies with Wang Lin to reclaim ancient demon energy and withstand outer realm tides.",
    path: "/characters?q=Bei+Luo",
    realm: "Ancient Demon Commander",
    alignment: "Ally",
    keywords: ["bei luo", "ancient demon", "sky demon country", "demon commander"],
    tags: ["ancient-demon", "ally"]
  },
  {
    title: "Ta Jia",
    category: "Character",
    description: "Master of the Ancient Devil ways and progenitor of dark devil sealing arts in the Ancient God Tomb.",
    path: "/characters?q=Ta+Jia",
    realm: "Ancient Devil Progenitor",
    alignment: "Antagonist",
    keywords: ["ta jia", "ancient devil", "devil arts", "devil seals"],
    tags: ["ancient-devil", "antagonist"]
  },
  {
    title: "Teng Huayuan",
    category: "Character",
    description: "Patriarch of Teng Clan in Zhao Country. Massacred Wang Lin's entire family, prompting Wang Lin's infamous tower-of-heads revenge.",
    path: "/characters?q=Teng+Huayuan",
    realm: "Nascent Soul",
    alignment: "Antagonist",
    keywords: ["teng huayuan", "teng clan", "zhao country", "revenge", "head tower", "wang lin enemy"],
    tags: ["early-villain", "revenge"]
  },
  {
    title: "Zhou Ru",
    category: "Character",
    description: "Reincarnated vessel carrying Li Muwan's soul fragments. Protected affectionately by Wang Lin as his cherished junior.",
    path: "/characters?q=Zhou+Ru",
    realm: "Foundation Establishment",
    alignment: "Family",
    keywords: ["zhou ru", "li muwan soul", "little ru'er", "vessel", "yunhai"],
    tags: ["family", "reincarnation"]
  },
  {
    title: "Li Qianmei",
    category: "Character",
    description: "Cultivator of the Dream Dao in Yunhai Star Domain. Sacrificed her soul blood for ten years to keep Wang Lin alive during his ten-year slumber.",
    path: "/characters?q=Li+Qianmei",
    realm: "Nirvana Cleanser",
    alignment: "Ally",
    keywords: ["li qianmei", "dream dao", "soul blood", "yunhai realm", "ten year slumber"],
    tags: ["heroine", "dream-dao", "sacrificial"]
  },
  {
    title: "Master South Cloud",
    category: "Character",
    description: "Nirvana Seeker supreme expert and Alliance leader of the Southern Domain in Allheaven Star Domain.",
    path: "/characters?q=Master+South+Cloud",
    realm: "Nirvana Seeker",
    alignment: "Ally",
    keywords: ["master south cloud", "nan yunzi", "allheaven", "southern domain"],
    tags: ["ally", "leader"]
  },
  {
    title: "Grand Empyrean Gu Dao",
    category: "Character",
    description: "The strongest 9-Sun Grand Empyrean on the Immortal Astral Continent, ruler of the Ancient Dao Empire.",
    path: "/characters?q=Grand+Empyrean+Gu+Dao",
    realm: "9-Sun Grand Empyrean",
    alignment: "Ally",
    keywords: ["gu dao", "grand empyrean", "ancient dao empire", "9 sun grand empyrean", "immortal astral continent"],
    tags: ["grand-empyrean", "ancient-dao", "top-tier"]
  },
  {
    title: "Grand Empyrean Jiu Di",
    category: "Character",
    description: "Leader of the Celestial Empire 9-Sun Grand Empyreans on the Immortal Astral Continent.",
    path: "/characters?q=Grand+Empyrean+Jiu+Di",
    realm: "9-Sun Grand Empyrean",
    alignment: "Rival",
    keywords: ["jiu di", "grand empyrean", "celestial empire", "immortal astral continent"],
    tags: ["grand-empyrean", "celestial-empire"]
  },
  {
    title: "Empyrean Exalt Hai Zi",
    category: "Character",
    description: "Disciple of Grand Empyrean Jiu Di who practiced the Dream Dao and crossed paths with Wang Lin on the Immortal Astral Continent.",
    path: "/characters?q=Empyrean+Exalt+Hai+Zi",
    realm: "Empyrean Exalt",
    alignment: "Ally",
    keywords: ["hai zi", "empyrean exalt", "jiu di disciple", "dream dao"],
    tags: ["empyrean-exalt", "dream-dao"]
  },
  {
    title: "Daoist Water",
    category: "Character",
    description: "Former Allheaven Third-Step cultivator who defected to the Outer Realm to pursue supreme water essence.",
    path: "/characters?q=Daoist+Water",
    realm: "Third Step",
    alignment: "Antagonist",
    keywords: ["daoist water", "shui daozi", "water essence", "allheaven traitor", "outer realm"],
    tags: ["villain", "third-step", "traitor"]
  },
  {
    title: "Master Flamespark",
    category: "Character",
    description: "Yan Leizi — Tactical mastermind and Supreme Ancestor of the Thunder Celestial Temple in Allheaven.",
    path: "/characters?q=Master+Flamespark",
    realm: "Nirvana Seeker",
    alignment: "Ally",
    keywords: ["master flamespark", "yan leizi", "thunder celestial temple", "allheaven"],
    tags: ["ally", "thunder-temple"]
  },
  {
    title: "Demon Emperor Gu Yundun",
    category: "Character",
    description: "Supreme ruler of Sky Demon Country who fought against the Ancient Devil invasion.",
    path: "/characters?q=Demon+Emperor+Gu+Yundun",
    realm: "Demon Emperor",
    alignment: "Ally",
    keywords: ["gu yundun", "sky demon country", "demon emperor"],
    tags: ["demon-ruler", "ally"]
  },
  {
    title: "Mu Bingmei",
    category: "Character",
    description: "Cold and prideful disciple of All-Seer, twin soul counterpart of Liu Mei who bore Wang Lin's feelings of conflict.",
    path: "/characters?q=Mu+Bingmei",
    realm: "Nirvana Cleanser",
    alignment: "Rival",
    keywords: ["mu bingmei", "ice dao", "all seer disciple", "liu mei counterpart"],
    tags: ["heroine", "ice-dao"]
  },
  {
    title: "Su Ming",
    category: "Character",
    description: "Protagonist of Pursuit of the Truth (Beseech the Devil). Connected to Wang Lin through Er Gen's multiverse.",
    path: "/characters?q=Su+Ming",
    realm: "Transcendence (4th Step)",
    alignment: "Ally",
    keywords: ["su ming", "pursuit of the truth", "beseech the devil", "er gen multiverse", "devil transcendent"],
    tags: ["multiverse", "protagonist"]
  },
  {
    title: "Meng Hao",
    category: "Character",
    description: "Protagonist of I Shall Seal the Heavens. Met Wang Lin during cosmic travels in Er Gen's multiverse.",
    path: "/characters?q=Su+Ming",
    realm: "Transcendence (4th Step)",
    alignment: "Ally",
    keywords: ["meng hao", "i shall seal the heavens", "issth", "demon transcendent", "er gen multiverse"],
    tags: ["multiverse", "protagonist"]
  },

  // DAOS & ESSENCES
  {
    title: "14 Essences of Wang Lin",
    category: "Dao",
    description: "The complete collection of Wang Lin's 14 Essences split into 5 Ethereal Essences, 5 Corporeal Essences, and 4 Special Essences.",
    path: "/daos",
    keywords: ["14 essences", "ethereal essences", "corporeal essences", "special essences", "wang lin essences", "dao mastery"],
    tags: ["14-essences", "ethereal", "corporeal", "special"]
  },
  {
    title: "Ethereal Essences",
    category: "Dao",
    description: "Life/Death, Karma, True/False, Dream, and Reincarnation. Mastered through life insights and comprehension of world laws.",
    path: "/daos",
    keywords: ["ethereal essences", "life death dao", "karma dao", "true false dao", "dream dao", "reincarnation dao"],
    tags: ["ethereal", "comprehension", "laws"]
  },
  {
    title: "Corporeal Essences",
    category: "Dao",
    description: "Thunder, Fire, Water, Earth, Wood, Metal. Physical element essences forming the Five Elements True Body.",
    path: "/daos",
    keywords: ["corporeal essences", "five elements", "thunder essence", "fire essence", "water essence", "earth essence", "wood essence", "metal essence"],
    tags: ["corporeal", "five-elements", "physical"]
  },
  {
    title: "Special Essences",
    category: "Dao",
    description: "Slaughter, Restriction, Absolute Beginning, Absolute End. Powers of destruction and heaven defiance that form the Slaughter True Body.",
    path: "/daos",
    keywords: ["special essences", "slaughter essence", "restriction essence", "absolute beginning", "absolute end", "slaughter true body"],
    tags: ["special", "slaughter", "heaven-defying"]
  },
  {
    title: "Five Elements True Body",
    category: "Dao",
    description: "Wang Lin's white-clothed clone formed by fusing Fire, Water, Earth, Wood, and Metal essences.",
    path: "/daos",
    keywords: ["five elements true body", "white clone", "five elements fusion", "elemental clone"],
    tags: ["true-body", "clone", "five-elements"]
  },
  {
    title: "Slaughter True Body",
    category: "Dao",
    description: "Wang Lin's black-clothed clone formed from Slaughter, Thunder, Restriction, Absolute Beginning, and Absolute End essences.",
    path: "/daos",
    keywords: ["slaughter true body", "black clone", "slaughter essence", "restriction essence"],
    tags: ["true-body", "clone", "slaughter"]
  },
  {
    title: "Life & Death Dao",
    category: "Dao",
    description: "Wang Lin's first Ethereal Essence, born on Planet Suzaku after comprehending life and death cycle in mortal villages.",
    path: "/daos",
    keywords: ["life death dao", "life and death essence", "mortal comprehension", "suzaku domain"],
    tags: ["ethereal", "first-essence", "life-death"]
  },
  {
    title: "Karma Dao",
    category: "Dao",
    description: "Wang Lin's second Ethereal Essence, understanding cause and effect across thousands of lives and reincarnations.",
    path: "/daos",
    keywords: ["karma dao", "cause and effect", "karmic thread", "karmic severance"],
    tags: ["ethereal", "karma", "cause-effect"]
  },
  {
    title: "True & False Dao",
    category: "Dao",
    description: "Wang Lin's third Ethereal Essence, distinguishing illusion from reality and manifesting real objects from dream states.",
    path: "/daos",
    keywords: ["true false dao", "illusory realm", "reality control", "dream illusion"],
    tags: ["ethereal", "true-false", "illusion"]
  },

  // CULTIVATION REALMS
  {
    title: "Qi Condensation",
    category: "Cultivation",
    description: "1st level of cultivation (Layers 1-15). Absorbing spiritual energy into the body to open meridians.",
    path: "/cultivation",
    realm: "1st Step - Stage 1",
    keywords: ["qi condensation", "1st step", "meridians", "spiritual energy"],
    tags: ["1st-step", "early-realm"]
  },
  {
    title: "Foundation Establishment",
    category: "Cultivation",
    description: "2nd level of cultivation. Solidifying spiritual energy into liquid state within the Dantian.",
    path: "/cultivation",
    realm: "1st Step - Stage 2",
    keywords: ["foundation establishment", "dantian", "liquid spiritual energy"],
    tags: ["1st-step", "foundation"]
  },
  {
    title: "Core Formation",
    category: "Cultivation",
    description: "3rd level of cultivation. Condensing liquid energy into a solid Golden Core.",
    path: "/cultivation",
    realm: "1st Step - Stage 3",
    keywords: ["core formation", "golden core", "core realm"],
    tags: ["1st-step", "core"]
  },
  {
    title: "Nascent Soul",
    category: "Cultivation",
    description: "4th level of cultivation. Birth of the Nascent Soul, allowing body destruction survival.",
    path: "/cultivation",
    realm: "1st Step - Stage 4",
    keywords: ["nascent soul", "yuan ying", "soul birth"],
    tags: ["1st-step", "nascent-soul"]
  },
  {
    title: "Spirit Severing",
    category: "Cultivation",
    description: "Severing mortal desires to form the Dao Domain and step into the Second Step.",
    path: "/cultivation",
    realm: "2nd Step - Transition",
    keywords: ["spirit severing", "dao domain", "severing desires", "2nd step"],
    tags: ["2nd-step", "severing"]
  },
  {
    title: "Nirvana Seeker",
    category: "Cultivation",
    description: "High Second Step realm where cultivators comprehend natural laws and prepare for Third Step ascension.",
    path: "/cultivation",
    realm: "2nd Step - Late Stage",
    keywords: ["nirvana seeker", "nirvana cleanser", "nirvana scryer", "2nd step peak"],
    tags: ["2nd-step", "nirvana"]
  },
  {
    title: "Empyrean Exalt",
    category: "Cultivation",
    description: "Third Step realm on the Immortal Astral Continent achieved by forming an Essence True Body.",
    path: "/cultivation",
    realm: "3rd Step",
    keywords: ["empyrean exalt", "3rd step", "immortal astral continent", "essence true body"],
    tags: ["3rd-step", "empyrean"]
  },
  {
    title: "9-Sun Grand Empyrean",
    category: "Cultivation",
    description: "The pinnacle of the Third Step. Nine suns manifest behind the cultivator, granting unmatched authority.",
    path: "/cultivation",
    realm: "3rd Step Peak",
    keywords: ["9-sun grand empyrean", "grand empyrean", "gu dao", "jiu di", "sun treader"],
    tags: ["3rd-step-peak", "grand-empyrean"]
  },
  {
    title: "Transcendence (4th Step)",
    category: "Cultivation",
    description: "The ultimate realm beyond all cosmic laws, universe boundaries, and reincarnation cycles.",
    path: "/cultivation",
    realm: "4th Step",
    keywords: ["transcendence", "4th step", "god realm", "beyond heaven", "wang lin final realm"],
    tags: ["4th-step", "transcendence", "pinnacle"]
  },

  // LORE, FACTIONS & RACES
  {
    title: "Ancient Gods",
    category: "Lore",
    description: "Primordial race embodying cosmic creation and physical order. Star marks on foreheads denote star rank.",
    path: "/lore",
    keywords: ["ancient gods", "tu si", "star rank", "royal ancient god", "primordial race"],
    tags: ["ancient-race", "gods"]
  },
  {
    title: "Ancient Demons",
    category: "Lore",
    description: "Chaotic ancient race respecting battle power and demonic soul transformation.",
    path: "/lore",
    keywords: ["ancient demons", "tuo sen", "bei luo", "sky demon country", "demon command"],
    tags: ["ancient-race", "demons"]
  },
  {
    title: "Ancient Devils",
    category: "Lore",
    description: "Most destructive of the three ancient races, masters of devil curses and sealing restrictions.",
    path: "/lore",
    keywords: ["ancient devils", "ta jia", "devil arts", "devil seals"],
    tags: ["ancient-race", "devils"]
  },
  {
    title: "Heaven's Tribulation & Dao Eye",
    category: "Lore",
    description: "Cosmic law mechanism punishing cultivators who defy heaven or break through realm limits.",
    path: "/lore",
    keywords: ["heaven tribulation", "dao eye", "tribulation lightning", "heavenly penalty"],
    tags: ["cosmic-law", "tribulation"]
  },

  // MULTIVERSE & COSMOLOGY
  {
    title: "Er Gen Multiverse",
    category: "Multiverse",
    description: "Shared universe connecting Renegade Immortal, Pursuit of the Truth, ISSTH, A Will Eternal, and Beyond the Timescape.",
    path: "/multiverse",
    keywords: ["er gen multiverse", "er genverse", "issth", "a will eternal", "pursuit of the truth", "beyond time's gaze"],
    tags: ["multiverse", "er-gen"]
  },
  {
    title: "The God's True Identity",
    category: "Multiverse",
    description: "In the climax of Er Gen's multiverse lore: 'The God's real name is Wang Lin', the ultimate Transcendent of Godhood.",
    path: "/multiverse",
    keywords: ["the god", "wang lin god", "god transcendence", "er gen god"],
    tags: ["multiverse", "godhood"]
  },

  // TIMELINE & ARCS
  {
    title: "Arc 1: Mortal's Beginning & Heng Yue Sect",
    category: "Timeline",
    description: "Wang Lin enters Heng Yue Sect as an untalented youth and discovers the Heaven-Defying Pearl.",
    path: "/timeline",
    keywords: ["arc 1", "heng yue sect", "mortal beginning", "heaven-defying bead discovery"],
    tags: ["arc-1", "early-life"]
  },
  {
    title: "Arc 2: Zhao Country Vengeance & Sea of Devils",
    category: "Timeline",
    description: "Wang Lin takes revenge on Teng Clan and trains under Situ Nan inside the Sea of Devils.",
    path: "/timeline",
    keywords: ["arc 2", "zhao country massacre", "teng clan vengeance", "sea of devils"],
    tags: ["arc-2", "vengeance"]
  },
  {
    title: "Arc 5: Luotian Star Domain & Master Demon Legend",
    category: "Timeline",
    description: "Wang Lin travels to Luotian, earns the alias Xu Mu, and dominates the Thunder Celestial Competition.",
    path: "/timeline",
    keywords: ["arc 5", "luotian star domain", "xu mu legend", "thunder celestial temple"],
    tags: ["arc-5", "luotian"]
  },
  {
    title: "Arc 9: Transcendence & Heaven Defiance",
    category: "Timeline",
    description: "Wang Lin achieves the 4th Step, revives Li Muwan, and transcends all cosmic boundaries.",
    path: "/timeline",
    keywords: ["arc 9", "transcendence", "li muwan revival", "4th step god realm"],
    tags: ["arc-9", "climax"]
  },

  // DONGHUA & EPISODES
  {
    title: "Renegade Immortal Xian Ni Donghua",
    category: "Donghua",
    description: "3D Chinese anime adaptation by Tencent & Foch Film, releasing weekly episodes covering Wang Lin's journey.",
    path: "/donghua",
    keywords: ["renegade immortal donghua", "xian ni anime", "tencent animation", "foch film"],
    tags: ["donghua", "anime"]
  },
  {
    title: "Episode 153 Release Recap",
    category: "Episode",
    description: "Latest episode recap covering Wang Lin's high-stakes combat and cultivation breakthrough.",
    path: "/watch",
    keywords: ["episode 153", "xian ni 153", "watch episode 153", "donghua release"],
    tags: ["episode", "latest"]
  },
  {
    title: "Battle Through the Heavens (BTTH)",
    category: "Series",
    description: "Top donghua series companion featured in watch schedules and cross-series recommendations.",
    path: "/donghua-series?series=battle-through-the-heavens",
    keywords: ["battle through the heavens", "btth", "dou po cang qiong", "xiao yan"],
    tags: ["series", "btth"]
  },
  {
    title: "Swallowed Star",
    category: "Series",
    description: "Sci-fi cultivation donghua companion featured in weekly streaming release guides.",
    path: "/donghua-series?series=swallowed-star",
    keywords: ["swallowed star", "tunshi xingkong", "lu feng"],
    tags: ["series", "swallowed-star"]
  },

  // ARTIFACTS & TECHNIQUES
  {
    title: "Heaven-Defying Bead (Tian Ni Pearl)",
    category: "Artifact",
    description: "Wang Lin's core artifact containing 5 element spirits and a pocket space with 10x to 100x time dilation.",
    path: "/artifacts?q=Heaven-Defying+Bead",
    keywords: ["heaven defying bead", "tian ni pearl", "time dilation", "situ nan bead", "pocket dimension"],
    tags: ["supreme-artifact", "time-space"]
  },
  {
    title: "Heaven Rending Sword",
    category: "Artifact",
    description: "Dimensional slicing sword capable of severing space, barrier realms, and ancient array formations.",
    path: "/artifacts?q=Heaven+Rending+Sword",
    keywords: ["heaven rending sword", "space cut", "dimensional sword"],
    tags: ["weapon", "space"]
  },
  {
    title: "100-Million Soul Flag",
    category: "Artifact",
    description: "Wang Lin's signature dark treasure refined with millions of captured souls and main soul commanders.",
    path: "/artifacts?q=Soul+Flag",
    keywords: ["soul flag", "100 million soul flag", "spirit army", "underworld flag"],
    tags: ["soul-artifact", "army"]
  },
  {
    title: "Restriction Flag",
    category: "Artifact",
    description: "Formation array treasure composed of 99 restriction threads for sealing enemies and domains.",
    path: "/artifacts?q=Restriction+Flag",
    keywords: ["restriction flag", "restriction array", "sealing flag"],
    tags: ["restriction", "seal"]
  },
  {
    title: "Heaven-Avoiding Coffin",
    category: "Artifact",
    description: "Ancient relic coffin used by Wang Lin to preserve Li Muwan's body and soul against heavenly erosion.",
    path: "/artifacts?q=Heaven-Avoiding+Coffin",
    keywords: ["heaven avoiding coffin", "li muwan coffin", "soul preservation"],
    tags: ["coffin", "resurrection"]
  },
  {
    title: "Call the Wind",
    category: "Technique",
    description: "Celestial spell summoning black vortex winds that devour enemy lifeforce and cultivation.",
    path: "/artifacts?q=Call+the+Wind",
    keywords: ["call the wind", "wind spell", "celestial technique"],
    tags: ["technique", "celestial"]
  },
  {
    title: "Finger of Death",
    category: "Technique",
    description: "Underworld Dao attack channeling death energy into a single finger to extinguish enemy soul sparks.",
    path: "/artifacts?q=Finger+of+Death",
    keywords: ["finger of death", "death finger", "underworld technique"],
    tags: ["technique", "underworld"]
  },
  {
    title: "Stop",
    category: "Technique",
    description: "Wang Lin's space-time technique that freezes time for all targets in a designated domain.",
    path: "/artifacts?q=Stop",
    keywords: ["stop technique", "time freeze", "space time stop"],
    tags: ["technique", "time-freeze"]
  },

  // LOCATIONS & SECTS
  {
    title: "Planet Suzaku",
    category: "Location",
    description: "Wang Lin's home cultivation planet in the Alliance Star Domain where his cultivation path began.",
    path: "/locations?q=Planet+Suzaku",
    keywords: ["planet suzaku", "suzaku star", "zhao country", "sea of devils"],
    tags: ["planet", "homeland"]
  },
  {
    title: "Heng Yue Sect",
    category: "Location",
    description: "Wang Lin's initial cultivation sect located on Cloud Peak in Zhao Country.",
    path: "/locations?q=Heng+Yue+Sect",
    keywords: ["heng yue sect", "zhao country", "cloud peak", "sun dazhu"],
    tags: ["sect", "early-location"]
  },
  {
    title: "Luotian Star Domain",
    category: "Location",
    description: "Vast star realm governed by the Thunder Celestial Temple where Wang Lin earned the title Master Demon Xu Mu.",
    path: "/locations?q=Luotian+Star+Domain",
    keywords: ["luotian star domain", "luotian", "thunder celestial temple", "xu mu"],
    tags: ["star-domain", "luotian"]
  },
  {
    title: "Cloud Sea (Yunhai) Realm",
    category: "Location",
    description: "Mist-shrouded star domain known for fierce fierce-beasts, insect taming, and Li Qianmei's sect.",
    path: "/locations?q=Cloud+Sea",
    keywords: ["cloud sea realm", "yunhai star domain", "li qianmei", "beast taming"],
    tags: ["star-domain", "yunhai"]
  },
  {
    title: "Immortal Astral Continent",
    category: "Location",
    description: "The supreme continent where 9-Sun Grand Empyreans, Ancient Dao Empire, and Celestial Empire reside.",
    path: "/locations?q=Immortal+Astral+Continent",
    keywords: ["immortal astral continent", "ancient dao empire", "celestial empire", "grand empyreans"],
    tags: ["supreme-realm", "continent"]
  },

  // COMMUNITIES, GROUPS & ACCOUNTS
  {
    title: "Cultivators Union",
    category: "Community",
    description: "Primary fan discussion group for Renegade Immortal novel chapters, donghua episodes, and lore theories.",
    path: "/communities",
    keywords: ["cultivators union", "fan hub", "renegade immortal forum", "discussion group"],
    tags: ["community", "discussion"]
  },
  {
    title: "Dao of Slaughter Guild",
    category: "Community",
    description: "Community power-scaling guild dedicated to analyzing combat feats, 14 Essences, and realm battles.",
    path: "/communities",
    keywords: ["dao of slaughter guild", "power scaling", "feat analysis", "battle debates"],
    tags: ["community", "power-scaling"]
  },
  {
    title: "Er Gen Multiverse Guild",
    category: "Community",
    description: "Group exploring crossover lore between Xian Ni, ISSTH, AWE, Pursuit of the Truth, and Beyond the Timescape.",
    path: "/communities",
    keywords: ["er gen multiverse guild", "crossover guild", "issth fans", "multiverse lore"],
    tags: ["community", "multiverse"]
  },
  {
    title: "Community Member Profiles",
    category: "Account",
    description: "Directory of registered members, top cultivators, and community contributors on the site.",
    path: "/members",
    keywords: ["user profiles", "members", "account directory", "cultivators"],
    tags: ["accounts", "members"]
  },

  // GUIDES & FAQs
  {
    title: "Beginner Cultivation Guide",
    category: "Guide",
    description: "Comprehensive introduction to cultivation steps, 1st to 4th Steps, and Wang Lin's journey.",
    path: "/guide",
    keywords: ["beginner guide", "cultivation guide", "xian ni intro", "realm breakdown"],
    tags: ["guide", "beginner"]
  },
  {
    title: "Er Gen Novel Reading Order",
    category: "Guide",
    description: "Recommended reading order for Er Gen's 5 connected universe novels.",
    path: "/guide",
    keywords: ["reading order", "er gen reading order", "novel order", "issth reading guide"],
    tags: ["guide", "reading-order"]
  },
  {
    title: "Donghua vs Novel Differences Guide",
    category: "Guide",
    description: "Detailed breakdown of changes, pacing, and extra scenes between the novel and donghua anime adaptation.",
    path: "/guide",
    keywords: ["donghua vs novel", "anime differences", "novel adaptation guide"],
    tags: ["guide", "donghua-vs-novel"]
  },
  {
    title: "14 Essences Deep-Dive Guide",
    category: "Guide",
    description: "In-depth guide explaining Ethereal, Corporeal, and Special Essences and how Wang Lin formed his dual True Bodies.",
    path: "/guide",
    keywords: ["14 essences guide", "ethereal essences explained", "true body guide"],
    tags: ["guide", "essences"]
  },

  // PAGES & SITE INDEX
  { title: "Characters Compendium", category: "Page", description: "Browse all character profiles, alignments, and relationships", path: "/characters" },
  { title: "Daos & Essences Overview", category: "Page", description: "Explore the 14 Essences, True Bodies, and Dao domains", path: "/daos" },
  { title: "Cultivation Realm Hierarchy", category: "Page", description: "Stage-by-stage cultivation progression from Qi Condensation to 4th Step", path: "/cultivation" },
  { title: "World Lore & Ancient Races", category: "Page", description: "Read about Ancient Gods, Ancient Demons, Ancient Devils, and celestial history", path: "/lore" },
  { title: "Er Gen Multiverse Hub", category: "Page", description: "Discover connected novels and cross-universe characters", path: "/multiverse" },
  { title: "Wang Lin Story Timeline", category: "Page", description: "Chronological arc-by-arc timeline of Renegade Immortal", path: "/timeline" },
  { title: "Donghua Release & Stream Hub", category: "Page", description: "Watch episodes, track release schedules, and stream donghua", path: "/watch" },
  { title: "Artifacts & Techniques Catalog", category: "Page", description: "Browse divine treasures, soul flags, and celestial spells", path: "/artifacts" },
  { title: "Cosmic Locations & Sects", category: "Page", description: "Explore planets, star domains, and ancient tombs", path: "/locations" },
  { title: "Community Hub & Groups", category: "Page", description: "Join fan groups, post discussions, and connect with cultivators", path: "/communities" },
  { title: "News & Social Feed", category: "Page", description: "Latest announcements, YouTube recaps, and social media updates", path: "/feed" },
  { title: "Site Search Engine", category: "Search", description: "Search across all characters, daos, realms, lore, multiverse, episodes, artifacts, locations, communities, and guides", path: "/search" }
];
