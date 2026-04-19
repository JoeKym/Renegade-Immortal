import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";

// ========== THE ERGENVERSE NOVELS ==========
const novels = [
  {
    name: "Pursuit of the Truth",
    short: "PoT • Xun Qin Ji • Prequel",
    timeline: "Epochs before Renegade Immortal",
    protagonist: "Su Ming",
    desc: "Set epochs before Renegade Immortal, this novel introduces the Immortal Clan. The events and powers established here create the foundation that Wang Lin eventually encounters in his own story.",
    wangLinConnection: "Immortal Clan origins",
    entities: ["Su Ming", "Immortal Clan", "Dark Mountain Tribe", "Dao Spirit"],
  },
  {
    name: "Renegade Immortal",
    short: "Xian Ni • Primary Universe",
    timeline: "Central timeline",
    protagonist: "Wang Lin",
    desc: "The primary universe where Wang Lin's journey from mortal to Heaven Trampling begins. This world introduces the Dao system, Ancient Races (God/Demon/Devil), and the foundational rules of the Ergenverse cultivation.",
    wangLinConnection: "The God / Master Demon — Pinnacle 4th Step being",
    entities: ["Wang Lin", "Ancient Gods", "Ancient Demons", "Ancient Devils", "14 Essences"],
  },
  {
    name: "I Shall Seal the Heavens",
    short: "ISSTH • Xian Ni sequel connection",
    timeline: "After Wang Lin's transcendence",
    protagonist: "Meng Hao",
    desc: "Meng Hao's journey takes place in a universe where Wang Lin's influence is already established. The Slaughter Essence clone of Wang Lin appears to teach Meng Hao spatial bending techniques.",
    wangLinConnection: "Slaughter Clone teaches Meng Hao; severed Allheaven's finger",
    entities: ["Meng Hao", "Allheaven", "The God (Wang Lin)", "Heavenly Dao"],
  },
  {
    name: "A Will Eternal",
    short: "AWE • Eternal Lands",
    timeline: "Parallel to other universes",
    protagonist: "Bai Xiaochun",
    desc: "Bai Xiaochun's universe exists in the Eternal Lands, sealed by legendary figures including Wang Lin. While Wang Lin doesn't appear directly, he is mentioned as one of the four legendary beings (God, Devil, Ghost, Demon).",
    wangLinConnection: "One of four legendary beings who sealed Eternal Lands",
    entities: ["Bai Xiaochun", "The God (Wang Lin)", "The Devil", "The Ghost", "The Demon"],
  },
  {
    name: "A World Worth Protecting",
    short: "AWWP • Wang Baole's story",
    timeline: "After Wang Lin's full transcendence",
    protagonist: "Wang Baole",
    desc: "Wang Lin features most prominently here among all his cameos. He is the father of the female lead (Wang Baole's love interest). Wang Lin duels with Bai Xiaochun, showcasing his power as a transcendent being.",
    wangLinConnection: "Father of female lead; duels Bai Xiaochun",
    entities: ["Wang Baole", "Wang Lin (The God)", "Bai Xiaochun", "Wang Lin's Daughter"],
  },
];

// ========== WANG LIN'S CAMEOS & CONNECTIONS ==========
const cameos = [
  {
    novel: "I Shall Seal the Heavens",
    appearance: "The Slaughter Clone",
    details: "Wang Lin's Slaughter Essence clone appears and assists Meng Hao, teaching him spatial bending techniques. This demonstrates Wang Lin's ability to project aspects of himself across universes.",
    impact: "Direct mentorship of Meng Hao"
  },
  {
    novel: "I Shall Seal the Heavens",
    appearance: "Allheaven's Finger",
    details: "Wang Lin is famously known for severing a finger of Allheaven, significantly weakening the entity before Meng Hao's time. This is referenced as a legendary feat across the multiverse.",
    impact: "Weakened main villain before Meng Hao's era"
  },
  {
    novel: "A Will Eternal",
    appearance: "Mentioned as 'The God'",
    details: "Wang Lin is mentioned as one of the legendary figures (God, Devil, Ghost, Demon) who sealed the Eternal Lands to prevent the rise of a new Allheaven. His presence is felt though he doesn't physically appear.",
    impact: "Cosmic-level seal on Eternal Lands"
  },
  {
    novel: "A World Worth Protecting",
    appearance: "Father of Female Lead",
    details: "Wang Lin features most prominently here. He is the father of Wang Baole's love interest. At one point, he engages in a duel with Bai Xiaochun (from AWE), showcasing his transcendent power.",
    impact: "Most direct cameo; family connection established"
  },
];

