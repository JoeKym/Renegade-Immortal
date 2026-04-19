import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { ChevronDown } from "lucide-react";

interface Dao {
  name: string;
  order: string;
  description: string;
  powers: string[];
  arc: string;
  color: string;
  icon: string;
  techniquesDerived: string[];
  storyImpact: string;
}

// Wang Lin's 14 Essences categorized by type
const etherealEssences: Dao[] = [
  {
    name: "Life and Death Essence",
    order: "First Ethereal Essence",
    description: "Wang Lin's first major breakthrough, achieved after living as a mortal scholar for 100 years to understand the Life and Death Domain. Represents the fundamental duality of existence and mastery over the cycle of life and death itself.",
    powers: ["Life Force Manipulation", "Death Touch", "Life-Death Transition", "Soul Command", "Underworld Realm Access"],
    arc: "Nascent Soul — Soul Mastery",
    color: "border-foreground/30",
    icon: "☯️",
    techniquesDerived: ["Life & Death Domain", "Finger of Death", "Soul Flag binding", "Resurrection techniques"],
    storyImpact: "Connected to Li Muwan's fate — this Dao is forged partly from the grief and love Wang Lin carries for her. Establishes his foundation for all subsequent cultivation.",
  },
  {
    name: "Karma Essence",
    order: "Second Ethereal Essence",
    description: "Formed when Wang Lin realized that life, death, and reincarnation create a cycle of Karmic Cause and Effect. Evolved from his Karma Domain after experiencing a second mortal lifetime with his son, Wang Ping.",
    powers: ["Karmic Bonding", "Luck Manipulation", "Fate Weaving", "Cause-Effect Control", "Karmic Severance"],
    arc: "Soul Formation — Cosmic Understanding",
    color: "border-primary",
    icon: "🔮",
    techniquesDerived: ["Karmic Severance", "Fate thread manipulation", "Karmic reversal", "Luck manipulation"],
    storyImpact: "Gives Wang Lin insight into the deeper connections between all beings — key to understanding his role in the multiverse and the interconnected web of existence.",
  },
  {
    name: "True and False Essence",
    order: "Third Ethereal Essence",
    description: "An ethereal essence comprehended to reach the Third Step of cultivation. Developed after his Star of Law was destroyed during a critical battle; he mastered it by experiencing 60 years of a 'dream world' through his Dream Dao.",
    powers: ["Truth Perception", "Illusion Breaking", "Reality Manipulation", "False-to-True Conversion", "Dream World Creation"],
    arc: "Divine Transformation — Realm Breaking",
    color: "border-jade",
    icon: "🪞",
    techniquesDerived: ["True/False Reversal", "Reality inversion", "Illusion realm creation", "Dream manipulation"],
    storyImpact: "A philosophical Dao that changes how Wang Lin perceives existence itself — preparation for transcendence. Allows him to make the false become true.",
  },
  {
    name: "Dream Dao Essence",
    order: "Fourth Ethereal Essence",
    description: "A unique path inspired by the 'Dream of Ancient Times,' allowing him to use the flow of time and dreams to manipulate reality and even send avatars to the past. This is Wang Lin's most ethereal and mysterious essence.",
    powers: ["Time Flow Manipulation", "Dream World Creation", "Avatar Projection", "Past Sending", "Reality Distortion"],
    arc: "Arcane Void — Dream Mastery",
    color: "border-purple-500",
    icon: "🌙",
    techniquesDerived: ["Dream of Ancient Times", "Time avatar creation", "Dream realm mastery", "Temporal displacement"],
    storyImpact: "Enables Wang Lin to transcend normal temporal limitations and manipulate reality through dreams — a power that defies conventional cultivation.",
  },
  {
    name: "Reincarnation/Samsara Essence",
    order: "Final Ethereal Essence",
    description: "The final essence Wang Lin mastered to step into the Heaven Trampling Realm (the Fourth Step). Represents complete understanding of the cycle of rebirth and the eternal nature of existence.",
    powers: ["Rebirth Control", "Samsara Manipulation", "Eternal Cycle Mastery", "Transcendence Insight", "Heaven Trampling"],
    arc: "Heaven Trampling Realm — Fourth Step",
    color: "border-amber-500",
    icon: "♾️",
    techniquesDerived: ["Samsara Domain", "Reincarnation mastery", "Eternal cycle manipulation", "Heaven defiance"],
    storyImpact: "The culmination of his ethereal cultivation — allows Wang Lin to transcend the cycle of rebirth and achieve true immortality beyond the heavens.",
  },
];

