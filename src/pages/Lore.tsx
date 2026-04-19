import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { ChevronDown } from "lucide-react";

// ========== COSMOLOGY & GEOGRAPHY ==========
const cosmology = [
  {
    term: "Cave World",
    def: "The primary setting of Xian Ni, consisting of the Sealed and Outer Realms, along with five major Star Systems. The universe Wang Lin originates from before reaching the Immortal Astral Continent."
  },
  {
    term: "Sealed Realm",
    def: "The Inner Realm within the Cave World, sealed off by the Realm-Sealing Venerable's Great Sealed Formation. Contains the Alliance and Allheaven Star Systems. Wang Lin becomes its Lord."
  },
  {
    term: "Outer Realm",
    def: "The world outside the Great Sealed Formation, controlled by the Seven Colored Sovereign. The antagonist domain in the Inner vs. Outer Realm War."
  },
  {
    term: "Star Systems",
    def: "Five major systems: Alliance, Allheaven (Luotian), Cloud Sea, Brilliant Void, and others. Each contains multiple planets and cultivation powers."
  },
  {
    term: "Ancient Celestial Realm",
    def: "A legendary realm that collapsed, leaving behind powerful legacies and domains (Thunder, Wind, Rain, Lightning). Fragmented worlds that cultivators explore."
  },
  {
    term: "Immortal Astral Continent",
    def: "The setting of the later books. A massive continent above the Cave World, divided into Celestial Clan and Ancient Clan regions. Where Wang Lin achieves Heaven Trampling."
  },
  {
    term: "The Vast Expanse",
    def: "The greater multiverse encompassing all universes in Er Gen's novels. The Immortal Astral Continent is a core part of this cosmology."
  }
];

// ========== FUNDAMENTAL FORCES ==========
const fundamentalForces = [
  {
    term: "Heavenly Will (Dao of Heaven)",
    def: "The all-encompassing force that governs the natural order, fate, and the laws of the universe. Often personified as an antagonistic force Wang Lin must defy."
  },
  {
    term: "Law",
    def: "The absolute rules of the universe that high-level cultivators attempt to grasp and control. Natural laws can be comprehended, manipulated, and eventually shattered."
  },
  {
    term: "Essence",
    def: "Concentrated forms of power categorized into Corporeal (Fire, Water, Earth, Wood, Metal), Special (Slaughter, Restriction), and Ethereal (Life/Death, Karma, True/False, etc.)."
  },
  {
    term: "Origin Energy",
    def: "Energy that replaces celestial energy in higher realms. Cultivators must undergo Yin-Yang transformation to utilize Origin Energy."
  },
  {
    term: "Celestial Energy",
    def: "Energy used in early-to-mid cultivation stages. Eventually replaced by Origin Energy as cultivators advance."
  },
  {
    term: "Joss Flame",
    def: "Faith-based power from worshippers. Higher-level cultivators fuse with their Joss Flame Realm to advance."
  }
];

// ========== CULTIVATION TERMINOLOGY ==========
const cultivationTerms = [
  {
    term: "Cultivation Stages",
    def: "Includes paths for Celestial Clan (Qi Condensation → Foundation → Core → Nascent Soul → Soul Formation → Soul Transformation → Ascendant → Yin-Yang → Nirvana → Heaven's Blight → Void → 4th Step), Ancient Clan (Stars system), and Demon Crystals."
  },
  {
    term: "Domain",
    def: "A manifestation of a cultivator's understanding of the world. Examples: Life and Death Domain, Slaughter Domain, Karma Domain. Formed at Soul Formation stage."
  },
  {
    term: "The Three Realms",
    def: "The traditional structure divided into Heaven (celestial realm), Mortal (human world), and Earth/Underworld (death realm). Wang Lin traverses all three."
  },
  {
    term: "Ji Realm",
    def: "A mythical 'taboo' state where spiritual energy/divine sense turns red. Allows killing cultivators at same level or below instantly. Limits future progression but grants immense combat power."
  },
  {
    term: "Heaven Defying",
    def: "Cultivation that deliberately violates heavenly law. Those who practice it become hunted but gain unprecedented freedom and power."
  },
  {
    term: "Tribulation",
    def: "Heavenly tests during breakthroughs. Heaven's Blight (1-5) for Void Gate, Arcane Tribulations (9) for Void Tribulant. Heaven-defying cultivators face deadlier tribulations."
  },
  {
    term: "Immortal",
    def: "A being who has transcended mortality. In Xian Ni, true immortality requires reaching the Fourth Step/Heaven Trampling."
  },
  {
    term: "True Body",
    def: "Physical manifestations of comprehended Daos. Wang Lin has Five Elements True Body and Slaughter True Body."
  }
];