// ========== KEY UNIVERSAL CONCEPTS ==========
const universalConcepts = [
  {
    concept: "Four Steps of Cultivation",
    desc: "The cultivation system spanning all Er Gen novels. Wang Lin's final realm, Heaven Trampling, represents the 4th Step, allowing him to exist outside standard space-time and interact with other MCs across universes.",
    significance: "Wang Lin reached 4th Step — pinnacle of power"
  },
  {
    concept: "Heaven Trampling (Ta Tian)",
    desc: "The ultimate cultivation realm achieved by crossing the Nine Heaven Trampling Bridges. Enables existence beyond standard space-time and interaction with other universes and timelines.",
    significance: "Wang Lin achieved this; can traverse multiverse"
  },
  {
    concept: "Immortal Astral Continent",
    desc: "A massive continent divided into Celestial Clan and Ancient Clan regions. Serves as a major setting in Renegade Immortal and is referenced in later books as a core part of the Vast Expanse cosmology.",
    significance: "Central location in the greater multiverse"
  },
  {
    concept: "Legacy Items",
    desc: "Items from Wang Lin's journey occasionally appear or are found by later protagonists. These include mysterious black scrolls and bottles that carry his power and essence.",
    significance: "Physical proof of Wang Lin's multiverse influence"
  },
  {
    concept: "The God / Master Demon",
    desc: "Wang Lin is recognized across the Ergenverse as 'The God' or sometimes 'Master Demon' — one of the pinnacle beings who reached the 4th Step. His name carries authority across all realities.",
    significance: "Wang Lin's universal recognition and status"
  }
];

// ========== PROTAGONIST POWER LEVELS ==========
const protagonistPowers = [
  { name: "Su Ming (Pursuit of Truth)", step: "4th Step", status: "Reached pinnacle before Wang Lin", connection: "Immortal Clan origins" },
  { name: "Wang Lin (Renegade Immortal)", step: "4th Step — Heaven Trampling", status: "The God / Master Demon", connection: "Central multiverse anchor" },
  { name: "Meng Hao (ISSTH)", step: "4th Step", status: "Benefited from Wang Lin's weakening of Allheaven", connection: "Taught by Wang Lin's Slaughter Clone" },
  { name: "Bai Xiaochun (AWE)", step: "4th Step", status: "One of four legendary beings with Wang Lin", connection: "Sealed Eternal Lands together; dueled Wang Lin" },
  { name: "Wang Baole (AWWP)", step: "4th Step", status: "Love interest is Wang Lin's daughter", connection: "Father-in-law relationship with Wang Lin" },
];