const corporealEssences: Dao[] = [
  {
    name: "Thunder Essence",
    order: "First Corporeal Essence",
    description: "Initiated by devouring an Ancient Thunder Dragon Soul and later perfected by creating nine 'accompanying thunders,' including his own Ji Thunder and Defying Thunder. Represents the violent, destructive power of heavenly tribulation.",
    powers: ["Lightning Manipulation", "Tribulation Control", "Ji Thunder", "Defying Thunder", "Thunder Dragon Avatar"],
    arc: "Core Formation — Elemental Mastery",
    color: "border-yellow-500",
    icon: "⚡",
    techniquesDerived: ["Nine Accompanying Thunders", "Thunder Dragon Soul", "Heavenly Tribulation control", "Lightning avatar"],
    storyImpact: "Gives Wang Lin power over heavenly tribulations — the very force used by the heavens to punish cultivators.",
  },
  {
    name: "Fire Essence",
    order: "Second Corporeal Essence",
    description: "Awakened through his Vermillion Bird Mark and refined into Ethereal Fire after absorbing the Nine Tribulation Karma Fires. Part of the Five Elements cultivation, representing life and transformation.",
    powers: ["Ethereal Fire", "Vermillion Bird Flames", "Karma Fire", "Nine Tribulation Fires", "Phoenix Rebirth Flames"],
    arc: "Soul Formation — Five Elements",
    color: "border-red-500",
    icon: "🔥",
    techniquesDerived: ["Vermillion Bird Mark", "Nine Tribulation Karma Fires", "Ethereal Fire mastery", "Phoenix rebirth"],
    storyImpact: "Connected to his Vermillion Bird bloodline — allows Wang Lin to control flames that can burn karma itself.",
  },
  {
    name: "Water Essence",
    order: "Third Corporeal Essence",
    description: "Part of the Five Elements True Body cultivation. Represents adaptability, flow, and the yielding nature that can overcome all hardness. Water essence completes the cycle of life alongside Wood essence.",
    powers: ["Water Manipulation", "Flow Control", "Adaptability", "Ice Formation", "Tidal Forces"],
    arc: "Soul Formation — Five Elements",
    color: "border-blue-500",
    icon: "💧",
    techniquesDerived: ["Water Domain", "Ice mastery", "Flow manipulation", "Tidal control"],
    storyImpact: "Provides the flexibility and adaptability needed to survive in the cultivation world — water yields but never breaks.",
  },
  {
    name: "Earth Essence",
    order: "Fourth Corporeal Essence",
    description: "Part of the Five Elements True Body cultivation. Represents stability, endurance, and the foundation upon which all cultivation is built. The unyielding nature of earth mirrors Wang Lin's perseverance.",
    powers: ["Earth Manipulation", "Gravity Control", "Mountain Creation", "Terrain Mastery", "Stability Domain"],
    arc: "Soul Formation — Five Elements",
    color: "border-amber-700",
    icon: "⛰️",
    techniquesDerived: ["Earth Domain", "Mountain creation", "Gravity manipulation", "Terrain control"],
    storyImpact: "Gives Wang Lin unshakeable stability — the foundation needed to support all his other essences and powers.",
  },
  {
    name: "Wood Essence",
    order: "Fifth Corporeal Essence",
    description: "Part of the Five Elements True Body cultivation. Represents growth, vitality, and the cycle of life. Wood essence completes the Five Elements and enables the creation of life itself.",
    powers: ["Plant Manipulation", "Growth Acceleration", "Vitality Control", "Forest Domain", "Life Creation"],
    arc: "Soul Formation — Five Elements",
    color: "border-green-500",
    icon: "🌿",
    techniquesDerived: ["Forest Domain", "Plant manipulation", "Growth mastery", "Vitality creation"],
    storyImpact: "Enables Wang Lin to create and nurture life — completing the Five Elements cycle and representing his journey from mortality to divinity.",
  },
  {
    name: "Metal Essence",
    order: "Sixth Corporeal Essence",
    description: "Gained from fragments of the Immortal Absolute Sword. Part of the Five Elements True Body cultivation. Represents sharpness, precision, and the cutting edge of cultivation. Metal essence embodies Wang Lin's sword intent.",
    powers: ["Sword Intent", "Sharpness Mastery", "Metal Manipulation", "Cutting Force", "Weapon Refinement"],
    arc: "Soul Formation — Five Elements",
    color: "border-gray-400",
    icon: "⚔️",
    techniquesDerived: ["Immortal Absolute Sword", "Sword Domain", "Metal manipulation", "Sharpness control"],
    storyImpact: "Connected to Wang Lin's identity as a sword cultivator — metal essence sharpens his will and his blade to cut through all obstacles.",
  },
];

