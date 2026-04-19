export interface SearchResult {
  title: string;
  category: string;
  description: string;
  path: string;
}

export const searchableData: SearchResult[] = [
  // Characters - with query params for direct navigation
  { title: "Wang Lin", category: "Character", description: "The central protagonist who rises from mortal to transcendent being", path: "/characters?q=Wang+Lin" },
  { title: "Xu Mu", category: "Character", description: "Wang Lin's most famous alias — Master Demon Xu Mu, Magic Armor Xu Mu in Luotian Star Domain", path: "/characters?q=Wang+Lin" },
  { title: "Ceng Niu", category: "Character", description: "Wang Lin's alias for infiltrating medicine gardens in Luotian/Yunhai Star Domain", path: "/characters?q=Wang+Lin" },
  { title: "Ma Liang", category: "Character", description: "Wang Lin's alias after possessing a War Shrine disciple's body", path: "/characters?q=Wang+Lin" },
  { title: "Master Demon", category: "Character", description: "Wang Lin's infamous nickname earned through massacres and ruthless killing intent", path: "/characters?q=Wang+Lin" },
  { title: "Tu Si", category: "Character", description: "Supreme being of the Ancient God lineage", path: "/characters?q=Tu+Si" },
  { title: "Tou Sen", category: "Character", description: "Legendary Ancient Demon with god-origin hybrid essence", path: "/characters?q=Tou+Sen" },
  { title: "Ta Jia", category: "Character", description: "Master of the Ancient Devil ways", path: "/characters?q=Ta+Jia" },
  { title: "All-Seer", category: "Character", description: "Mysterious transcendent oracle with fate vision", path: "/characters?q=All-Seer" },
  { title: "Li Muwan", category: "Character", description: "Wang Lin's most important emotional anchor", path: "/characters?q=Li+Muwan" },
  { title: "Mu Bingmei", category: "Character", description: "Cold, prideful, and powerfully skilled cultivator", path: "/characters?q=Mu+Bingmei" },
  { title: "Situ Nan", category: "Character", description: "Chaotic mentor and rogue cultivator", path: "/characters?q=Situ+Nan" },
  { title: "Qing Shui", category: "Character", description: "Tragic powerhouse with heavy karmic weight", path: "/characters?q=Qing+Shui" },
  { title: "Su Ming", category: "Character", description: "Cross-novel essential for multiverse connections", path: "/characters?q=Su+Ming" },

  // Essences/Daos
  { title: "14 Essences of Wang Lin", category: "Dao", description: "Complete collection of Wang Lin's 14 Essences categorized as Ethereal, Corporeal, and Special", path: "/daos" },
  { title: "Ethereal Essences", category: "Dao", description: "Life/Death, Karma, True/False, Dream, Reincarnation — based on insight and life experiences", path: "/daos" },
  { title: "Corporeal Essences", category: "Dao", description: "Thunder, Fire, Water, Earth, Wood, Metal — Five Elements True Body components", path: "/daos" },
  { title: "Special Essences", category: "Dao", description: "Slaughter, Restriction, Absolute Beginning, Absolute End — powers of heaven defiance", path: "/daos" },
  { title: "Five Elements True Body", category: "Dao", description: "Fusion of Fire, Water, Earth, Wood, Metal essences representing cultivation of life", path: "/daos" },
  { title: "Slaughter True Body", category: "Dao", description: "Black Clone formed from Slaughter, Thunder, Restriction, Absolute Beginning/End essences", path: "/daos" },

  // Cultivation
  { title: "Qi Condensation", category: "Cultivation", description: "Early cultivation stage", path: "/cultivation" },
  { title: "Foundation Establishment", category: "Cultivation", description: "Building the cultivation foundation", path: "/cultivation" },
  { title: "Core Formation", category: "Cultivation", description: "Forming the golden core", path: "/cultivation" },
  { title: "Nascent Soul", category: "Cultivation", description: "Birth of the nascent soul", path: "/cultivation" },
  { title: "Spirit Severing", category: "Cultivation", description: "Severing worldly ties for power", path: "/cultivation" },
  { title: "Transcendence", category: "Cultivation", description: "The ultimate cultivation goal", path: "/cultivation" },

  // Lore
  { title: "Ancient Gods", category: "Lore", description: "Primordial race embodying order and creation", path: "/lore" },
  { title: "Ancient Demons", category: "Lore", description: "Chaotic beings respecting strength above all", path: "/lore" },
  { title: "Ancient Devils", category: "Lore", description: "Most destructive of the ancient races", path: "/lore" },
  { title: "Heaven", category: "Lore", description: "Cosmic law governing all existence", path: "/lore" },
  { title: "Tribulation", category: "Lore", description: "Heavenly test during cultivation breakthroughs", path: "/lore" },

  // Multiverse
  { title: "I Shall Seal the Heavens", category: "Multiverse", description: "Connected universe with Meng Hao", path: "/multiverse" },
  { title: "A Will Eternal", category: "Multiverse", description: "Connected universe in Er Gen's multiverse", path: "/multiverse" },
  { title: "The God", category: "Multiverse", description: "Cosmic entity — 'The God's real name is Wang Lin'", path: "/multiverse" },

  // Timeline
  { title: "The Mortal's Beginning", category: "Timeline", description: "Arc 1 — Wang Lin rises from a powerless mortal", path: "/timeline" },
  { title: "Heaven-Defying Ascension", category: "Timeline", description: "Arc 5 — Mastery of True/False and Space/Time Daos", path: "/timeline" },
  { title: "Transcendent Legends", category: "Timeline", description: "Arc 9 — Wang Lin reshapes multiple universes", path: "/timeline" },

  // Donghua
  { title: "Donghua Adaptation", category: "Donghua", description: "Chinese anime series — Episode 129 and counting", path: "/donghua" },

  // Artifacts & Techniques - with query params
  { title: "Heaven Rending Sword", category: "Artifact", description: "Ancient weapon capable of slicing through dimensions", path: "/artifacts?q=Heaven+Rending+Sword" },
  { title: "Soul Flag", category: "Artifact", description: "Wang Lin's soul-binding treasure for capturing spirits", path: "/artifacts?q=Soul+Flag" },
  { title: "Ancient God Leather Armor", category: "Artifact", description: "Armor forged from Ancient God remains", path: "/artifacts?q=Ancient+God+Leather+Armor" },
  { title: "Restriction Flag", category: "Artifact", description: "Array-type treasure for sealing and binding", path: "/artifacts?q=Restriction+Flag" },
  { title: "God Slaying Spear", category: "Artifact", description: "Legendary weapon forged to kill Ancient Gods", path: "/artifacts?q=God+Slaying+Spear" },
  { title: "Call the Wind", category: "Technique", description: "One of Wang Lin's early signature techniques", path: "/artifacts?q=Call+the+Wind" },
  { title: "Finger of Death", category: "Technique", description: "Underworld Dao-derived killing technique", path: "/artifacts?q=Finger+of+Death" },
  { title: "Life & Death Domain", category: "Technique", description: "Domain technique from Life/Death Dao mastery", path: "/artifacts?q=Life+%26+Death+Domain" },
  { title: "Karmic Severance", category: "Technique", description: "Cuts karmic ties to weaken enemies", path: "/artifacts?q=Karmic+Severance" },
  { title: "Stop", category: "Technique", description: "Wang Lin's time-stopping space/time technique", path: "/artifacts?q=Stop" },

  // Locations - with query params
  { title: "Planet Suzaku", category: "Location", description: "Wang Lin's home planet and starting point", path: "/locations?q=Planet+Suzaku" },
  { title: "Heng Yue Sect", category: "Location", description: "Wang Lin's first sect and cultivation home", path: "/locations?q=Heng+Yue+Sect" },
  { title: "Suzaku Star", category: "Location", description: "Major cultivation world in the Suzaku system", path: "/locations?q=Suzaku+Star" },
  { title: "Outer Realm", category: "Location", description: "Vast space beyond the mortal cultivation planets", path: "/locations?q=Outer+Realm" },
  { title: "Ancient God Territory", category: "Location", description: "The ancestral domain of the Ancient Gods", path: "/locations?q=Ancient+God+Territory" },
  { title: "Celestial Realm", category: "Location", description: "Higher plane where transcendent beings reside", path: "/locations?q=Celestial+Realm" },
  { title: "Allheaven", category: "Location", description: "The supreme realm governing all heavens", path: "/locations?q=Allheaven" },

  // Guide
  { title: "Beginner Guide", category: "Guide", description: "Start here — introduction to Renegade Immortal", path: "/guide" },
  { title: "Reading Order", category: "Guide", description: "Recommended order for Er Gen's novels", path: "/guide" },
  { title: "Watching Order", category: "Guide", description: "Donghua episode guide and season breakdown", path: "/guide" },
];
