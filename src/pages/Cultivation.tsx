import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";

// First Step: Building the Foundation
const firstStepRealms = [
  {
    name: "Qi Condensation",
    desc: "The cultivator begins to absorb and refine spiritual energy from the environment. 15 layers of energy absorption mark progression.",
    abilities: "Basic spiritual energy manipulation, minor physical enhancement",
    power: 5,
    known: ["Wang Lin (early)", "All beginning cultivators"]
  },
  {
    name: "Foundation Establishment",
    desc: "Refines the body to better suit cultivation. Building the foundation of cultivation — a critical stage that determines future potential.",
    abilities: "Spirit vessel creation, basic spell usage, enhanced longevity",
    power: 10,
    known: ["Wang Lin", "Zhou Yi"]
  },
  {
    name: "Core Formation",
    desc: "Compressing energy into a spiritual core. Forming the golden core is a crucial milestone — many cultivators never pass this stage.",
    abilities: "Golden core powers, flight, intermediate spells, extended lifespan",
    power: 20,
    known: ["Wang Lin (early)", "Li Muwan (early)"]
  },
  {
    name: "Nascent Soul",
    desc: "Breaking the core to birth an infant soul. The cultivator's spirit can now exist independently of the body.",
    abilities: "Soul separation, advanced spells, near-immortal lifespan",
    power: 30,
    known: ["Situ Nan", "Red Butterfly", "Li Muwan (at death)"]
  },
  {
    name: "Soul Formation (Deity Transformation)",
    desc: "Gaining a Domain and fusing it with the Nascent Soul to form an Origin Soul. The soul reaches maturity and power.",
    abilities: "Soul domain, cosmic perception, extended dimensional awareness",
    power: 40,
    known: ["Qing Shui", "Li Muwan (peak)"]
  },
  {
    name: "Soul Transformation",
    desc: "Refining the body with celestial energy. A transitional stage before Ascendant.",
    abilities: "Celestial energy manipulation, domain enhancement",
    power: 45,
    known: ["Many mid-tier cultivators"]
  },
  {
    name: "Ascendant",
    desc: "Fully fusing the domain and celestial energy with the Origin Soul. Ascending beyond the mortal plane — cultivators become legends.",
    abilities: "Realm crossing, advanced law manipulation, cosmic authority",
    power: 50,
    known: ["All-Seer (early)", "Master Hong Shan"]
  }
];

// Transitional Level 1
const transitionalLevel1 = [
  {
    name: "Illusory Yin",
    desc: "Transitional level where celestial energy begins to be replaced by Origin Energy. A bridge between First and Second Steps.",
    abilities: "Origin Energy sensing, partial law comprehension",
    power: 55,
    known: ["Advanced Ascendants"]
  },
  {
    name: "Corporeal Yang",
    desc: "Celestial energy is fully replaced by Origin Energy. Physical body undergoes qualitative transformation.",
    abilities: "Origin Energy manipulation, enhanced physical durability",
    power: 60,
    known: ["Peak Ascendants"]
  }
];

// Second Step: Cultivating the Law and Dao
const secondStepRealms = [
  {
    name: "Nirvana Scryer",
    desc: "Beginning to see and understand natural laws. Focuses on comprehending the fundamental laws of reality.",
    abilities: "Natural law perception, essence seed formation",
    power: 65,
    known: ["Law comprehending cultivators"]
  },
  {
    name: "Nirvana Cleanser",
    desc: "Gaining the ability to control natural laws. Can manipulate aspects of reality within their domain.",
    abilities: "Law control, essence refinement",
    power: 70,
    known: ["Mid-tier Second Step"]
  },
  {
    name: "Nirvana Shatterer",
    desc: "Forming an Essence from natural law. Can shatter weaker laws and establish their own.",
    abilities: "Essence formation, law shattering, domain establishment",
    power: 75,
    known: ["Powerful law cultivators"]
  }
];

// Transitional Level 2
const transitionalLevel2 = [
  {
    name: "Heaven's Blight (1-5)",
    desc: "A series of 5 tribulations that must be survived to open the Void Gate. Each tribulation tests the cultivator's mastery over laws.",
    abilities: "Tribulation survival, Void Gate preparation",
    power: 80,
    known: ["Those who challenge heaven"]
  }
];