// ========== SPECIES & RACES ==========
const species = [
  {
    term: "Ancient Gods",
    def: "One of three primordial races. Embody order, creation, and celestial authority. Power measured in stars on forehead (1-9, with Tu Si being 8-star). Wang Lin achieves 27-Star Dao Ancient God status."
  },
  {
    term: "Ancient Demons",
    def: "One of three primordial races. Represent chaos mixed with intelligence and instinct. Tou Sen represents this race's pinnacle."
  },
  {
    term: "Ancient Devils",
    def: "One of three primordial races. Embody pure chaos and destruction. Most destructive of the three races."
  },
  {
    term: "Forsaken Immortal Tribe",
    def: "A tribe Wang Lin encounters. His disciple Thirteen originates from here."
  },
  {
    term: "Celestial Clan",
    def: "Major faction on the Immortal Astral Continent. Follows celestial cultivation methods."
  },
  {
    term: "Ancient Clan",
    def: "Major faction on the Immortal Astral Continent. Follows Ancient God/Demon/Devil bloodline cultivation."
  },
  {
    term: "Heavenly Dao Avatars",
    def: "Beings representing the will of the universe itself. Allheaven is a weakened clone from the wider universe."
  }
];

// ========== BASE GLOSSARY ==========
const glossary = [
  { term: "Dao", def: "The fundamental law or way of existence. A complete understanding of a principle. Cultivators forge or inherit Daos to gain power and transcend mortal limitations." },
  { term: "Cultivation", def: "The process of refining one's body, soul, and spirit through meditation and practice. Cultivators advance through various realms and stages." },
  { term: "Transcendence", def: "The ultimate goal of cultivation — to transcend mortal existence and the laws of the universe itself. Wang Lin achieves this at Fourth Step." },
  { term: "Ancient God", def: "One of the three primordial races. Embody order, creation, and celestial authority. Power shown by forehead stars." },
  { term: "Ancient Demon", def: "One of the three primordial races. Represent chaos, instinct, and strength tempered with intelligence." },
  { term: "Ancient Devil", def: "One of the three primordial races. Embody pure chaos and destruction." },
  { term: "Heaven", def: "The cosmic law and order that governs all existence. Enforces celestial rules and punishes those who defy it. Wang Lin's ultimate antagonist." },
  { term: "The Ancient Order", def: "A mysterious entity or collective that transcends individual universes. Connected to Wang Lin's transcendent state as 'The God'." },
  { term: "Tribulation", def: "A heavenly test that cultivators must overcome during breakthrough moments. Surviving grants power and progression." },
  { term: "Spirit Vessel", def: "A cultivator's internal energy reservoir and cultivation foundation. Stores spiritual/celestial/origin energy." },
  { term: "Realm / Stage", def: "Levels of cultivation power. Progression through realms represents increasing mastery of Daos and laws." },
  { term: "Immortal", def: "A being who has transcended mortality and can live indefinitely. True immortality requires Fourth Step." },
];

const powerScale = [
  { label: "Mortal (Early Game)", power: 1 },
  { label: "Qi Condensation", power: 5 },
  { label: "Foundation Establishment", power: 10 },
  { label: "Core Formation", power: 20 },
  { label: "Nascent Soul", power: 30 },
  { label: "Soul Formation", power: 40 },
  { label: "Ascendant", power: 50 },
  { label: "Illusory Yin / Corporeal Yang", power: 60 },
  { label: "Nirvana Scryer/Cleanser/Shatterer", power: 70 },
  { label: "Heaven's Blight", power: 75 },
  { label: "Void Tribulant (3rd Step)", power: 85 },
  { label: "Grand Empyrean", power: 95 },
  { label: "TRANSCENDENT (4th Step)", power: 100 },
];

