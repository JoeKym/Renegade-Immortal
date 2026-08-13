export interface SearchResult {
  title: string;
  category: string;
  description: string;
  path: string;
  keywords?: string[];
}

export const searchableData: SearchResult[] = [
  // Characters - with query params for direct navigation
  { title: "Wang Lin", category: "Character", description: "The central protagonist who rises from mortal to transcendent being", path: "/characters?q=Wang+Lin" },
  { title: "Xu Mu", category: "Character", description: "Wang Lin's most famous alias — Master Demon Xu Mu, Magic Armor Xu Mu in Luotian Star Domain", path: "/characters?q=Wang+Lin" },
  { title: "Ceng Niu", category: "Character", description: "Wang Lin's alias for infiltrating medicine gardens in Luotian/Yunhai Star Domain", path: "/characters?q=Wang+Lin" },
  { title: "Ma Liang", category: "Character", description: "Wang Lin's alias after possessing a War Shrine disciple's body", path: "/characters?q=Wang+Lin" },
  { title: "Master Demon", category: "Character", description: "Wang Lin's infamous nickname earned through massacres and ruthless killing intent", path: "/characters?q=Wang+Lin" },
  { title: "Tu Si", category: "Character", description: "Supreme being of the Ancient God lineage", path: "/characters?q=Tu+Si" },
  { title: "Tou Sen", category: "Character", description: "Legendary Ancient Demon with god-origin hybrid essence", path: "/characters?q=Tou+Sen", keywords: ["Ancient Demon", "Tu Si inner devil", "Tuo Sen"] },
  { title: "Bei Luo", category: "Character", description: "Ancient Demon commander of Sky Demon Country who allies with Wang Lin and seeks to regain his ancient power", path: "/characters?q=Bei+Luo", keywords: ["Ancient Demon", "BeiLuo", "Bei Luo", "Sky Demon Country", "Royal Ancient Demon", "Soul fragment"] },
  { title: "Ta Jia", category: "Character", description: "Master of the Ancient Devil ways", path: "/characters?q=Ta+Jia", keywords: ["Ancient Devil", "devil arts"] },
  { title: "Teng Huayuan", category: "Character", description: "Patriarch of Teng Clan — catalyst for Wang Lin's revenge. Massacred Wang Lin's family, later faced tower of heads retribution", path: "/characters?q=Teng+Huayuan" },
  { title: "All-Seer", category: "Character", description: "Tian Yunzi — Purple Fragment of Three Souls Seven Fragments. Wang Lin's most persistent enemy who manipulated disciples to devour them", path: "/characters?q=All-Seer" },
  { title: "Liu Mei", category: "Character", description: "Indigo Fragment of love and hate. Early rival who sought to use Wang Lin for Dao of Heartless Love", path: "/characters?q=Liu+Mei" },
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
  { title: "Heaven Rending Sword", category: "Artifact", description: "Ancient weapon capable of slicing through dimensions", path: "/artifacts?q=Heaven+Rending+Sword", keywords: ["dimension sword", "space cut", "ancient weapon"] },
  { title: "Soul Flag", category: "Artifact", description: "Wang Lin's soul-binding treasure for capturing spirits", path: "/artifacts?q=Soul+Flag", keywords: ["soul flag", "soul binding", "spirit army", "underworld artifact"] },
  { title: "Ancient God Leather Armor", category: "Artifact", description: "Armor forged from Ancient God remains", path: "/artifacts?q=Ancient+God+Leather+Armor", keywords: ["ancient god armor", "god body armor", "leather armor"] },
  { title: "Restriction Flag", category: "Artifact", description: "Array-type treasure for sealing and binding", path: "/artifacts?q=Restriction+Flag", keywords: ["restriction flag", "seal array", "binding treasure"] },
  { title: "God Slaying Spear", category: "Artifact", description: "Legendary weapon forged to kill Ancient Gods", path: "/artifacts?q=God+Slaying+Spear", keywords: ["god slaying spear", "ancient god killer", "spear weapon"] },
  { title: "Heaven-Avoiding Coffin", category: "Artifact", description: "A coffin-like relic used to preserve and resurrect Li Muwan", path: "/artifacts?q=Heaven-Avoiding+Coffin", keywords: ["heaven avoiding coffin", "li muwan coffin", "resurrection coffin"] },
  { title: "Heaven-Defying Bead", category: "Artifact", description: "The key treasure tied to Wang Lin's early cultivation and true Dao awakening", path: "/artifacts?q=Heaven-Defying+Bead", keywords: ["heaven defying bead", "tian ni pearl", "dream space bead", "bead treasure"] },
  { title: "Soul-Nurturing Jade", category: "Artifact", description: "A soul-protective jade that stabilizes Li Muwan's lingering spirit", path: "/artifacts?q=Soul-Nurturing+Jade", keywords: ["soul nurturing jade", "zhou ru jade", "spirit protection artifact"] },
  { title: "Call the Wind", category: "Technique", description: "One of Wang Lin's early signature techniques", path: "/artifacts?q=Call+the+Wind", keywords: ["call the wind", "wind attack", "celestial spell"] },
  { title: "Finger of Death", category: "Technique", description: "Underworld Dao-derived killing technique", path: "/artifacts?q=Finger+of+Death", keywords: ["finger of death", "underworld river", "death finger"] },
  { title: "Life & Death Domain", category: "Technique", description: "Domain technique from Life/Death Dao mastery", path: "/artifacts?q=Life+%26+Death+Domain", keywords: ["life and death domain", "death domain", "life death dao"] },
  { title: "Karmic Severance", category: "Technique", description: "Cuts karmic ties to weaken enemies", path: "/artifacts?q=Karmic+Severance", keywords: ["karmic severance", "karma severance", "fate cut"] },
  { title: "Underworld Ascension Method", category: "Technique", description: "A foundational method for entering the Underworld Dao and transcending reincarnation", path: "/artifacts?q=Underworld+Ascension+Method", keywords: ["underworld ascension", "underworld method", "situ nan technique", "reincarnation method"] },
  { title: "Stop", category: "Technique", description: "Wang Lin's time-stopping space/time technique", path: "/artifacts?q=Stop", keywords: ["stop technique", "time freeze", "space time stop"] },
  { title: "Absolute Restriction Control", category: "Technique", description: "Advanced restriction technique used to bind and suppress enemies", path: "/artifacts?q=Absolute+Restriction+Control", keywords: ["absolute restriction", "restriction control", "seal technique"] },
  { title: "Palm of Heaven & Earth", category: "Technique", description: "Outer Realm technique manifesting battlefield-scale heaven and earth pressure", path: "/artifacts?q=Palm+of+Heaven+%26+Earth", keywords: ["palm of heaven and earth", "outer realm palm", "heaven earth technique"] },
  { title: "Sealing Extermination Spells", category: "Technique", description: "Dao-based sealed extermination methods used in advanced Third Step combat", path: "/artifacts?q=Sealing+Extermination+Spells", keywords: ["sealing extermination", "extermination spells", "third step seal magic"] },
  { title: "Five Elements Origin Laws", category: "Technique", description: "A refined law-driven Five Elements technique used in True Body combat", path: "/artifacts?q=Five+Elements+Origin+Laws", keywords: ["five elements origin law", "origin laws", "elemental law technique"] },
  { title: "Third Step Dao Manifestation", category: "Technique", description: "Manifestation of Dao power in the world through the Third Step", path: "/artifacts?q=Third+Step+Dao+Manifestation", keywords: ["dao manifestation", "third step dao", "manifested dao"] },

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
  { title: "Characters", category: "Page", description: "Browse the full character compendium", path: "/characters", keywords: ["character index", "heroes", "villains"] },
  { title: "Artifacts", category: "Page", description: "Browse artifacts, treasures, and techniques", path: "/artifacts", keywords: ["treasures", "techniques", "equipment"] },
  { title: "Daos", category: "Page", description: "Explore the Daos, essences, and cultivation powers", path: "/daos", keywords: ["essences", "cultivation", "powers"] },
  { title: "Look up daos", category: "Page", description: "Explore the Daos, essences, and cultivation powers", path: "/daos", keywords: ["essences", "cultivation", "powers"] },
  { title: "Lore", category: "Page", description: "Learn about worldbuilding, races, and history", path: "/lore", keywords: ["world lore", "history", "ancient races"] },
  { title: "Locations", category: "Page", description: "Explore the planets, realms, and key story locations", path: "/locations", keywords: ["world map", "realms", "places"] },
  { title: "Watch", category: "Page", description: "Watch the donghua adaptation and episode guide", path: "/watch", keywords: ["anime", "donghua", "series"] },
  { title: "Multiverse", category: "Page", description: "Discover the multiverse connections across Er Gen's works", path: "/multiverse", keywords: ["parallel worlds", "crossover", "shared universe"] },
  { title: "Timeline", category: "Page", description: "View Wang Lin's story progression and major arcs", path: "/timeline", keywords: ["story arc", "timeline", "story path"] },
  { title: "About", category: "Page", description: "Learn about the website and Renegade Immortal project", path: "/about", keywords: ["about", "project info", "website"] },
  { title: "Support", category: "Page", description: "Contact support and get help with the site", path: "/support", keywords: ["help", "support", "contact"] },
  { title: "Contact", category: "Page", description: "Send a message to the site team", path: "/contact", keywords: ["contact", "email", "support"] },
  { title: "Privacy Policy", category: "Page", description: "Review the website's privacy and data policies", path: "/privacy", keywords: ["privacy", "data", "policy"] },
  { title: "Terms of Service", category: "Page", description: "Review the website's terms and rules", path: "/terms", keywords: ["terms", "service", "rules"] },
  { title: "Profile", category: "Page", description: "View and edit your user profile", path: "/profile", keywords: ["account", "profile", "settings"] },
  { title: "Settings", category: "Page", description: "Manage your website preferences and account", path: "/settings", keywords: ["preferences", "account", "settings"] },
  { title: "Messages", category: "Page", description: "Read and send messages", path: "/messages", keywords: ["chat", "messages", "inbox"] },
  { title: "Communities", category: "Page", description: "Browse groups and community discussions", path: "/communities", keywords: ["groups", "communities", "forums"] },
  { title: "Feed", category: "Page", description: "Browse the latest updates and posts", path: "/feed", keywords: ["feed", "updates", "news"] },
  { title: "Admin", category: "Page", description: "Admin dashboard and analytics tools", path: "/admin", keywords: ["admin", "dashboard", "analytics"] },
];
