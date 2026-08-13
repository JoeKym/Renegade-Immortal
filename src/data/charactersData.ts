import wangLinImg from "@/assets/wang-lin.jpg";
import liMuwanImg from "@/assets/li-muwan.jpg";
import situNanImg from "@/assets/situ-nan.jpg";
import liuMeiImg from "@/assets/liu-mei-new.jpg";
import tuoSenImg from "@/assets/tuo-sen.jpg";
import muBingmeiImg from "@/assets/mu-bingmei.jpg";
import allSeerImg from "@/assets/all-seer.jpg";
import tengHuayuanImg from "@/assets/teng-huayuan-new.jpg";
import tuSiImg from "@/assets/tu-si.jpg";
import zhouRuImg from "@/assets/zhou-ru-new.jpg";
import bloodAncestorImg from "@/assets/blood-ancestor.jpg";
import qingShuiImg from "@/assets/qing-shui.jpg";
import hongShanImg from "@/assets/hong-shan.jpg";
import redButterflyImg from "@/assets/red-butterfly.jpg";
import taJiaImg from "@/assets/ta-jia.jpg";
import taShanImg from "@/assets/ta-shan.jpg";
import beiLuoImg from "@/assets/bei-luo.jpg";
import zhouYiImg from "@/assets/zhou-yi.jpg";
import wangZhouImg from "@/assets/wang-zhou.jpg";
import wangLinParentsImg from "@/assets/wang-lin-parents.jpg";
import duTianImg from "@/assets/du-tian.jpg";
import baiFanImg from "@/assets/bai-fan.jpg";
import chiHuImg from "@/assets/chi-hu.jpg";
import zhouWutaiImg from "@/assets/zhou-wutai.jpg";
import qiuSipingImg from "@/assets/qiu-siping.jpg";
import xuLiguoImg from "@/assets/xu-liguo.jpg";
import thirteenImg from "@/assets/thirteen.jpg";
import sunDazhuImg from "@/assets/sun-dazhu.jpg";
import maLiangImg from "@/assets/ma-liang.jpg";
import lingTianhouImg from "@/assets/ling-tianhou.jpg";
import mosquitoBeastImg from "@/assets/mosquito-beast.jpg";
import thunderToadImg from "@/assets/thunder-toad.jpg";

const characterImg = wangLinImg;

export interface Character {
  name: string;
  race: string; // Human, Ancient God, Ancient Demon, Ancient Devil, Spirit Beast, etc.
  alignment: "Protagonist" | "Ally" | "Rival" | "Antagonist" | "Family" | "Master" | "Disciple" | "Servant";
  subtitle: string;
  description: string;
  tags: string[];
  alias?: string;
  nicknames?: string[];
  titles?: string[];
  sect?: string;
  sectsLed?: string[];
  planetaryAuthority?: string[];
  nationalRoles?: string[];
  master?: string;
  disciples?: string[];
  disciplesDetails?: {
    name: string;
    relationship: string;
    description: string;
    status: string;
  }[];
  enemies?: string[];
  status?: string;
  firstAppearance?: string;
  techniques?: string[];
  artifacts?: string[];
  majorBattles?: string[];
  bloodline?: string;
  cultivationRealm?: string;
  dao?: string[];
  image?: string;
  quotes?: string[];
}