const faqs = [
  { q: "What is the difference between Wuxia, Xianxia, and Xuanhuan?", a: "Wuxia focuses on martial heroes without supernatural powers; Xianxia (like Xian Ni) involves immortals, magic, and cultivation to transcend mortality; Xuanhuan blends Chinese mythology with foreign fantasy elements." },
  { q: "Who is the protagonist of Renegade Immortal?", a: "Wang Lin, an ordinary young man from a small village who 'cultivates against immortality' to defy fate and protect his loved ones. He rises from mortal to the 4th Step (Heaven Trampling)." },
  { q: "How long is the novel?", a: "The completed novel consists of 2,088 chapters divided into 13 books. It covers Wang Lin's journey from mortal to transcendent being across thousands of years." },
  { q: "Is the story 'dark'?", a: "Yes, Xian Ni is often described as more depressing and 'rage-inducing' compared to other works by Er Gen. It focuses on Wang Lin's grim determination against constant adversity, loss, and betrayal." },
  { q: "Why isn't Wang Lin called 'The God' in the early story?", a: "Wang Lin only becomes 'The God' upon achieving the Fourth Step (Heaven Trampling). During his journey, he is still ascending. The title is a future state — he IS the God, but only after transcendence reshapes his existence." },
  { q: "What's the difference between god, demon, and devil?", a: "Ancient Gods represent order and creation. Ancient Demons represent chaos mixed with intelligence. Ancient Devils represent pure chaos and destruction. Wang Lin's integration of all three creates a unique balance." },
  { q: "How does Wang Lin forge new Daos when others inherit them?", a: "Most cultivators inherit Daos from lineages or masters. Wang Lin creates Daos from scratch through understanding, desperation, and genius — making them far more compatible with his cultivation and allowing him to master 14 Essences." },
  { q: "What makes Wang Lin's transcendence different?", a: "He integrates all three Ancient Races, achieves heaven-defying cultivation that breaks cosmic law, exists across multiple universes simultaneously, and becomes 'The God' that maintains cosmic balance." },
  { q: "Can other beings achieve transcendence like Wang Lin?", a: "While theoretically possible, Wang Lin's particular achievement — integrating all three Ancient Races combined with mortal-origin foundation and 14 forged Daos — appears unique. Other Er Gen protagonists (Su Ming, Meng Hao, Bai Xiaochun) also reach 4th Step through different paths." },
  { q: "What is the Cave World?", a: "The Cave World is the primary setting of Xian Ni, consisting of the Sealed and Outer Realms with five major Star Systems. It's the universe Wang Lin originates from before reaching the Immortal Astral Continent." },
  { q: "What are the Three Realms?", a: "The traditional structure of the universe divided into Heaven (celestial realm), Mortal (human world), and Earth/Underworld (death realm). Wang Lin traverses all three realms throughout his journey." },
  { q: "What is the Ji Realm?", a: "A mythical 'taboo' state where spiritual energy/divine sense turns red. It allows killing cultivators at the same level or below instantly with just a look. It limits future progression but grants immense combat power." },
];

const concepts = [
  { title: "Heaven-Defying Cultivation", desc: "A path that deliberately violates heavenly law. Those who practice it become hunted by heaven but gain unprecedented freedom and power to shape their own destiny." },
  { title: "Dao Fusion & Integration", desc: "Merging multiple Daos into a cohesive system. Wang Lin's ability to fuse 14 incompatible Essences is unprecedented in the history of cultivation." },
  { title: "Ancient Race Absorption", desc: "Absorbing the essence of Ancient God, Demon, and Devil. Grants access to those races' power but risks overwhelming the cultivator. Wang Lin uniquely balances all three." },
  { title: "Tribulation Navigation", desc: "Surviving heavenly tribulations during breakthroughs. Heaven-defying cultivators face deadlier tribulations including Heaven's Blight (1-5) and nine Arcane Tribulations." },
  { title: "Soul Cultivation", desc: "Refining and strengthening one's soul essence through Nascent Soul and Soul Formation stages. A stronger soul allows for greater Dao integration and Essence mastery." },
  { title: "The Four Steps", desc: "The cultivation system spanning all Er Gen novels: 1st Step (mortal foundation), 2nd Step (law comprehension), 3rd Step (Dao mastery), 4th Step (transcendence/Heaven Trampling)." },
  { title: "The Ergenverse", desc: "The shared multiverse connecting all Er Gen novels. Wang Lin appears as 'The God' across Pursuit of Truth, I Shall Seal the Heavens, A Will Eternal, and A World Worth Protecting." },
];

