import wangLinImg from "@/assets/wang-lin.jpg";
import liMuwanImg from "@/assets/li-muwan.jpg";
import profileImg from "@/assets/profileImg.jpg";
import duanmuJiImg from "@/assets/duanmu-ji.jpg";
import situNanImg from "@/assets/situ-nan.jpg";
import shenGongHuImg from "@/assets/shengong-hu.jpg";
import zhanKonglieImg from "@/assets/zhan-konglie.jpg";
import hornedThunderbeastImg from "@/assets/thunder-beast.jpg";
import demonEmperorGuYundunImg from "@/assets/gu-yundun.jpg";
import tangYanFengImg from "@/assets/tang-yanfeng.jpg";
import liuMeiImg from "@/assets/liu-mei-new.jpg";
import wangPingImg from "@/assets/wang-ping.jpg";
import tuoSenImg from "@/assets/tuo-sen.jpg";
import liYaunImg from "@/assets/li-yuan.jpg";
import muBingmeiImg from "@/assets/mu-bingmei.jpg";
import allSeerImg from "@/assets/all-seer.jpg";
import tengHuayuanImg from "@/assets/teng-huayuan-new.jpg";
import tuSiImg from "@/assets/tu-si.jpg";
import duJianImg from "@/assets/du-jian.jpg";
import zhouRuImg from "@/assets/zhou-ru-new.jpg";
import bloodAncestorImg from "@/assets/blood-ancestor.jpg";
import qingShuiImg from "@/assets/qing-shui.jpg";
import hongShanImg from "@/assets/hong-shan.jpg";
import redButterflyImg from "@/assets/red-butterfly.jpg";
import taJiaImg from "@/assets/ta-jia.jpg";
import liQianmeiImg from "@/assets/li-qianmei.jpg";
import moZhiImg from "@/assets/mo-zhi.jpg";
import yunqueZiImg from "@/assets/yun-quezi.jpg";
import taShanImg from "@/assets/profileImg.jpg";
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
import zhuQueziImg from "@/assets/zhu-quezi.jpg";
import sunDazhuImg from "@/assets/sun-dazhu.jpg";
import maLiangImg from "@/assets/ma-liang.jpg";
import lingTianhouImg from "@/assets/ling-tianhou.jpg";
import mosquitoBeastImg from "@/assets/mosquito-beast.jpg";
import thunderToadImg from "@/assets/thunder-toad.jpg";
import suMingImg from "@/assets/su-ming.jpg";
import yanLeiziImg from "@/assets/yan-leizi.jpg";