const rawCharacters: Character[] = [
  // ── PROTAGONIST ──
  {
    name: "Wang Lin",
    race: "Human / Ancient Clan",
    alignment: "Protagonist",
    subtitle: "Protagonist • Defier of Heavens",
    description: "Born as an ordinary youth in the Country of Zhao with mediocre talent. Driven by relentless will, tragedy, and blood, he rises through the cultivation realms, ultimately transcending the heavens as a 27-Star Ancient God and reaching Heaven Trampling Stage.",
    tags: ["14 Essences", "27-Star Ancient God", "Heaven Trampling Realm", "Defies the Heavens"],
    alias: "Ceng Niu, Xu Mu, Ma Liang, Lü Zihao, Tie Zhu",
    nicknames: ["Master Demon (魔头)", "Pockmarked Wang", "Calamity Star", "White-Haired Empyrean"],
    titles: ["Lord of the Sealed Realm", "Holy Emperor of Four Divine Sect", "God of the Cave World"],
    sect: "Heng Yue Sect (former), Cloud Sky Sect, Soul Refining Sect, Four Divine Sect",
    master: "Situ Nan, Dun Tian, Qing Lin, Xuan Luo",
    enemies: ["Teng Huayuan", "All-Seer", "Tuo Sen", "Seven Colored Sovereign", "Heaven"],
    status: "Alive — Transcendent (Fourth Step / Heaven Trampling)",
    firstAppearance: "Chapter 1",
    techniques: ["Call the Wind", "Summon the Rain", "Stop", "Underworld Ascension Method", "Karmic Severance", "Ji Realm"],
    artifacts: ["Heaven Defying Bead", "Soul Flag", "Heaven Rending Sword", "Third Eye"],
    cultivationRealm: "Fourth Step (Heaven Trampling)",
    dao: ["Life/Death", "Karma", "True/False", "Dream", "Reincarnation", "Thunder", "Fire", "Slaughter"],
    image: wangLinImg,
  },

  // ── FAMILY & CORE LOVE INTERESTS ──
  {
    name: "Li Muwan",
    race: "Human",
    alignment: "Family",
    subtitle: "Wang Lin's Beloved Wife",
    description: "A gentle and talented pill master from the Cloud Sky Sect. She is Wang Lin's true love. After her premature death, Wang Lin spends centuries fighting heaven and earth to preserve her soul and resurrect her.",
    tags: ["True Love", "Pill Refining Master", "Emotional Core"],
    alias: "Wan'er",
    status: "Alive — Resurrected by Wang Lin",
    cultivationRealm: "Soul Transformation / Resurrected Immortality",
    sect: "Cloud Sky Sect",
    image: liMuwanImg,
  },
  {
    name: "Li Qianmei",
    race: "Human",
    alignment: "Ally",
    subtitle: "Dream Dao Master's Daughter • Devoted Love",
    description: "Daughter of Dao Master Blue Dream. She fell deeply in love with Wang Lin and gave up her soul blood to keep him alive when he was mortally injured, stroking his hair for ten years in total silence.",
    tags: ["Unrequited Sacrifice", "Soul Blood", "Dream Dao"],
    status: "Alive",
    cultivationRealm: "Third Step (Nirvana Shatterer / Heavenly Exalt)",
    image: characterImg,
  },
  {
    name: "Wang Ping",
    race: "Human",
    alignment: "Family",
    subtitle: "Wang Lin's Mortal Son",
    description: "Wang Lin's son, born during his mortal life with Liu Mei/Mu Bingmei's avatar. Wang Lin refused to let him cultivate, granting him a peaceful, ordinary mortal life filled with fatherly love to comprehend the Dao of Life and Death.",
    tags: ["Mortal Son", "Dao Catalyst", "Emotional Peak"],
    status: "Deceased (Died peacefully of old age as a mortal)",
    cultivationRealm: "Mortal (Forbidden to cultivate by Wang Lin)",
    image: characterImg,
  },
  {
    name: "Wang Lin's Parents",
    race: "Human",
    alignment: "Family",
    subtitle: "Wang Lin's Parents",
    description: "Simple, loving mortals from a small village in the Country of Zhao. Their brutal murder at the hands of Teng Huayuan triggered Wang Lin's descent into merciless revenge.",
    tags: ["Mortal Origins", "Tragic Motivation"],
    status: "Deceased — Murdered by Teng Huayuan",
    cultivationRealm: "Mortal",
    image: wangLinParentsImg,
  },

  // ── MASTERS & MENTORS ──
  {
    name: "Situ Nan",
    race: "Human",
    alignment: "Master",
    subtitle: "Rogue Mentor • Former Owner of Heaven Defying Bead",
    description: "A arrogant, fun-loving, perverted supreme cultivator who lived inside the Heaven Defying Bead as a soul fragment. He taught Wang Lin the basics of survival and cultivation in his early years.",
    tags: ["Bead Spirit", "Chaos Energy", "Loyal Mentor"],
    alias: "Old Ghost Situ",
    status: "Alive",
    cultivationRealm: "Third Step (Nirvana Void / Imperial King)",
    image: situNanImg,
  },
  {
    name: "Dun Tian",
    race: "Human",
    alignment: "Master",
    subtitle: "Soul Refining Sect Ancestor",
    description: "The visionary ancestor of the Soul Refining Sect who recognized Wang Lin's potential. He treated Wang Lin as his true successor, bestowing upon him the One-Billion-Soul Flag before sacrificing himself.",
    tags: ["Soul Refining Sect", "Selfless Master", "Soul Flag"],
    status: "Deceased (Sacrificed for the Sect)",
    cultivationRealm: "Soul Transformation",
    image: duTianImg,
  },
  {
    name: "Xuan Luo",
    race: "Ancient Clan",
    alignment: "Master",
    subtitle: "Grand Empyrean of the Ancient Dao",
    description: "One of the Sun-level Grand Empyreans of the Immortal Astral Continent. He treated Wang Lin with genuine warmth, becoming his true master in the upper realm and protecting him against cosmic forces.",
    tags: ["Grand Empyrean", "Ancient Dao", "Revered Master"],
    status: "Alive",
    cultivationRealm: "Third Step Peak (Grand Empyrean)",
    image: characterImg,
  },
  {
    name: "Qing Lin",
    race: "Human",
    alignment: "Master",
    subtitle: "Lord of the Rain Celestial Realm",
    description: "An ancient supreme expert of the Alliance System and master of the Rain Celestial Realm. He offered guidance and authority to Wang Lin during the celestial star domain wars.",
    tags: ["Rain Celestial Realm", "Supreme Authority"],
    status: "Alive",
    cultivationRealm: "Third Step",
    image: characterImg,
  },

  // ── CLOSE BROTHERS & ALLIES ──
  {
    name: "Qing Shui",
    race: "Human",
    alignment: "Ally",
    subtitle: "White-Haired Senior Brother • Celestial Powerhouse",
    description: "Wang Lin's senior brother under Bai Fan. Famous for his ruthless killing aura and madness, he holds immense affection for Wang Lin and acts as one of his strongest guardians.",
    tags: ["Senior Brother", "Ji Realm / Celestial", "Slaughter"],
    status: "Alive",
    cultivationRealm: "Third Step (Nirvana Cleanser / Shatterer)",
    image: qingShuiImg,
  },
  {
    name: "Chi Hu",
    race: "Human",
    alignment: "Ally",
    subtitle: "Giant Demon Clan Cultivator",
    description: "A staunch, honorable brother-in-arms from the Giant Demon Clan who explored ancient ruins with Wang Lin during his middle cultivation years.",
    tags: ["Brotherhood", "Giant Demon Clan"],
    status: "Alive",
    cultivationRealm: "Soul Transformation",
    image: chiHuImg,
  },

  // ── MAJOR ANTAGONISTS & RIVALS ──
  {
    name: "All-Seer",
    race: "Human / Compass Spirit",
    alignment: "Antagonist",
    subtitle: "Tian Yunzi • Master of Schemes",
    description: "Master of the Heavenly Fate Sect and the primary mastermind behind Wang Lin's destiny in the Cave World. He is actually the Treasure Spirit of the Boundary-Defining Compass, taking multiple avatars.",
    tags: ["Schemer", "Fate Manipulation", "Grand Antagonist"],
    alias: "Tian Yunzi",
    status: "Deceased / Integrated",
    cultivationRealm: "Third Step Peak",
    image: allSeerImg,
  },
  {
    name: "Teng Huayuan",
    race: "Human",
    alignment: "Antagonist",
    subtitle: "Teng Clan Patriarch • Early Arch-Enemy",
    description: "The ruthless patriarch who slaughtered Wang Lin's entire family. His actions sparked Wang Lin's path of blood, leading to the total extermination of the Teng bloodline.",
    tags: ["Revenge Catalyst", "Teng Clan"],
    status: "Deceased — Executed by Wang Lin",
    cultivationRealm: "Nascent Soul",
    image: tengHuayuanImg,
  },
  {
    name: "Tuo Sen",
    race: "Ancient God",
    alignment: "Antagonist",
    subtitle: "Tu Si's Inner Devil",
    description: "The violent inner devil born from the Ancient God Tu Si. He inherited Tu Si's physical strength and spent thousands of years hunting Wang Lin to regain the memory inheritance.",
    tags: ["Ancient God", "Inner Devil", "Raw Power"],
    status: "Alive (Reconciled with Wang Lin)",
    cultivationRealm: "8-Star / 9-Star Ancient God",
    image: tuoSenImg,
  },
  {
    name: "Red Butterfly (Hong Die)",
    race: "Human",
    alignment: "Rival",
    subtitle: "Suzaku Sect Pride",
    description: "An extraordinarily arrogant genius of Planet Suzaku. She looked down on Wang Lin, leading to a bitter feud where Wang Lin eventually severed her arm and defeated her.",
    tags: ["Geniuses Feud", "Planet Suzaku"],
    status: "Deceased",
    cultivationRealm: "Soul Formation",
    image: redButterflyImg,
  },

  // ── SERVANTS & PETS ──
  {
    name: "Xu Liguo",
    race: "Ghost / Sword Spirit",
    alignment: "Servant",
    subtitle: "Cowardly Sword Spirit",
    description: "A shameless, treacherous, and cowardly ghost cultivator refined by Wang Lin into a sword spirit. His comedic sycophancy and reluctance to fight make him a fan favourite.",
    tags: ["Comic Relief", "Sword Spirit", "Sycophant"],
    status: "Alive",
    cultivationRealm: "High-tier Sword Spirit",
    image: xuLiguoImg,
  },
  {
    name: "Mosquito Beast",
    race: "Spirit Beast",
    alignment: "Servant",
    subtitle: "Ancient Devouring Creature",
    description: "An ancient insect spirit beast tamed by Wang Lin. It possesses an insatiable appetite for blood and cultivation bases, evolving alongside Wang Lin into a terrifying threat.",
    tags: ["Ancient Beast", "Devourer", "Loyal Companion"],
    status: "Alive",
    cultivationRealm: "Third Step Equivalent",
    image: mosquitoBeastImg,
  }
];

export const characters: Character[] = rawCharacters.map((character) => ({
  ...character,
  image: character.image ?? characterImg,
}));

export const races = [
  "All Races", 
  "Human", 
  "Ancient Clan", 
  "Ancient God", 
  "Ancient Demon", 
  "Ancient Devil", 
  "Spirit Beast", 
  "Ghost / Sword Spirit"
];

export const alignments = [
  "All Roles", 
  "Protagonist", 
  "Ally", 
  "Rival", 
  "Antagonist", 
  "Family", 
  "Master", 
  "Disciple", 
  "Servant"
];