const MultiversePage = () => {
  return (
    <Layout>
      <PageHero title="The Ergenverse" subtitle="Wang Lin in the connected multiverse of Er Gen's novels" />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Intro */}
          <div className="gradient-card border border-border rounded-lg p-8 mb-12">
            <p className="font-body text-foreground/80 text-lg leading-relaxed mb-4">
              Wang Lin, the protagonist of Renegade Immortal, is a central figure in the <strong className="text-primary">"Ergenverse"</strong> — 
              a shared multiverse connecting all of author Er Gen's works. He is recognized as <strong className="text-primary">"The God"</strong> 
              (or sometimes "Master Demon") and is one of the pinnacle beings who reached the <strong className="text-primary">4th Step</strong> of cultivation.
            </p>
            <p className="font-body text-foreground/80 leading-relaxed">
              His influence and physical presence appear across several novels in the timeline, from prequels set epochs before his birth 
              to stories where he appears as a transcendent mentor or family patriarch.
            </p>
          </div>

          {/* The Novels */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">The Novels of the Ergenverse</h2>
          <div className="space-y-4 mb-16">
            {novels.map((novel, i) => (
              <motion.div
                key={novel.name}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="gradient-card border border-border rounded-lg p-6 border-l-2 border-l-primary"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-heading text-lg text-primary tracking-wider">{novel.name}</h3>
                    <p className="text-xs text-muted-foreground font-body">{novel.short}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-heading text-foreground/60 tracking-wider">Protagonist</p>
                    <p className="text-sm font-body text-foreground/80">{novel.protagonist}</p>
                  </div>
                </div>
                <p className="text-foreground/80 font-body text-sm leading-relaxed mb-3">{novel.desc}</p>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-heading text-muted-foreground tracking-wider">Timeline:</span>
                  <span className="text-xs font-body px-2 py-0.5 rounded bg-primary/10 text-primary">{novel.timeline}</span>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg mb-3">
                  <span className="text-xs font-heading text-primary tracking-wider">Wang Lin Connection:</span>
                  <p className="text-sm font-body text-foreground/70 mt-1">{novel.wangLinConnection}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs font-heading text-muted-foreground tracking-wider">Key Entities:</span>
                  {novel.entities.map((e) => (
                    <span key={e} className="text-xs font-body px-2 py-0.5 rounded border border-primary/20 text-primary/80">{e}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Protagonist Power Comparison */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Protagonist Power Levels</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-16">
            {protagonistPowers.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`gradient-card border border-border rounded-lg p-5 ${p.name.includes("Wang Lin") ? "border-l-2 border-l-primary glow-gold" : ""}`}
              >
                <h3 className="font-heading text-sm text-primary tracking-wider mb-1">{p.name}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Realm:</span> <span className="text-foreground/80 font-body">{p.step}</span></p>
                  <p><span className="text-muted-foreground">Status:</span> <span className="text-foreground/80 font-body">{p.status}</span></p>
                  <p><span className="text-muted-foreground">Wang Lin Link:</span> <span className="text-foreground/80 font-body">{p.connection}</span></p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Wang Lin's Cameos */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Wang Lin's Cross-Novel Appearances</h2>
          <div className="space-y-4 mb-16">
            {cameos.map((cameo, i) => (
              <motion.div
                key={`${cameo.novel}-${cameo.appearance}`}
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="gradient-card border border-border rounded-lg p-6 border-l-2 border-l-crimson"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-heading text-muted-foreground tracking-wider">{cameo.novel}</span>
                  <span className="w-1 h-1 rounded-full bg-crimson" />
                  <h3 className="font-heading text-base text-crimson tracking-wider">{cameo.appearance}</h3>
                </div>
                <p className="text-foreground/80 font-body text-sm leading-relaxed mb-3">{cameo.details}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-heading text-muted-foreground tracking-wider">Impact:</span>
                  <span className="text-xs font-body text-primary">{cameo.impact}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Universal Concepts */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Key Universal Concepts</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-16">
            {universalConcepts.map((concept, i) => (
              <motion.div
                key={concept.concept}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="gradient-card border border-border rounded-lg p-5"
              >
                <h3 className="font-heading text-sm text-primary tracking-wider mb-2">{concept.concept}</h3>
                <p className="text-foreground/80 font-body text-sm leading-relaxed mb-3">{concept.desc}</p>
                <div className="p-2 bg-jade/10 rounded">
                  <p className="text-xs font-body text-jade">{concept.significance}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* The Ultimate Truth */}
          <div className="gradient-card border-2 border-primary/30 rounded-lg p-8 text-center glow-gold">
            <h2 className="font-heading text-2xl text-primary tracking-wider mb-4">
              "The God's Real Name is Wang Lin"
            </h2>
            <p className="font-body text-foreground/80 leading-relaxed mb-6">
              This famous statement from the Ergenverse reveals a profound truth: Upon achieving the Fourth Step (Heaven Trampling), 
              Wang Lin becomes a cosmic entity known simply as <strong className="text-primary">"The God"</strong> — the being that:
            </p>
            <ul className="space-y-2 text-left max-w-2xl mx-auto">
              {[
                "Exists across all universes within the Ergenverse simultaneously",
                "Can project clones and essences to mentor or influence other protagonists",
                "Maintains cosmic balance between creation and destruction across multiverse",
                "Sets the fundamental rules by which all other cultivators must abide",
                "Exists beyond linear time, able to influence past, present, and future",
                "Transcended even the Ancient Races, rendering them as lesser beings",
                "Serves as the central anchor connecting all of Er Gen's stories together"
              ].map((p) => (
                <li key={p} className="text-sm text-foreground/80 font-body flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MultiversePage;