const specialEssences: Dao[] = [
  {
    name: "Slaughter Essence",
    order: "First Special Essence",
    description: "A rare essence representing his lifetime of murder. It is so powerful that it could freeze a star system just by being present. Represented by his 'Slaughter Avatar,' this path embodies his ruthless side and his will to kill anyone who threatens his path or loved ones.",
    powers: ["Killing Intent Materialization", "Battle Aura", "Star System Freezing", "Murder Domain", "Ruthless Supremacy"],
    arc: "Core Formation — Battle Focus",
    color: "border-crimson",
    icon: "🗡️",
    techniquesDerived: ["Slaughter Domain", "Killing intent materialization", "Battle aura projection", "Murder avatar"],
    storyImpact: "Transforms Wang Lin from a survivor into an apex predator feared across multiple realms. This essence is so potent it manifests as a separate avatar.",
  },
  {
    name: "Restriction Essence",
    order: "Second Special Essence",
    description: "Formed by merging millions of formations and the Four Great Restrictions (Annihilation, Life and Death, Time, and Ancient Soul). Represents the power to limit, bind, and control through complex patterns.",
    powers: ["Formation Mastery", "Restriction Creation", "Annihilation Restriction", "Time Restriction", "Soul Binding"],
    arc: "Nascent Soul — Formation Mastery",
    color: "border-indigo-500",
    icon: "🔷",
    techniquesDerived: ["Four Great Restrictions", "Millions of formations", "Restriction Domain", "Binding mastery"],
    storyImpact: "Gives Wang Lin mastery over the art of restrictions — allowing him to trap, bind, and control even powerful ancient beings.",
  },
  {
    name: "Absolute Beginning Essence",
    order: "Third Special Essence",
    description: "Comprehended from the Dong Lin Pond on the Immortal Astral Continent. Represents the origin and beginning of all things — the primordial state before existence itself.",
    powers: ["Origin Manipulation", "Primordial Power", "Creation Force", "Beginning Domain", "Source Control"],
    arc: "Transcendent Stage — Origin Mastery",
    color: "border-cyan-500",
    icon: "🌅",
    techniquesDerived: ["Origin Domain", "Primordial manipulation", "Creation force", "Beginning control"],
    storyImpact: "Gives Wang Lin insight into the origin of all things — the power to understand and manipulate the very beginning of existence.",
  },
  {
    name: "Absolute End Essence",
    order: "Fourth Special Essence",
    description: "Comprehended from the Dong Lin Pond on the Immortal Astral Continent, representing the termination and end of all things. The counterpart to Absolute Beginning, together they form the cycle of existence.",
    powers: ["Termination Force", "Ending Domain", "Destruction Mastery", "Finality Control", "Cessation Power"],
    arc: "Transcendent Stage — Termination Mastery",
    color: "border-purple-900",
    icon: "🌑",
    techniquesDerived: ["Ending Domain", "Termination mastery", "Finality control", "Cessation force"],
    storyImpact: "The power to bring all things to an end — completing the cycle with Absolute Beginning and giving Wang Lin mastery over the full spectrum of existence.",
  },
];

// Combine all essences
const daos: Dao[] = [...etherealEssences, ...corporealEssences, ...specialEssences];

const trueBodies = [
  {
    title: "Five Elements True Body",
    description: "A fusion of Fire, Water, Earth, Wood, and Metal essences, representing his cultivation of life and the completion of the Five Elements cycle.",
    essences: ["Fire", "Water", "Earth", "Wood", "Metal"],
    powers: ["Elemental Mastery", "Life Creation", "World Formation", "Cycle Control", "Balance Dominion"],
    color: "border-emerald-500",
  },
  {
    title: "Slaughter True Body (Black Clone)",
    description: "A fusion of Slaughter, Thunder, Restriction, Absolute Beginning, and Absolute End essences, representing his path of murder and destruction.",
    essences: ["Slaughter", "Thunder", "Restriction", "Absolute Beginning", "Absolute End"],
    powers: ["Death Dominion", "Origin-Ending Cycle", "Star System Freezing", "Restriction Mastery", "Heaven Defiance"],
    color: "border-crimson",
  },
];