// Third Step: The Dao
const thirdStepRealms = [
  {
    name: "Nirvana Void",
    desc: "Essence undergoes a qualitative change. The stage where a cultivator begins to truly master their own Dao Essence.",
    abilities: "Essence transformation, Dao comprehension",
    power: 85,
    known: ["Tu Si (incomplete)", "Tou Sen (early)"]
  },
  {
    name: "Spirit Void",
    desc: "Fusing with one's Joss Flame Realm or completing five Essences. Marks deeper integration with the Dao.",
    abilities: "Joss Flame Realm fusion, multi-essence mastery",
    power: 88,
    known: ["Ancient God Tu Si (complete)"]
  },
  {
    name: "Arcane Void",
    desc: "Requires at least one Ethereal Essence and completing nine Essences. Wang Lin achieved this with his 14 Essences.",
    abilities: "Ethereal Essence mastery, nine+ essences completion",
    power: 92,
    known: ["Wang Lin (during Third Step progression)"]
  },
  {
    name: "Void Tribulant",
    desc: "Surviving the nine Arcane Tribulations. Only the strongest reach this stage.",
    abilities: "Tribulation mastery, peak Third Step power",
    power: 95,
    known: ["Elite Third Step cultivators"]
  },
  {
    name: "Golden/Empyrean/Grand Empyrean",
    desc: "Elite ranks within the Void Tribulant realm. The highest tier of Third Step before Fourth Step.",
    abilities: "Peak universe-scale manipulation, Dao mastery at highest level",
    power: 98,
    known: ["Tu Si", "Tou Sen", "Ta Jia", "All-Seer (peak)"]
  }
];

// Fourth Step: Beyond the Dao
const fourthStepRealms = [
  {
    name: "Heaven Trampling (Ta Tian)",
    desc: "The ultimate peak reached after crossing the Nine Heaven Trampling Bridges. Only Wang Lin is known to have achieved this through integration of all Ancient Races and 14 Essences.",
    abilities: "Multiverse manipulation, complete transcendence, existence beyond all classification",
    power: 100,
    known: ["Wang Lin (final)", "The God"]
  }
];

// Wang Lin's Journey
const wangLinJourney = [
  {
    stage: "The Beginning",
    desc: "A village boy with mediocre talent, entering cultivation through his parents' hopes and the Heaven Defying Bead discovery."
  },
  {
    stage: "Vengeance and Resilience",
    desc: "After Teng Clan slaughtered his family, Wang Lin's heart turned cold. He achieved the Ji Realm — a rare deadly power allowing him to kill higher-level cultivators but limiting standard progression."
  },
  {
    stage: "Ancient God Inheritance",
    desc: "Obtained Ancient God Tu Si's inheritance, gaining an Ancient God body. Balanced human cultivation with Ancient Clan power throughout his journey."
  },
  {
    stage: "The Obsession with Resurrection",
    desc: "His entire journey defined by love for Li Muwan. Most breakthroughs and choices fueled by the singular goal of resurrecting her."
  },
  {
    stage: "The Peak",
    desc: "After thousands of years, multiple 'mortality' trials living as ordinary human to comprehend the Dao, surviving countless schemes — reached Heaven Trampling Realm, resurrected Li Muwan, and left the 'Cave World' to explore the greater universe."
  }
];