export interface Character {
  name: string;
  race: string;
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
    description: "Born with a weak body and mediocre talent in Zhao, Wang Lin rises through endless tragic sacrifices to become a transcendent being beyond heaven. He eventually attains 27 stars across Ancient God, Demon, and Devil paths, stepping onto the 4th Step of Heaven Trampling.",
    tags: ["14 Essences", "27-Star Dao Ancient God", "Heaven Trampling Realm", "Defies the Heavens"],
    alias: "Ma Liang, Ceng Niu, Xu Mu, Lü Zihao, Tie Zhu, Qing Mu, Na Du",
    nicknames: ["Master Demon (魔头)", "Pockmarked Wang (王麻子)", "Black Hearted King", "Calamity Star (煞星)", "White-Haired Empyrean"],
    titles: ["The God", "Lord of the Sealed Realm", "Holy Emperor of Four Divine Sect"],
    sect: "Heng Yue Sect (former), Cloud Sky Sect, Soul Refining Sect, Four Divine Sect",
    sectsLed: [
      "Soul Refining Sect — Sect Master",
      "Cloud Sky Sect — Sect Master on Planet Suzaku",
      "Origin Sect — Ancestor in Allheaven Star System",
      "Fighting Evil Sect — Master",
      "Four Divine Sect — Holy Emperor & Supreme Leader",
      "Seven Dao Sect — Founded New Seven Color Sect"
    ],
    planetaryAuthority: [
      "Planet Suzaku — Guardian and protector",
      "Planet Ran Yun — Supreme Ancestor",
      "Planet Qing Lin — Master",
      "The Sealed Realm — Lord of the Sealed Realm"
    ],
    nationalRoles: [
      "Country of Zhao — Ancestor",
      "Great Wang Dynasty — Founder",
      "Fallen Land — Young Emperor",
      "Ancient Dao — Guardian"
    ],
    master: "Situ Nan, Dun Tian, Tu Si (inheritance), Qing Lin, Xuan Luo",
    disciples: ["Thirteen (Shi San)", "Xie Qing", "Xi Zi Feng", "Zhou Ru", "Tie Yan", "Lian Daofei", "Du Jian"],
    enemies: ["Teng Huayuan", "All-Seer", "Tuo Sen", "Ling Tianhou", "Seven Colored Sovereign", "Heaven itself"],
    status: "Alive — Transcendent (Fourth Step / Heaven Trampling)",
    firstAppearance: "Chapter 1",
    techniques: ["Call the Wind", "Summon the Rain", "Finger of Death", "Stop", "Life & Death Domain", "Karmic Severance", "Underworld Ascension Method", "Ji Realm"],
    artifacts: ["Soul Flag", "Restriction Flag", "Heaven Rending Sword", "Ancient God Leather Armor", "Heaven Defying Bead", "Heaven-Avoiding Coffin"],
    majorBattles: ["vs. Teng Clan (extermination)", "vs. All-Seer", "vs. Tuo Sen", "vs. Ling Tianhou", "vs. Seven Colored Sovereign"],
    bloodline: "Human → 27-Star Dao Ancient God (Ancient God, Demon, Devil)",
    cultivationRealm: "Fourth Step / Heaven Trampling",
    dao: ["Life/Death", "Karma", "True/False", "Dream", "Reincarnation", "Thunder", "Fire", "Water", "Earth", "Wood", "Metal", "Slaughter", "Restriction", "Absolute Beginning", "Absolute End"],
    image: wangLinImg,
    disciplesDetails: [
      {
        name: "Thirteen (Shi San)",
        relationship: "Primary Disciple — Most Loyal",
        description: "A youth from the Forsaken Immortal Tribe taken in by Wang Lin.",
        status: "Devoted disciple"
      },
      {
        name: "Xie Qing",
        relationship: "Primary Disciple — Talented",
        description: "A talented disciple who received guidance in the Allheaven Star System.",
        status: "Active disciple"
      },
      {
        name: "Xi Zi Feng",
        relationship: "Primary Disciple — Female",
        description: "A female disciple who harbored deep unrequited feelings for Wang Lin.",
        status: "Disciple with unrequited love"
      },
      {
        name: "Zhou Ru",
        relationship: "Protected Junior / Disciple",
        description: "Tied to Li Muwan's soul fragment, raised under Wang Lin's protection.",
        status: "Protected disciple"
      },
      {
        name: "Du Jian",
        relationship: "First Immortal Guard",
        description: "Cultivator refined into a puppet guard who gave his life protecting Wang Ping.",
        status: "Deceased (Self-exploded to allow Wang Lin's escape)"
      }
    ],
    quotes: [
      "I, Wang Lin, will pay back ten times the grievances I have suffered!",
      "Heaven will not give me a way, I will find my own way!",
      "My life is not in heaven, but in myself!"
    ]
  },

  // ── FAMILY & CORE LOVES ──
  {
    name: "Wang Lin's Parents",
    race: "Human",
    alignment: "Family",
    subtitle: "Mortal • Wang Lin's Parents",
    description: "Wang Lin's humble parents from a small village in Zhao. Their brutal murder at Teng Huayuan's hands serves as Wang Lin's deepest trauma and catalyst for revenge.",
    tags: ["Emotional Anchor", "Mortal Origins", "Tragic Loss"],
    image: wangLinParentsImg,
    status: "Deceased — Murdered by Teng Huayuan's forces",
    cultivationRealm: "None (Mortal)",
    firstAppearance: "Chapter 1",
  },
  {
    name: "Wang Zhou",
    race: "Human",
    alignment: "Family",
    subtitle: "Mortal • Wang Lin's Cousin",
    description: "Wang Lin's cousin who was originally accepted into the Heng Yue Sect due to superior early talent.",
    tags: ["Wang Family", "Heng Yue Sect", "Early Arc"],
    image: wangZhouImg,
    status: "Active",
    cultivationRealm: "Foundation Establishment",
    firstAppearance: "Chapter 1",
  },
  {
    name: "Wang Ping",
    race: "Human",
    alignment: "Family",
    subtitle: "Wang Lin's Mortal Son",
    description: "Wang Lin's son, born during his mortal life with Liu Mei/Mu Bingmei's avatar. Wang Lin refused to allow him to cultivate, giving him a peaceful, full mortal life so Wang Lin could comprehend the true Dao of Life and Death.",
    tags: ["Mortal Son", "Dao Catalyst", "Life & Death Dao"],
    status: "Deceased (Died of old age as a mortal)",
    cultivationRealm: "Mortal (Forbidden to cultivate)",
    image: wangPingImg
  },
  {
    name: "Li Muwan",
    race: "Human",
    alignment: "Family",
    subtitle: "Wang Lin's Beloved Wife",
    description: "Wang Lin's true love and wife. A gentle pill refiner from Cloud Sky Sect. Her death from lifespan limits drives Wang Lin through centuries of defiance against heaven to revive her.",
    tags: ["Emotional Anchor", "Pill Refining", "True Love"],
    alias: "Wan Er",
    status: "Alive — Resurrected by Wang Lin at the end",
    cultivationRealm: "Nascent Soul → Resurrected Immortality",
    firstAppearance: "Book 2",
    sect: "Cloud Sky Sect (Sect Master)",
    master: "Zhou Lin",
    techniques: ["Pill Refining", "Formation Arrays"],
    enemies: ["Sun Zhenwei"],
    image: liMuwanImg,
  },
  {
  name: "Zhou Ru",
  race: "Human",
  alignment: "Family",
  subtitle: "Soul Vessel of Li Muwan • Protected Junior",
  description: "A gentle girl born on Planet Suzaku who housed Li Muwan's soul fragment. Raised and guarded by Wang Lin with immense warmth, she represents one of the few pure, untainted bonds in his ruthless journey.",
  tags: ["Li Muwan Soul Vessel", "Protected Junior", "Emotional Anchor", "Planet Suzaku"],
  alias: "Little Ru'er",
  status: "Alive",
  cultivationRealm: "Core Formation / Nascent Soul",
  master: "Wang Lin (Guardian & Mentor)",
  firstAppearance: "Book 3",
  techniques: ["Nurturing Spirit Spells", "Basic Cloud Sky Pill Arts"],
  artifacts: ["Soul-Nurturing Jade", "Wang Lin's Protective Restriction Talismans"],
  image: zhouRuImg, // Import your zhou-ru-new.jpg asset
},
 {
    name: "Li Qianmei",
    race: "Human",
    alignment: "Ally",
    subtitle: "Dream Dao Master's Daughter",
    description: "Daughter of Dao Master Blue Dream. She fell deeply in love with Wang Lin and sacrificed her soul blood to keep him alive when he was mortally wounded, stroking his hair in silence for ten years.",
    tags: ["Dream Dao", "Soul Blood Sacrifice", "Unrequited Love"],
    alias: "Li Qian Mei",
    status: "Alive",
    cultivationRealm: "Third Step (Nirvana Shatterer / Heavenly Exalt)",
    image: liQianmeiImg,
  },

  // ── MASTERS & MENTORS ──
  {
    name: "Situ Nan",
    race: "Human",
    alignment: "Master",
    subtitle: "Rogue Mentor • Former Bead Owner",
    description: "A free-spirited, lecherous expert who lived inside the Heaven Defying Bead. He taught Wang Lin the Underworld Ascension Method and guided his early survival.",
    tags: ["Mentorship", "Chaos Energy", "Heaven Defying Bead"],
    alias: "Old Ghost Situ",
    status: "Alive",
    cultivationRealm: "Third Step (Nirvana Void)",
    techniques: ["Underworld Ascension Method"],
    artifacts: ["Heaven Defying Bead (former)"],
    firstAppearance: "Book 1",
    image: situNanImg,
  },
  {
    name: "Dun Tian",
    race: "Human",
    alignment: "Master",
    subtitle: "Soul Refining Sect Ancestor",
    description: "The selfless ancestor of the Soul Refining Sect who recognized Wang Lin's potential, treated him as his true successor, and passed down the One-Billion-Soul Flag before sacrificing himself.",
    tags: ["Soul Refining Sect", "Selfless Master", "Soul Flag"],
    status: "Deceased (Sacrificed for the Sect)",
    cultivationRealm: "Soul Transformation",
    image: duTianImg,
  },
  {
    name: "Xuan Luo",
    race: "Ancient Clan",
    alignment: "Master",
    subtitle: "Grand Empyrean of Ancient Dao",
    description: "One of the Sun-level Grand Empyreans of the Immortal Astral Continent. He treated Wang Lin with genuine warmth, serving as his master in the upper realm.",
    tags: ["Grand Empyrean", "Ancient Dao", "Revered Master"],
    status: "Alive",
    cultivationRealm: "Third Step Peak (Grand Empyrean)",
  },
  {
    name: "Bai Fan",
    race: "Human",
    alignment: "Master",
    subtitle: "Celestial Master of Restrictions",
    description: "A legendary celestial master whose residual teachings provided Wang Lin with foundational understanding of ancient restrictions and rain celestial arts.",
    tags: ["Formations", "Restrictions", "Celestial Master"],
    status: "Deceased",
    cultivationRealm: "Third Step",
    image: baiFanImg,
  },
  {
    name: "Qing Lin",
    race: "Human",
    alignment: "Master",
    subtitle: "Lord of Rain Celestial Realm",
    description: "Supreme figure of the Rain Celestial Realm and leader in the Sealed Realm who offered authority and support to Wang Lin.",
    tags: ["Rain Celestial Realm", "Sealed Realm Leader"],
    status: "Active",
    cultivationRealm: "Third Step (Nirvana Shatterer Peak)",
    image: profileImg,
  },

  // ── CLOSE ALLIES & COMPANIONS ──
  {
    name: "Qing Shui",
    race: "Human",
    alignment: "Ally",
    subtitle: "Senior Brother • Celestial Powerhouse",
    description: "Wang Lin's senior brother under Bai Fan's lineage. Known for his cold, slaughter-filled aura and extreme violence against enemies, he is fiercely protective of Wang Lin.",
    tags: ["Senior Brother", "Ji Realm / Celestial", "Slaughter"],
    status: "Alive",
    cultivationRealm: "Third Step (Nirvana Shatterer)",
    image: qingShuiImg,
  },
  {
    name: "Chi Hu",
    race: "Human",
    alignment: "Ally",
    subtitle: "Giant Demon Clan Cultivator",
    description: "An honorable, loyal brother-in-arms from the Giant Demon Clan who explored ancient celestial ruins alongside Wang Lin.",
    tags: ["Brotherhood", "Giant Demon Clan"],
    status: "Active",
    cultivationRealm: "Soul Transformation / Corporeal Yang",
    image: chiHuImg,
  },
  {
    name: "Zhou Wutai",
    race: "Human",
    alignment: "Ally",
    subtitle: "Planet Suzaku Ally",
    description: "A dependable cultivator from Planet Suzaku who stood as a firm ally during regional struggles.",
    tags: ["Planet Suzaku", "Reliable Ally"],
    status: "Active",
    cultivationRealm: "Nascent Soul / Soul Formation",
    image: zhouWutaiImg,
  },
  {
    name: "Daoist Scattered Spirit",
    race: "Human",
    alignment: "Ally",
    subtitle: "Eccentric Ancient Cultivator",
    description: "An eccentric expert with vast knowledge of hidden ancient realms and secret techniques.",
    tags: ["Ancient Knowledge", "Eccentricity"],
    status: "Active",
    cultivationRealm: "Soul Transformation",
    image: profileImg,
  },
  {
    name: "Dao Master Blue Dream",
    race: "Human",
    alignment: "Ally",
    subtitle: "Dream Dao Master",
    description: "Master of the Dream Dao and father of Li Qianmei. Offered deep cultivation insights and ancient spells during key struggles.",
    tags: ["Dream Dao", "Li Qianmei's Father"],
    status: "Active",
    cultivationRealm: "Third Step (Heavenly Exalt)",
    disciples: ["Li Qianmei"],
    image: profileImg,
  },
  {
    name: "Gemini",
    race: "Human",
    alignment: "Ally",
    subtitle: "Twin Cultivators",
    description: "Pair of twin cultivators renowned for synchronized combat abilities.",
    tags: ["Twin Bond", "Synchronized Combat"],
    status: "Active",
    cultivationRealm: "Nascent Soul",
    image: profileImg,
  },
  {
    name: "Zhou Yi",
    race: "Human",
    alignment: "Ally",
    subtitle: "Lover of Ting Liu • Sword Spirit",
    description: "A passionate cultivator who spent centuries guarding the corpse of his lover Ting Liu. He later fused with a celestial sword to become a powerful spirit ally.",
    tags: ["Planet Suzaku", "Obsessive Love", "Sword Spirit"],
    image: zhouYiImg,
    status: "Active (As Sword Spirit)",
    cultivationRealm: "Soul Transformation Equivalent",
  },
  {
    name: "Master Hong Shan",
    race: "Human",
    alignment: "Ally",
    subtitle: "Celestial Realm Elder",
    description: "Respected elder cultivator of the Rain Celestial Realm who aided Wang Lin during higher-realm conflicts.",
    tags: ["Rain Celestial Realm", "Elder Authority"],
    image: hongShanImg,
    status: "Active",
    cultivationRealm: "Third Step",
  },
  {
    name: "Qiu Siping",
    race: "Human",
    alignment: "Ally",
    subtitle: "Early Companion",
    description: "An early companion of Wang Lin during his weaker years in Zhao and the Sea of Devils.",
    tags: ["Early Ally", "Mortal Origins"],
    status: "Active",
    cultivationRealm: "Foundation Establishment",
    image: qiuSipingImg,
  },

  // ── RECENTLY ADDED / AUDITED PROFILES ──
  {
    name: "Du Jian",
    race: "Human",
    alignment: "Disciple",
    subtitle: "Celestial Guard • Red Division Disciple",
    description: "A disciple of the Heavenly Fate Sect's Red Division who tried to trap Wang Lin in the Tide Abyss. Wang Lin defeated him and refined him into his first Celestial Guard, promising freedom after 1,000 years. Du Jian became deeply loyal and ultimately sacrificed his life by self-exploding against the Blood Ancestor to protect Wang Lin and Wang Ping.",
    tags: ["Celestial Guard", "Red Division", "Heroic Sacrifice", "Heavenly Fate Sect"],
    status: "Deceased (Self-exploded to save Wang Lin)",
    cultivationRealm: "Ascendant / Illusory Yin",
    master: "Wang Lin",
    enemies: ["Blood Ancestor"],
    image: duJianImg,
  },
  {
    name: "Horned Thunder Beast",
    race: "Spirit Beast",
    alignment: "Servant",
    subtitle: "Thunder Elemental Mount & Guardian",
    description: "A violent, ancient thunder-attuned spirit beast acquired by Wang Lin. It possesses immense physical charge speed and devastating thunder AoE attacks, serving as a reliable mount and battle vanguard.",
    tags: ["Thunder Element", "Ancient Mount", "Vanguard Beast"],
    status: "Active",
    cultivationRealm: "Ascendant / Second Step Equivalent",
    master: "Wang Lin",
    image: hornedThunderbeastImg,
  },
  {
    name: "Demon Emperor Gu Yundun",
    race: "Ancient Demon",
    alignment: "Antagonist",
    subtitle: "Sovereign Ruler of Sky Demon Country",
    description: "The supreme ruler and ultimate authority of Sky Demon Country in the Demon Spirit Land. A warrior emperor who personally leads vast armies of demon generals into battle, wielding the Emperor's Sword and embodying ancient demonic strength.",
    tags: ["Demon Emperor", "Sky Demon Country", "Ancient Demon", "Demon Spirit Land"],
    status: "Active",
    cultivationRealm: "Second Step Peak / Third Step Power",
    sect: "Sky Demon Country",
    image: demonEmperorGuYundunImg,
  },
  {
    name: "Li Yuan",
    race: "Human",
    alignment: "Ally",
    subtitle: "Master of Ancient Restrictions",
    description: "A cultivator from the ancient Li Family of the Allheaven Star System. He inherited knowledge of the Four Great Ancient Restrictions (Annihilation, Life & Death, Ancient Soul, Time) and served as Wang Lin's foundational teacher in high-tier restriction law.",
    tags: ["Restriction Master", "Four Ancient Restrictions", "Allheaven System"],
    status: "Active",
    cultivationRealm: "Ascendant / Corporeal Yang",
    image: liYaunImg,
  },
  {
    name: "Master Flamespark (Yan Leizi)",
    race: "Human",
    alignment: "Master",
    subtitle: "Lord of Thunder Celestial Temple",
    description: "Master Flamespark (Yan Leizi) is the cunning head of the Thunder Celestial Temple in Allheaven. Mastermind behind the war between Allheaven and Alliance, he refined 49 celestial fragments into a massive treasure array and mentored Wang Lin during the Allheaven arc.",
    tags: ["Thunder Celestial Temple", "Allheaven Leader", "Master Strategist"],
    alias: "Yan Leizi",
    status: "Active",
    cultivationRealm: "Third Step (5th Heaven's Blight)",
    master: "Master Lu Fu",
    image: yanLeiziImg,
  },
  {
    name: "Master Lu Fu",
    race: "Human",
    alignment: "Master",
    subtitle: "Ancient Ancestor of Allheaven",
    description: "An ancient, highly respected Third Step cultivator from Allheaven star domain. Master to Yan Leizi (Flamespark) and a core defensive pillar who stood against Outer Realm invaders alongside Master South Cloud and Situ Nan.",
    tags: ["Ancient Ancestor", "Third Step Expert", "Allheaven Pillar"],
    alias: "Lu Fu",
    status: "Active",
    cultivationRealm: "Third Step (Nirvana Shatterer / Void)",
    disciples: ["Master Flamespark"],
    image: profileImg,
  },
  {
    name: "Shengong Hu",
    race: "Human",
    alignment: "Ally",
    subtitle: "Messenger of Thunder Celestial Temple",
    description: "One of the 'Three Calamities' of Allheaven's Southern Domain. He mistook Wang Lin for a hidden Third Step Senior in the thunder pond and pledged loyalty. Though he later discovered Wang Lin's true realm, he retained deep respect and vouched for Wang Lin during the Celestial Tournament.",
    tags: ["Three Calamities", "Shengong Family", "Thunder Messenger"],
    status: "Active",
    cultivationRealm: "Corporeal Yang / Nirvana Scryer",
    image: shenGongHuImg,
  },
  {
    name: "Zhan Konglie",
    race: "Human",
    alignment: "Ally",
    subtitle: "Zhan Family Elite Fighter",
    description: "One of Allheaven's Southern Domain 'Three Calamities' alongside Shengong Hu and Tang Yanfeng. A fiery warrior who challenged Wang Lin in the Celestial qualifiers, lost, and became an honorable ally who vouched for Wang Lin.",
    tags: ["Three Calamities", "Zhan Family", "Martial Master"],
    status: "Active",
    cultivationRealm: "Corporeal Yang / Nirvana Scryer",
    image: zhanKonglieImg,
  },
  {
    name: "Tang Yanfeng",
    race: "Human",
    alignment: "Antagonist",
    subtitle: "Arrogant Calamity of Tang Family",
    description: "One of the 'Three Calamities' of the Southern Domain. Out of jealousy and spite, he attacked Wang Lin during the Thunder Celestial tournament under the assumption that Wang Lin was weak. Wang Lin crushed him in one move and exploded his origin soul.",
    tags: ["Three Calamities", "Tang Family", "Arrogant Rival"],
    status: "Deceased (Killed by Wang Lin)",
    cultivationRealm: "Corporeal Yang",
    image: tangYanFengImg,
  },
  {
    name: "Xi Zi Feng",
    race: "Human",
    alignment: "Disciple",
    subtitle: "Devoted Disciple of Freezing Sky / Cloud System",
    description: "A talented female cultivator who became Wang Lin's disciple. She harbored intense, quiet affection for Wang Lin throughout her life, representing one of the most tragic subplots of unrequited love in his legacy.",
    tags: ["Devoted Disciple", "Unrequited Love", "Quiet Loyalty"],
    status: "Active",
    cultivationRealm: "Ascendant / Corporeal Yang",
    master: "Wang Lin",
    image: profileImg,
  },
  {
    name: "Mo Zhi",
    race: "Human",
    alignment: "Ally",
    subtitle: "Calm Strategist of Allheaven",
    description: "A level-headed, tactically minded cultivator who assisted Wang Lin during campaign planning in the star domain wars.",
    tags: ["Strategist", "Tactical Mind"],
    status: "Active",
    cultivationRealm: "Corporeal Yang",
    image: moZhiImg,
  },
  {
    name: "Zhu Quezi",
    race: "Human",
    alignment: "Antagonist",
    subtitle: "14th Generation Suzaku Master",
    description: "The ruthless 14th generation Zhuque (Vermilion Bird) of Planet Suzaku. He manipulated younger cultivators to extract Suzaku spirit energy to prolong his own life, turning into a bitter enemy of Wang Lin.",
    tags: ["Planet Suzaku", "Zhuque Master", "Schemer"],
    status: "Deceased (Killed by Wang Lin)",
    cultivationRealm: "Late Soul Transformation",
    image: zhuQueziImg,
  },
  {
    name: "Yunque Zi",
    race: "Human / Forsaken Clan",
    alignment: "Rival",
    subtitle: "Junior Brother of Zhu Quezi",
    description: "Brother to Zhu Quezi who secretly aligned with the Forsaken Immortal Clan to overthrow Suzaku authority. A cunning schemer who gave Wang Lin key items like the Star Compass.",
    tags: ["Forsaken Immortal Clan", "Planet Suzaku"],
    alias: "Yun Quezi",
    status: "Active",
    cultivationRealm: "Late Soul Transformation / Ascendant",
    image: yunqueZiImg,
  },
  {
    name: "Lu Mo / Slaughter",
    race: "True Body / Essence Avatar",
    alignment: "Protagonist",
    subtitle: "Slaughter True Body • Manifestation of Murder",
    description: "Wang Lin's Slaughter True Body born from his Slaughter and Absolute End Essences. Given independent consciousness and sent back 10,000 years in time to find a way to revive Li Muwan. He lived 36,000 lives with Li Muwan in the Dream Dao before voluntarily merging back into Wang Lin.",
    tags: ["Slaughter True Body", "4th Step Power", "36,000 Lifetimes", "Essence Clone"],
    alias: "Slaughter, Lu Mo",
    status: "Merged back into Main Body (Wang Lin)",
    cultivationRealm: "Fourth Step (Heaven Trampling)",
    image: profileImg,
  },

  // ── OTHER FEMALE LEADS & RIVALS ──
  {
    name: "Liu Mei",
    race: "Human",
    alignment: "Rival",
    subtitle: "Avatar of Mu Bingmei • Dao of Heartless Love",
    description: "An avatar of Mu Bingmei born in the Xuan Dao Sect. Practiced the Ruthless Domain and sought to use Wang Lin to complete her Dao. Mother of Wang Ping. She died after giving her domain to Huan Wuqing.",
    tags: ["Indigo Fragment", "Heartless Love Dao", "Wang Ping's Mother"],
    status: "Deceased",
    cultivationRealm: "Illusory Yin / Soul Transformation",
    sect: "Xuan Dao Sect, Suzaku Sect",
    enemies: ["Wang Lin (Complex Love-Hate)"],
    firstAppearance: "Book 1",
    image: liuMeiImg,
  },
  {
    name: "Mu Bingmei",
    race: "Human",
    alignment: "Rival",
    subtitle: "Brilliant Void Saintess",
    description: "Former Saintess of the Brilliant Void Realm who created avatars (including Liu Mei) across star systems. She shared a complex dream-life with Wang Lin.",
    tags: ["Brilliant Void Saintess", "Dream Dao", "Complex Dynamic"],
    status: "Alive",
    cultivationRealm: "Third Step (Nirvana Shatterer)",
    sect: "Brilliant Void Realm, God Sect",
    image: muBingmeiImg,
  },
  {
    name: "Red Butterfly (Hong Die)",
    race: "Human",
    alignment: "Rival",
    subtitle: "Arrogant Genius of Planet Suzaku",
    description: "Extremely talented and arrogant female cultivator of Planet Suzaku. She looked down on Wang Lin, sparking a fierce rivalry where Wang Lin eventually severed her arm and defeated her.",
    tags: ["Planet Suzaku", "Genius Rival"],
    alias: "Hong Die",
    status: "Deceased",
    cultivationRealm: "Soul Transformation",
    image: redButterflyImg,
  },

  // ── ANCIENT CLAN & ANTAGONISTS ──
  {
    name: "Tu Si",
    race: "Ancient God",
    alignment: "Antagonist",
    subtitle: "8-Star Ancient God • Memory Inheritor",
    description: "A powerful Ancient God whose cultivation deviation allowed his inner devil (Tuo Sen) to devour him. He sealed Tuo Sen inside his cave world before dying. His memory inheritance went to Wang Lin.",
    tags: ["Ancient God", "Land of Ancient God"],
    status: "Deceased",
    cultivationRealm: "8-Star Ancient God",
    image: tuSiImg,
  },
  {
    name: "Tuo Sen",
    race: "Ancient God",
    alignment: "Antagonist",
    subtitle: "Inner Devil of Tu Si",
    description: "The inner devil born from Tu Si who inherited Tu Si's physical strength. He escaped the Ancient God land and hunted Wang Lin for centuries to regain the memory inheritance.",
    tags: ["Inner Devil", "Ancient God Strength"],
    status: "Alive (Reconciled with Wang Lin)",
    cultivationRealm: "8-Star / 9-Star Ancient God",
    image: tuoSenImg,
  },
  {
    name: "Bei Luo",
    race: "Ancient Demon",
    alignment: "Antagonist",
    subtitle: "Commander of Sky Demon Country",
    description: "An ancient demon soul fragment trapped within the Demon Spirit Land who ruled Sky Demon Country. Pragmatic and charismatic, he formed pacts with Wang Lin.",
    tags: ["Ancient Demon", "Sky Demon Country"],
    status: "Active",
    cultivationRealm: "Ascendant / Second Step Equivalent",
    image: beiLuoImg,
  },
  {
    name: "Ta Jia",
    race: "Ancient Devil",
    alignment: "Antagonist",
    subtitle: "Ancient Devil Master",
    description: "A dangerous Ancient Devil master wielding chaotic destruction Daos.",
    tags: ["Ancient Devil", "Chaos Dao"],
    status: "Deceased / Absorbed",
    cultivationRealm: "Third Step Equivalent",
    image: taJiaImg,
  },
  {
    name: "Ye Dao",
    race: "Ancient God",
    alignment: "Antagonist",
    subtitle: "Royal Ancient Clansman",
    description: "A royal Ancient God from the Immortal Astral Continent with pure bloodline heritage.",
    tags: ["Royal Ancient God", "Immortal Astral Continent"],
    status: "Active",
    cultivationRealm: "Third Step Equivalent",
  },
  {
    name: "Ta Shan",
    race: "Ancient God",
    alignment: "Servant",
    subtitle: "Loyal Divine Guard",
    description: "An Ancient God descendant who pledged absolute loyalty to Wang Lin as his personal guard.",
    tags: ["Ancient God Guard", "Absolute Loyalty"],
    status: "Active",
    cultivationRealm: "Second Step / Ascendant",
    image: taShanImg,
  },
  {
  name: "Palm Lord",
  race: "Human",
  alignment: "Antagonist",
  subtitle: "Ruler of the Outer Realm • Master Schemer",
  description: "The supreme commander of the Outer Realm forces under the Seven Colored Sovereign. A cold and calculating Third Step expert who spent millennia orchestrating the invasion and downfall of the Sealed Realm.",
  tags: ["Outer Realm Leader", "Third Step Peak", "Sealed Realm War", "Mastermind"],
  alias: "Zhang Zun",
  status: "Deceased (Killed by Wang Lin)",
  cultivationRealm: "Third Step Peak (5th Heaven's Blight)",
  enemies: ["Wang Lin", "Qing Lin", "Master South Cloud", "Sealed Realm Alliance"],
  firstAppearance: "Outer Realm War Arc",
  techniques: ["Palm of Heaven & Earth", "Outer Realm Divine Seal", "Absolute Restriction Control"],
  artifacts: ["Outer Realm Command Token", "Ancient Celestial Boundary Banner"],
  image: profileImg, // Standard fallback or your dedicated asset
},

  // ── MAJOR ANTAGONISTS ──
  {
    name: "All-Seer",
    race: "Human / Compass Spirit",
    alignment: "Antagonist",
    subtitle: "Tian Yunzi • Master of Fate",
    description: "Master of Heavenly Fate Sect. He is actually the Treasure Spirit of the Boundary-Defining Compass who manipulated generations of disciples to break his own shackles.",
    tags: ["Schemer", "Fate Dao", "Boundary Compass"],
    alias: "Tian Yunzi",
    status: "Deceased / Integrated",
    cultivationRealm: "Third Step Peak",
    image: allSeerImg,
  },
  {
    name: "Teng Huayuan",
    race: "Human",
    alignment: "Antagonist",
    subtitle: "Teng Clan Patriarch",
    description: "The primary early antagonist who slaughtered Wang Lin's family, triggering Wang Lin's path of ruthless vengeance.",
    tags: ["Revenge Catalyst", "Teng Clan"],
    status: "Deceased (Exterminated by Wang Lin)",
    cultivationRealm: "Nascent Soul",
    image: tengHuayuanImg,
  },
  {
    name: "Blood Ancestor",
    race: "Human",
    alignment: "Antagonist",
    subtitle: "Blood Dao Master",
    description: "A terrifying blood cultivator who targeted Wang Lin for his tools and bloodline.",
    tags: ["Blood Dao", "Ancient Terror"],
    status: "Deceased",
    cultivationRealm: "Soul Transformation / Scryer",
    image: bloodAncestorImg,
  },
  {
    name: "Daoist Water",
    race: "Human",
    alignment: "Antagonist",
    subtitle: "Water Dao Schemer",
    description: "A treacherous Third Step antagonist who schemed against Wang Lin in the Sealed Realm.",
    tags: ["Water Dao", "Sealed Realm Antagonist"],
    status: "Deceased",
    cultivationRealm: "Third Step (Nirvana Cleanser)",
    image:profileImg,
  },
  {
    name: "Sovereign",
    race: "Human",
    alignment: "Antagonist",
    subtitle: "Seven Colored Sovereign",
    description: "The supreme endgame antagonist of the Cave World who viewed the world as his personal farm.",
    tags: ["Cave World Master", "Final Boss"],
    status: "Deceased",
    cultivationRealm: "Third Step Peak",
  },
  {
    name: "Lian Daozhen",
    race: "Human",
    alignment: "Antagonist",
    subtitle: "Dao Severing Specialist",
    description: "Cultivator specialized in severing and destroying the Dao foundations of opponents.",
    tags: ["Dao Severance"],
    status: "Deceased",
    cultivationRealm: "Soul Transformation",
  },
  {
    name: "Sun Dazhu",
    race: "Human",
    alignment: "Antagonist",
    subtitle: "Greedy Heng Yue Elder",
    description: "A petty inner disciple of Heng Yue Sect who abused and exploited Wang Lin during his mortal entry days.",
    tags: ["Early Tormentor", "Heng Yue Sect"],
    status: "Deceased",
    cultivationRealm: "Foundation Establishment",
    image: sunDazhuImg,
  },

  // ── RIVALS & MINOR CHARACTERS ──
  {
    name: "Eternal Night",
    race: "Human",
    alignment: "Rival",
    subtitle: "Darkness Cultivator",
    description: "A dark, mysterious cultivator whose encounters pushed Wang Lin to sharpen his combat mastery.",
    tags: ["Darkness Dao"],
    status: "Active",
    cultivationRealm: "Third Step",
  },
  {
    name: "Ma Liang",
    race: "Human",
    alignment: "Rival",
    subtitle: "Deceased Cultivator of Sea of Devils",
    description: "A weak cultivator killed by Wang Lin. Wang Lin assumed his identity in the Sea of Devils, making the name 'Ma Liang' legendary alongside Li Muwan.",
    tags: ["Identity Stolen", "Sea of Devils"],
    status: "Deceased",
    cultivationRealm: "Foundation Establishment",
    image: maLiangImg,
  },
  {
    name: "Duanmu Ji",
    race: "Human",
    alignment: "Rival",
    subtitle: "Honor-Bound Cultivator",
    description: "A noble-minded cultivator who pursued Wang Lin during earlier fleeing arcs.",
    tags: ["Noble Spirit"],
    status: "Active",
    cultivationRealm: "Soul Transformation",
    image: duanmuJiImg,
  },
  {
    name: "Ling Tianhou",
    race: "Human / Compass Avatar",
    alignment: "Antagonist",
    subtitle: "Sword City Lord • All-Seer Avatar",
    description: "Lord of Da Luo Sword City and military commander in Alliance. Later revealed to be one of All-Seer's avatars.",
    tags: ["Sword Dao", "All-Seer Avatar"],
    status: "Deceased / Merged",
    cultivationRealm: "Second Step Peak / Scryer",
    image: lingTianhouImg,
  },

  // ── SERVANTS & PETS ──
  {
    name: "Xu Liguo",
    race: "Ghost / Sword Spirit",
    alignment: "Servant",
    subtitle: "Shameless Sword Spirit",
    description: "A cowardly, treacherous ghost cultivator refined by Wang Lin into a sword spirit. Provides endless comedic relief with his shameless flattery.",
    tags: ["Comic Relief", "Sword Spirit", "Sycophant"],
    status: "Active",
    cultivationRealm: "High-tier Sword Spirit",
    image: xuLiguoImg,
  },
  {
    name: "Big Head",
    race: "Human",
    alignment: "Servant",
    subtitle: "Loyal Follower",
    description: "A strangely shaped cultivator who became a fiercely loyal follower of Wang Lin.",
    tags: ["Loyal Follower", "Comic Relief"],
    status: "Active",
    cultivationRealm: "Corporeal Yang",
  },
  {
    name: "Liu Jinbiao",
    race: "Human",
    alignment: "Servant",
    subtitle: "Scammer Follower",
    description: "A rogue scammer who joined Wang Lin's retinue and used his sharp tongue to serve Wang Lin.",
    tags: ["Trickster", "Loyal Follower"],
    status: "Active",
    cultivationRealm: "Nascent Soul / Corporeal Yang",
  },
  {
    name: "Mosquito Beast",
    race: "Spirit Beast",
    alignment: "Servant",
    subtitle: "Ancient Devouring Creature",
    description: "An ancient insect spirit beast tamed by Wang Lin in the Sea of Devils. It devours cultivator origin bases to grow stronger alongside Wang Lin.",
    tags: ["Ancient Beast", "Devourer", "Loyal Pet"],
    status: "Active",
    cultivationRealm: "Second / Third Step Equivalent",
    image: mosquitoBeastImg,
  },
  {
    name: "Thunder Toad",
    race: "Spirit Beast",
    alignment: "Servant",
    subtitle: "Thunder Element Beast",
    description: "A massive blue-scaled thunder beast bonded to Wang Lin that spits devastating thunderbolts in battle.",
    tags: ["Thunder Element", "Mount Beast"],
    status: "Active",
    cultivationRealm: "Ascendant Equivalent",
    image: thunderToadImg,
  },
  {
    name: "Brilliant Void",
    race: "Spirit Beast",
    alignment: "Servant",
    subtitle: "Spatial Void Creature",
    description: "A rare spirit creature capable of spatial manipulation and void travel.",
    tags: ["Void Power", "Spatial Travel"],
    status: "Active",
    cultivationRealm: "Ascendant Equivalent",
  },

  // ── ANCIENT CELESTIAL FIGURES ──
  {
  name: "Feng Zun",
  race: "Human",
  alignment: "Master",
  subtitle: "Former Master of Tian Ni Pearl • Third Step Enlightener",
  description: "The former master of the Heaven-Defying Bead (Tian Ni Pearl). When the bead reached Five Elements perfection, Feng Zun's spirit manifested to test Wang Lin, open the gateway to the Third Step, and impart the fundamental truth of true Dao.",
  tags: ["Heaven-Defying Bead", "Tian Ni Pearl", "Sealing Exalt", "Third Step Master", "Dao Enlightener"],
  alias: "Sealing Exalt, Feng Zun",
  status: "Deceased (Legacy & Enlightenment passed to Wang Lin)",
  cultivationRealm: "Third Step Peak (Profound Tribulation)",
  disciples: ["Wang Lin"],
  enemies: ["Shui Daozi (Daoist Water)"],
  firstAppearance: "Tian Ni Five Elements Completion Arc",
  techniques: ["Sealing Extermination Spells", "Five Elements Origin Laws", "Third Step Dao Manifestation"],
  artifacts: ["Heaven-Defying Bead / Tian Ni Pearl (Former Master)"],
  image: profileImg,
},
  {
    name: "Ye Mo",
    race: "Ancient God",
    alignment: "Antagonist",
    subtitle: "Founder of Cave World Ancient Clan",
    description: "The Royal Ancient God whose left eye and inheritance created the Ancient Tomb where Wang Lin and Tuo Sen fought.",
    tags: ["Ancient Clan Ancestor", "Royal Bloodline"],
    status: "Deceased",
    cultivationRealm: "Third Step Peak",
  },
  {
    name: "Ancient Celestial Emperor",
    race: "Human / Celestial",
    alignment: "Antagonist",
    subtitle: "Supreme Celestial Ruler",
    description: "Ancient ruler of the Celestial Realm whose decrees shaped star systems for millennia.",
    tags: ["Ancient Celestial", "Supreme Ruler"],
    status: "Deceased",
    cultivationRealm: "Third Step Peak",
  },
  {
    name: "Vermillion Bird Divine Emperor",
    race: "Human / Divine Clan",
    alignment: "Ally",
    subtitle: "Divine Ruler of Four Divine Sect",
    description: "Former Holy Emperor of the Four Divine Sect who passed the Vermillion Bird succession to Wang Lin.",
    tags: ["Four Divine Sect", "Vermillion Bird"],
    status: "Deceased / Passed Legacy",
    cultivationRealm: "Third Step",
  },
  {
    name: "Azure Dragon Divine Emperor",
    race: "Human / Divine Clan",
    alignment: "Ally",
    subtitle: "Leader of Azure Dragon Branch",
    description: "Leader of Azure Dragon branch who was severely injured fighting Tuo Sen.",
    tags: ["Four Divine Sect", "Azure Dragon"],
    status: "Active",
    cultivationRealm: "Third Step",
  },

  // ── MULTIVERSE GUEST ──
  {
    name: "Su Ming",
    race: "Human / Transcendent",
    alignment: "Ally",
    subtitle: "Protagonist of 'Pursuit of the Truth'",
    description: "Protagonist of Er Gen's novel 'Pursuit of the Truth'. Included as a cross-novel multiverse entry due to shared cosmology with Wang Lin in the Vast Expanse.",
    tags: ["Multiverse Guest", "Er Genverse", "Pursuit of the Truth"],
    status: "Active (in Pursuit of the Truth)",
    cultivationRealm: "4th Step Transcendent",
    image: suMingImg,
  },
];