const cultivationCharacteristics = [
  {
    title: "Defying the Heavens",
    description: "Wang Lin views the 'Heavenly Dao' not as a guide, but as a shackle or predator that treats cultivators like insects.",
    icon: "⚡",
  },
  {
    title: "Dao Ancient Lineage",
    description: "He eventually reaches the peak as a 27-Star Dao Ancient God, fusing the powers of the Ancient God, Ancient Demon, and Ancient Devil.",
    icon: "⭐",
  },
  {
    title: "Self-Reliance",
    description: "At the end of his journey, he realizes that seeking the Great Dao is actually seeking one's inner self, allowing him to go beyond the universe itself.",
    icon: "🧘",
  },
];

const integrations = [
  { title: "Ancient God Integration", desc: "Celestial-level power and absolute authority.", powers: ["Celestial Authority", "Creation Dao Mastery", "Primordial Energy Control", "Divine Hierarchy Position"] },
  { title: "Ancient Demon Integration", desc: "Chaotic, instinctual power complementing ordered authority.", powers: ["Chaos Manipulation", "Instinctive Power", "Demon Essence Control", "Hybrid Flexibility"] },
  { title: "Ancient Devil Integration", desc: "Pure destructive power completing transcendence.", powers: ["Destruction Dao Mastery", "Unlimited Offensive Power", "Law Shattering", "Complete Transcendence"] },
];