const CultivationPage = () => {
  return (
    <Layout>
      <PageHero title="Cultivation Realms" subtitle="The Four Steps from mortal to Heaven Trampling" />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Intro */}
          <div className="gradient-card border border-border rounded-lg p-8 mb-12">
            <p className="font-body text-foreground/80 text-lg leading-relaxed mb-4">
              In the world of Renegade Immortal, cultivation is a grueling process categorized into <strong className="text-primary">Four Major Steps</strong>, 
              with transitional levels in between. Each Step represents a fundamental transformation in the cultivator's ability to manipulate reality.
            </p>
            <p className="font-body text-foreground/80 leading-relaxed">
              Wang Lin's journey spans from a mortal village boy with mediocre talent to the ultimate peak of <strong className="text-primary">Heaven Trampling (Ta Tian)</strong> — 
              achieved only by integrating all Ancient Races (God, Demon, Devil) and mastering 14 Essences.
            </p>
          </div>

          {/* First Step */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center font-heading text-primary-foreground font-bold">1</div>
              <h2 className="font-heading text-2xl text-primary tracking-wider">First Step: Building the Foundation</h2>
            </div>
            <p className="text-foreground/70 font-body mb-6">
              Focuses on absorbing spiritual energy and refining the physical body. From Qi Condensation through Ascendant — building the cultivator's base power.
            </p>
            <div className="relative">
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-jade via-jade/50 to-primary/30" />
              <div className="space-y-4">
                {firstStepRealms.map((realm, i) => (
                  <motion.div
                    key={realm.name}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="relative pl-16 md:pl-20"
                  >
                    <div className="absolute left-4 md:left-6 top-5 w-4 h-4 rounded-full border-2 border-jade bg-background z-10" />
                    <div className="gradient-card border-l-2 border-jade border border-border rounded-lg p-5">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                        <h3 className="font-heading text-base text-primary tracking-wider">{realm.name}</h3>
                        <span className="text-[10px] font-heading text-muted-foreground tracking-wider">POWER: {realm.power}/100</span>
                      </div>
                      <p className="text-foreground/80 font-body text-sm leading-relaxed mb-2">{realm.desc}</p>
                      <p className="text-xs text-muted-foreground font-body"><strong>Abilities:</strong> {realm.abilities}</p>
                      {realm.known && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {realm.known.map((k) => (
                            <span key={k} className="text-[10px] font-body px-2 py-0.5 rounded bg-jade/10 text-jade">{k}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Transitional Level 1 */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center font-heading text-primary/70 font-bold">↔</div>
              <h2 className="font-heading text-xl text-primary/80 tracking-wider">Transitional: Yin-Yang Transformation</h2>
            </div>
            <p className="text-foreground/70 font-body mb-6">
              Between First and Second Steps, celestial energy is replaced by Origin Energy through Illusory Yin and Corporeal Yang stages.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {transitionalLevel1.map((realm) => (
                <div key={realm.name} className="gradient-card border border-border rounded-lg p-5">
                  <h3 className="font-heading text-base text-primary tracking-wider mb-2">{realm.name}</h3>
                  <p className="text-foreground/80 font-body text-sm mb-2">{realm.desc}</p>
                  <p className="text-xs text-muted-foreground font-body">{realm.abilities}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Second Step */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center font-heading text-primary-foreground font-bold">2</div>
              <h2 className="font-heading text-2xl text-primary tracking-wider">Second Step: Cultivating Law and Dao</h2>
            </div>
            <p className="text-foreground/70 font-body mb-6">
              Focuses on comprehending and controlling natural laws. From seeing laws to forming Essences from them.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {secondStepRealms.map((realm, i) => (
                <motion.div
                  key={realm.name}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="gradient-card border border-border rounded-lg p-5"
                >
                  <h3 className="font-heading text-base text-primary tracking-wider mb-2">{realm.name}</h3>
                  <p className="text-foreground/80 font-body text-sm mb-2">{realm.desc}</p>
                  <p className="text-xs text-muted-foreground font-body">{realm.abilities}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Transitional Level 2 */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border-2 border-crimson/50 flex items-center justify-center font-heading text-crimson font-bold">⚡</div>
              <h2 className="font-heading text-xl text-crimson tracking-wider">Transitional: Heaven's Blight Tribulations</h2>
            </div>
            <div className="gradient-card border-l-2 border-crimson border border-border rounded-lg p-6">
              <h3 className="font-heading text-lg text-crimson tracking-wider mb-2">Heaven's Blight (1–5)</h3>
              <p className="text-foreground/80 font-body mb-2">A series of 5 tribulations that must be survived to open the Void Gate. Each tribulation tests the cultivator's mastery over laws.</p>
              <p className="text-sm text-muted-foreground font-body">Only those who survive all five can attempt to enter the Third Step.</p>
            </div>
          </div>

          {/* Third Step */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center font-heading text-primary-foreground font-bold">3</div>
              <h2 className="font-heading text-2xl text-primary tracking-wider">Third Step: The Dao</h2>
            </div>
            <p className="text-foreground/70 font-body mb-6">
              The stage where a cultivator masters their own Dao Essence. From Nirvana Void through Grand Empyrean — achieving complete Dao mastery.
            </p>
            <div className="relative">
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-crimson" />
              <div className="space-y-4">
                {thirdStepRealms.map((realm, i) => (
                  <motion.div
                    key={realm.name}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="relative pl-16 md:pl-20"
                  >
                    <div className="absolute left-4 md:left-6 top-5 w-4 h-4 rounded-full border-2 border-primary bg-background z-10" />
                    <div className="gradient-card border-l-2 border-primary border border-border rounded-lg p-5">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                        <h3 className="font-heading text-base text-primary tracking-wider">{realm.name}</h3>
                        <span className="text-[10px] font-heading text-muted-foreground tracking-wider">POWER: {realm.power}/100</span>
                      </div>
                      <p className="text-foreground/80 font-body text-sm leading-relaxed mb-2">{realm.desc}</p>
                      <p className="text-xs text-muted-foreground font-body"><strong>Abilities:</strong> {realm.abilities}</p>
                      {realm.known && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {realm.known.map((k) => (
                            <span key={k} className="text-[10px] font-body px-2 py-0.5 rounded bg-primary/10 text-primary">{k}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Fourth Step */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center font-heading text-lg text-primary-foreground font-bold">4</div>
              <h2 className="font-heading text-3xl text-primary tracking-wider">Fourth Step: Beyond the Dao</h2>
            </div>
            <div className="gradient-card border-2 border-primary/30 rounded-lg p-8 glow-gold">
              <h3 className="font-heading text-2xl text-primary tracking-wider mb-4 text-center">Heaven Trampling (Ta Tian)</h3>
              <p className="text-foreground/80 font-body text-lg leading-relaxed mb-6 text-center">
                The ultimate peak reached after crossing the <strong className="text-primary">Nine Heaven Trampling Bridges</strong>. 
                Only Wang Lin is known to have achieved this through integration of all Ancient Races (God, Demon, Devil) and mastering 14 Essences.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-heading text-sm text-primary tracking-wider mb-2">Requirements</h4>
                  <ul className="space-y-1 text-sm text-foreground/70 font-body">
                    <li>• Cross Nine Heaven Trampling Bridges</li>
                    <li>• Master multiple Essences (Wang Lin: 14)</li>
                    <li>• Integrate Ancient Races (God, Demon, Devil)</li>
                    <li>• Defy the Heavenly Dao itself</li>
                  </ul>
                </div>
                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-heading text-sm text-primary tracking-wider mb-2">Abilities</h4>
                  <ul className="space-y-1 text-sm text-foreground/70 font-body">
                    <li>• Multiverse manipulation</li>
                    <li>• Complete transcendence</li>
                    <li>• Existence beyond all classification</li>
                    <li>• Power over life, death, and reincarnation</li>
                  </ul>
                </div>
              </div>
              <div className="text-center">
                <span className="inline-block text-xs font-heading text-muted-foreground tracking-wider uppercase mb-2">Known Cultivators</span>
                <div className="flex justify-center gap-2">
                  <span className="text-sm font-body px-3 py-1 rounded gradient-gold text-primary-foreground">Wang Lin (The God)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wang Lin's Journey */}
          <div>
            <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Wang Lin's Cultivation Journey</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-jade via-primary to-crimson" />
              <div className="space-y-6">
                {wangLinJourney.map((stage, i) => (
                  <motion.div
                    key={stage.stage}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-16"
                  >
                    <div className="absolute left-3 top-4 w-6 h-6 rounded-full gradient-gold flex items-center justify-center text-xs font-heading text-primary-foreground font-bold z-10">
                      {i + 1}
                    </div>
                    <div className="gradient-card border border-border rounded-lg p-5">
                      <h3 className="font-heading text-sm text-primary tracking-wider mb-2">{stage.stage}</h3>
                      <p className="text-foreground/70 font-body text-sm">{stage.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CultivationPage;