export const characters: Character[] = rawCharacters.map((character) => ({
  ...character,
  image: character.image ?? profileImg,
}));

export const races = [
  "All Races", 
  "Human", 
  "Human / Ancient Clan",
  "Ancient Clan", 
  "Ancient God", 
  "Ancient Demon", 
  "Ancient Devil", 
  "Spirit Beast", 
  "Ghost / Sword Spirit",
  "True Body / Avatar"
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

export const alignmentColors: Record<string, string> = {
  Protagonist: "bg-[hsl(var(--gold))]",
  Ally: "bg-[hsl(var(--jade))]",
  Rival: "bg-[hsl(var(--void))] brightness-150",
  Antagonist: "bg-[hsl(var(--crimson))]",
  Family: "bg-[hsl(var(--gold-dim))]",
  Master: "bg-[hsl(var(--jade-dim))]",
  Disciple: "bg-[hsl(var(--jade))]",
  Servant: "bg-muted",
};

export const alignmentBorderColors: Record<string, string> = {
  Protagonist: "border-[hsl(var(--gold))]",
  Ally: "border-[hsl(var(--jade))]",
  Rival: "border-[hsl(var(--void))]",
  Antagonist: "border-[hsl(var(--crimson))]",
  Family: "border-[hsl(var(--gold-dim))]",
  Master: "border-[hsl(var(--jade-dim))]",
  Disciple: "border-[hsl(var(--jade))]",
  Servant: "border-border",
};