const LorePage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <PageHero title="Lore Notes & Glossary" subtitle="Comprehensive guide to Xian Ni's cosmology, terminology, and FAQs" />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Intro */}
          <div className="gradient-card border border-border rounded-lg p-8 mb-12">
            <p className="font-body text-foreground/80 text-lg leading-relaxed mb-4">
              The lore of <strong className="text-primary">Xian Ni (Renegade Immortal)</strong> is extensively documented across community hubs and wikis. 
              This page compiles the major concepts, cosmology, glossary terms, and frequently asked questions from the series' documentation.
            </p>
            <p className="font-body text-foreground/80 leading-relaxed">
              The series is known for its intricate systems governing the vast universe, from the Cave World to the Immortal Astral Continent, 
              and Wang Lin's heaven-defying journey through it all.
            </p>
          </div>

          {/* Cosmology & Geography */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Cosmology & Geography</h2>
          <div className="grid md:grid-cols-2 gap-3 mb-16">
            {cosmology.map((c) => (
              <div key={c.term} className="gradient-card border border-border rounded-lg p-5 border-l-2 border-l-jade">
                <h3 className="font-heading text-sm text-primary tracking-wider mb-1">{c.term}</h3>
                <p className="text-foreground/70 font-body text-sm leading-relaxed">{c.def}</p>
              </div>
            ))}
          </div>

          {/* Fundamental Forces */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Fundamental Forces</h2>
          <div className="grid md:grid-cols-2 gap-3 mb-16">
            {fundamentalForces.map((f) => (
              <div key={f.term} className="gradient-card border border-border rounded-lg p-5 border-l-2 border-l-primary">
                <h3 className="font-heading text-sm text-primary tracking-wider mb-1">{f.term}</h3>
                <p className="text-foreground/70 font-body text-sm leading-relaxed">{f.def}</p>
              </div>
            ))}
          </div>

          {/* Cultivation Terms */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Cultivation Terminology</h2>
          <div className="grid md:grid-cols-2 gap-3 mb-16">
            {cultivationTerms.map((ct) => (
              <div key={ct.term} className="gradient-card border border-border rounded-lg p-5 border-l-2 border-l-crimson">
                <h3 className="font-heading text-sm text-primary tracking-wider mb-1">{ct.term}</h3>
                <p className="text-foreground/70 font-body text-sm leading-relaxed">{ct.def}</p>
              </div>
            ))}
          </div>

          {/* Species */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Species & Races</h2>
          <div className="grid md:grid-cols-2 gap-3 mb-16">
            {species.map((s) => (
              <div key={s.term} className="gradient-card border border-border rounded-lg p-5 border-l-2 border-l-primary">
                <h3 className="font-heading text-sm text-primary tracking-wider mb-1">{s.term}</h3>
                <p className="text-foreground/70 font-body text-sm leading-relaxed">{s.def}</p>
              </div>
            ))}
          </div>

          {/* Base Glossary */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Core Glossary</h2>
          <div className="grid md:grid-cols-2 gap-3 mb-16">
            {glossary.map((g) => (
              <div key={g.term} className="gradient-card border border-border rounded-lg p-5">
                <h3 className="font-heading text-sm text-primary tracking-wider mb-1">{g.term}</h3>
                <p className="text-foreground/70 font-body text-sm leading-relaxed">{g.def}</p>
              </div>
            ))}
          </div>

          {/* Power Scaling */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Power Scaling Chart</h2>
          <div className="space-y-3 mb-16">
            {powerScale.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="gradient-card border border-border rounded-lg p-4"
              >
                <div className="flex justify-between mb-2">
                  <span className={`font-heading text-sm tracking-wider ${s.power === 100 ? "text-primary" : "text-foreground"}`}>
                    {s.label}
                  </span>
                  <span className="text-xs text-primary font-heading">
                    {s.power === 100 ? "∞/∞" : `${s.power}/100`}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.power}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${s.power === 100 ? "gradient-gold" : "bg-primary/60"}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQs */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Frequently Asked Questions</h2>
          <div className="space-y-2 mb-16">
            {faqs.map((faq, i) => (
              <div key={i} className="gradient-card border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <h3 className="font-heading text-sm text-foreground tracking-wider pr-4">{faq.q}</h3>
                  <ChevronDown className={`text-primary shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} size={16} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-foreground/70 font-body text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Advanced Concepts */}
          <h2 className="font-heading text-2xl text-primary text-center mb-8 tracking-wider">Advanced Cultivation Concepts</h2>
          <div className="space-y-3">
            {concepts.map((c) => (
              <div key={c.title} className="gradient-card border border-border rounded-lg p-6">
                <h3 className="font-heading text-sm text-primary tracking-wider mb-2">{c.title}</h3>
                <p className="text-foreground/70 font-body text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LorePage;