const DaosPage = () => {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <Layout>
      <PageHero title="The Dao Evolution" subtitle="The Legendary Cultivation Paths of Renegade Immortal" />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Intro */}
          <div className="gradient-card border border-border rounded-lg p-8 mb-12">
            <p className="font-body text-foreground/80 text-lg leading-relaxed mb-4">
              In the world of Renegade Immortal, Wang Lin's journey is defined by his comprehension of <strong className="text-primary">14 profound Essences</strong> (also referred to as Source Origins or Daos). 
              Unlike most cultivators who inherit established paths, Wang Lin <strong className="text-primary">defies the Heavens</strong> to forge his own unique cultivation belief.
            </p>
            <p className="font-body text-foreground/80 leading-relaxed">
              These 14 Essences are categorized into three types: <span className="text-purple-400">Ethereal Essences</span> (based on insight and life experiences), 
              <span className="text-emerald-400"> Corporeal Essences</span> (based on physical elements), and <span className="text-crimson">Special/Void Essences</span> (unique powers born from his defiance of heaven).
              Eventually, these essences fuse into two primary <strong>True Bodies</strong> that represent his complete cultivation path.
            </p>
          </div>

          {/* Essence Categories */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="gradient-card border-l-2 border-purple-500 border border-border rounded-lg p-6">
              <h3 className="font-heading text-sm text-purple-400 tracking-wider mb-2">Ethereal Essences</h3>
              <p className="text-sm text-foreground/70 font-body">Based on insight and life experiences. Essential for reaching higher realms like Arcane Void.</p>
              <p className="text-xs text-muted-foreground mt-2">Life/Death, Karma, True/False, Dream, Reincarnation</p>
            </div>
            <div className="gradient-card border-l-2 border-emerald-500 border border-border rounded-lg p-6">
              <h3 className="font-heading text-sm text-emerald-400 tracking-wider mb-2">Corporeal Essences</h3>
              <p className="text-sm text-foreground/70 font-body">Based on physical elements and cosmic forces. Complete the Five Elements cycle.</p>
              <p className="text-xs text-muted-foreground mt-2">Thunder, Fire, Water, Earth, Wood, Metal</p>
            </div>
            <div className="gradient-card border-l-2 border-crimson border border-border rounded-lg p-6">
              <h3 className="font-heading text-sm text-crimson tracking-wider mb-2">Special Essences</h3>
              <p className="text-sm text-foreground/70 font-body">Unique powers representing his defiance of heaven and path of slaughter.</p>
              <p className="text-xs text-muted-foreground mt-2">Slaughter, Restriction, Absolute Beginning, Absolute End</p>
            </div>
          </div>

          {/* Dao List */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Wang Lin's Legendary Daos</h2>
          <div className="space-y-3">
            {daos.map((dao, i) => (
              <motion.div
                key={dao.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`gradient-card border-l-2 ${dao.color} border border-border rounded-lg overflow-hidden`}
              >
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{dao.icon}</span>
                    <div>
                      <h3 className="font-heading text-lg text-primary tracking-wider">{dao.name}</h3>
                      <p className="text-sm text-muted-foreground font-body">{dao.order}</p>
                    </div>
                  </div>
                  <ChevronDown className={`text-primary transition-transform ${expanded === i ? "rotate-180" : ""}`} size={18} />
                </button>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-4">
                        <p className="font-body text-foreground/80 leading-relaxed">{dao.description}</p>
                        <div>
                          <h4 className="text-xs font-heading text-muted-foreground tracking-wider uppercase mb-2">Powers & Abilities</h4>
                          <div className="flex flex-wrap gap-2">
                            {dao.powers.map((p) => (
                              <span key={p} className="text-xs font-body px-2 py-1 rounded border border-primary/20 text-primary/80">{p}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-heading text-muted-foreground tracking-wider uppercase mb-2">Techniques Derived</h4>
                          <div className="flex flex-wrap gap-2">
                            {dao.techniquesDerived.map((t) => (
                              <Link key={t} to="/artifacts" className="text-xs font-body px-2 py-1 rounded border border-jade/20 text-jade hover:bg-jade/10 transition-colors">{t}</Link>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-heading text-muted-foreground tracking-wider uppercase mb-1">Story Impact</h4>
                          <p className="text-sm text-foreground/70 font-body leading-relaxed">{dao.storyImpact}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-heading text-muted-foreground tracking-wider uppercase mb-1">Cultivation Arc</h4>
                          <p className="text-sm text-foreground/70 font-body">{dao.arc}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* True Bodies */}
          <h2 className="font-heading text-2xl text-primary text-center mt-16 mb-8 tracking-wider">Essence True Bodies</h2>
          <p className="text-center text-foreground/70 font-body mb-8 max-w-2xl mx-auto">
            To reach the peak of his power, Wang Lin fused his 14 essences into two primary forms representing his dual cultivation path.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {trueBodies.map((body) => (
              <div key={body.title} className={`gradient-card border-l-2 ${body.color} border border-border rounded-lg p-6`}>
                <h3 className="font-heading text-lg text-primary tracking-wider mb-3">{body.title}</h3>
                <p className="text-foreground/70 font-body text-sm mb-4">{body.description}</p>
                <div className="mb-4">
                  <h4 className="text-xs font-heading text-muted-foreground tracking-wider uppercase mb-2">Fused Essences</h4>
                  <div className="flex flex-wrap gap-2">
                    {body.essences.map((e) => (
                      <span key={e} className="text-xs font-body px-2 py-1 rounded bg-primary/10 text-primary">{e}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-heading text-muted-foreground tracking-wider uppercase mb-2">Powers</h4>
                  <ul className="space-y-1">
                    {body.powers.map((p) => (
                      <li key={p} className="text-xs text-muted-foreground font-body flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Cultivation Characteristics */}
          <h2 className="font-heading text-2xl text-primary text-center mt-16 mb-8 tracking-wider">Key Characteristics of His Path</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {cultivationCharacteristics.map((char) => (
              <div key={char.title} className="gradient-card border border-border rounded-lg p-6 text-center">
                <span className="text-3xl mb-3 block">{char.icon}</span>
                <h3 className="font-heading text-sm text-primary tracking-wider mb-2">{char.title}</h3>
                <p className="text-sm text-foreground/70 font-body">{char.description}</p>
              </div>
            ))}
          </div>

          {/* Integrations */}
          <h2 className="font-heading text-2xl text-primary text-center mt-16 mb-8 tracking-wider">Ancient Race Integrations</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {integrations.map((int) => (
              <div key={int.title} className="gradient-card border border-border rounded-lg p-6">
                <h3 className="font-heading text-sm text-primary tracking-wider mb-2">{int.title}</h3>
                <p className="text-foreground/70 font-body text-sm mb-3">{int.desc}</p>
                <ul className="space-y-1">
                  {int.powers.map((p) => (
                    <li key={p} className="text-xs text-muted-foreground font-body flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Dao Evolution Visual */}
          <div className="mt-16">
            <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Dao Evolution Path</h2>
            <div className="flex flex-col items-center space-y-1">
              {daos.map((dao, i) => (
                <div key={dao.name} className="flex flex-col items-center">
                  <div className="gradient-card border border-border rounded-lg px-6 py-3 text-center flex items-center gap-2">
                    <span>{dao.icon}</span>
                    <p className="font-heading text-sm text-primary tracking-wider">{dao.name}</p>
                  </div>
                  {i < daos.length - 1 && <div className="w-px h-6 bg-primary/30" />}
                </div>
              ))}
              <div className="w-px h-6 bg-primary/30" />
              <div className="gradient-gold rounded-lg px-8 py-4 text-center">
                <p className="font-heading text-sm text-primary-foreground tracking-wider">∞ TRANSCENDENCE</p>
                <p className="text-xs text-primary-foreground/70 font-body">All Ancient Races Integrated</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DaosPage;
