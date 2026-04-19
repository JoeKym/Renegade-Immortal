import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";

// ========== FIRST STEP: MORTAL PLANETS AND SEALED WORLD ==========
const firstStepArcs = [
  {
    num: "1.1",
    title: "Zhao Country — The Beginning",
    desc: "A low-level cultivation country on Planet Suzaku. Wang Lin joins the Hengyue Sect, discovers the Heaven Defying Bead, and begins his cultivation journey. The arc culminates in his quest for revenge against the Teng Family.",
    location: "Planet Suzaku • Zhao Country",
    keyEvents: ["Joined Hengyue Sect", "Found Heaven Defying Bead", "Teng Clan revenge arc"],
    characters: ["Wang Lin", "Teng Huayuan", "Situ Nan"]
  },
  {
    num: "1.2",
    title: "Sea of Devils — Rebirth",
    desc: "A chaotic region on Planet Suzaku filled with demonic cultivators. Wang Lin flees here after his family is destroyed and his body ruined. He cultivates from scratch, meets Li Muwan, and enters the Ancient God Land to gain the inheritance of 8-star Ancient God Tu Si.",
    location: "Planet Suzaku • Sea of Devils",
    keyEvents: ["Rebuilt cultivation from scratch", "Met Li Muwan", "Inherited Ancient God Tu Si power"],
    characters: ["Wang Lin", "Li Muwan", "Tu Si"]
  },
  {
    num: "1.3",
    title: "Planet Suzaku — Unification",
    desc: "The entire home planet of Wang Lin. The Soul Formation arc where Wang Lin experiences 'mortal life' for a century to gain enlightenment, eventually becoming the Suzaku (the planet's title holder) — the highest authority on Planet Suzaku.",
    location: "Planet Suzaku",
    keyEvents: ["Lived as mortal for 100 years", "Formed Life/Death Domain", "Became Suzaku title holder"],
    characters: ["Wang Lin", "Planet Suzaku Powers"]
  }
];

// ========== SECOND STEP: THE STAR DOMAINS (INNER REALM) ==========
const secondStepArcs = [
  {
    num: "2.1",
    title: "Celestial Realms — Fragmented Worlds",
    desc: "Fragmented worlds that once belonged to the Ancient Celestial Realm (Thunder, Wind, Rain, and Lightning Celestial Realms). Wang Lin explores the Thunder Immortal World, meets the mad Immortal Lord Qing Shui, and discovers the truth behind the collapse of the Celestial Realm.",
    location: "Ancient Celestial Realm Fragments",
    keyEvents: ["Explored Thunder Immortal World", "Met Immortal Lord Qing Shui", "Learned Celestial Realm collapse truth"],
    characters: ["Wang Lin", "Immortal Lord Qing Shui", "Ancient Celestial Remnants"]
  },
  {
    num: "2.2",
    title: "All-Heaven (Luotian) Star System",
    desc: "A rival star system to the Alliance. Wang Lin gains fame here as a 'True Thunder Immortal,' participates in the Yao Family conflict, and battles the Moon Gazing Beast. This is where he truly establishes his name in the Inner Realm.",
    location: "All-Heaven Star System",
    keyEvents: ["Became True Thunder Immortal", "Yao Family conflict", "Battled Moon Gazing Beast"],
    characters: ["Wang Lin", "Yao Family", "Moon Gazing Beast"]
  }
];

// ========== THIRD STEP: THE VOID AND OUTER REALM ==========
const thirdStepArcs = [
  {
    num: "3.1",
    title: "Cloud Sea Star System — Hidden Fog",
    desc: "A hidden star system filled with powerful fog-dwelling beasts. Wang Lin poses as a low-level disciple in the Guiyuan Sect, reaches the Nirvana Cleanser stage, and becomes the God of the Cloud Sea — establishing absolute dominance.",
    location: "Cloud Sea Star System",
    keyEvents: ["Joined Guiyuan Sect undercover", "Achieved Nirvana Cleanser", "Became God of Cloud Sea"],
    characters: ["Wang Lin", "Guiyuan Sect"]
  },
  {
    num: "3.2",
    title: "Outer Realm — The Sovereign's World",
    desc: "The world outside the Great Sealed Formation created by the Realm-Sealing Venerable. The Inner vs. Outer Realm War. Wang Lin leads the Inner Realm against the Sovereign's forces to break the seal on his universe and achieve true freedom.",
    location: "Outer Realm (Outside the Seal)",
    keyEvents: ["Led Inner Realm forces", "War against Sovereign", "Broke universe seal"],
    characters: ["Wang Lin", "Seven Colored Sovereign", "Realm-Sealing Venerable"]
  }
];

// ========== FOURTH STEP: IMMORTAL ASTRAL CONTINENT ==========
const fourthStepArcs = [
  {
    num: "4.1",
    title: "Immortal Astral Continent — Heaven Trampling",
    desc: "The highest world known in the series, located above the universe Wang Lin originated from. A massive continent divided into Celestial Clan and Ancient Clan regions. Wang Lin journeys here to find a way to resurrect Li Muwan. He climbs the Nine Heaven Trampling Bridges to reach the ultimate cultivation level: Heaven Trampling (The Fourth Step).",
    location: "Immortal Astral Continent",
    keyEvents: ["Climbed Nine Heaven Trampling Bridges", "Achieved Heaven Trampling", "Resurrected Li Muwan", "Left Cave World for greater universe"],
    characters: ["Wang Lin", "Li Muwan", "Celestial Clan", "Ancient Clan"]
  }
];

const milestones = [
  { title: "Qi Condensation", desc: "First step on cultivation path — 15 layers of spiritual energy absorption." },
  { title: "Core Formation", desc: "Formed golden core — crucial milestone that many never pass." },
  { title: "Ancient God Inheritance", desc: "Gained 8-star Ancient God Tu Si's power — transformed body and destiny." },
  { title: "Ji Realm Achieved", desc: "Taboo state allowing killing higher-level cultivators with a look." },
  { title: "Became Suzaku", desc: "Title holder of Planet Suzaku — first major planetary authority." },
  { title: "True Thunder Immortal", desc: "Gained fame across All-Heaven Star System as legendary immortal." },
  { title: "God of Cloud Sea", desc: "Absolute ruler of Cloud Sea Star System at Nirvana Cleanser stage." },
  { title: "14 Essences Master", desc: "Mastered all 14 Essences including ethereal and corporeal types." },
  { title: "Lord of Sealed Realm", desc: "Broke the seal and freed his universe from Sovereign's control." },
  { title: "Heaven Trampling", desc: "Crossed Nine Heaven Trampling Bridges — achieved Fourth Step." },
  { title: "Resurrected Li Muwan", desc: "Achieved ultimate goal that drove his entire journey." },
  { title: "Left the Cave World", desc: "Transcended his origin universe to explore the greater multiverse." }
];

interface ArcData {
  num: string;
  title: string;
  desc: string;
  location: string;
  keyEvents: string[];
  characters: string[];
}

const ArcCard = ({ arc, color }: { arc: ArcData; color: string }) => (
  <div className={`gradient-card border border-border rounded-lg p-6 hover:border-${color}/30 transition-colors border-l-2 border-l-${color}`}>
    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
      <h3 className="font-heading text-lg text-primary tracking-wider">{arc.title}</h3>
      <span className="text-xs font-heading text-muted-foreground tracking-wider">{arc.location}</span>
    </div>
    <p className="text-foreground/80 font-body text-sm leading-relaxed mb-3">{arc.desc}</p>
    <div className="mb-3">
      <span className="text-xs font-heading text-muted-foreground tracking-wider">Key Events:</span>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {arc.keyEvents.map((e) => (
          <span key={e} className="text-xs font-body px-2 py-0.5 rounded bg-muted text-foreground/70">{e}</span>
        ))}
      </div>
    </div>
    <div className="flex flex-wrap gap-1.5">
      <span className="text-xs font-heading text-muted-foreground tracking-wider">Characters:</span>
      {arc.characters.map((c) => (
        <span key={c} className="text-xs font-body px-2 py-0.5 rounded border border-primary/20 text-primary/80">{c}</span>
      ))}
    </div>
  </div>
);

const TimelinePage = () => {
  return (
    <Layout>
      <PageHero title="Story Timeline" subtitle="The Four Steps across increasingly vast geographical scopes" />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Intro */}
          <div className="gradient-card border border-border rounded-lg p-8 mb-12">
            <p className="font-body text-foreground/80 text-lg leading-relaxed mb-4">
              The narrative of Renegade Immortal is structured into <strong className="text-primary">Four Steps</strong> of cultivation, 
              where each step corresponds to increasingly vast geographical scopes — from a single mortal planet to the boundless universe and beyond.
            </p>
            <p className="font-body text-foreground/80 leading-relaxed">
              Wang Lin's journey takes him from a low-level country on Planet Suzaku, through star systems and celestial realms, 
              to the highest known world — the Immortal Astral Continent.
            </p>
          </div>

          {/* FIRST STEP */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center font-heading text-lg text-primary-foreground font-bold">1</div>
              <div>
                <h2 className="font-heading text-2xl text-primary tracking-wider">First Step: Mortal Planets</h2>
                <p className="text-foreground/60 font-body text-sm">Planet Suzaku and the Sealed World</p>
              </div>
            </div>
            <p className="text-foreground/70 font-body mb-6">
              Wang Lin's rise from a mediocre mortal to a peak expert within his home planet. From Zhao Country to becoming the Suzaku title holder.
            </p>
            <div className="relative">
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-jade via-jade/50 to-primary/30" />
              <div className="space-y-6">
                {firstStepArcs.map((arc, i) => (
                  <motion.div
                    key={arc.num}
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="relative pl-16 md:pl-20"
                  >
                    <div className="absolute left-4 md:left-6 top-6 w-4 h-4 rounded-full border-2 border-jade bg-background z-10" />
                    <ArcCard arc={arc} color="jade" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* SECOND STEP */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center font-heading text-lg text-primary-foreground font-bold">2</div>
              <div>
                <h2 className="font-heading text-2xl text-primary tracking-wider">Second Step: Star Domains</h2>
                <p className="text-foreground/60 font-body text-sm">The Inner Realm and Celestial Realms</p>
              </div>
            </div>
            <p className="text-foreground/70 font-body mb-6">
              Transcending Planet Suzaku into the broader Alliance Star System and surrounding domains. Exploring the fragmented Ancient Celestial Realm.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {secondStepArcs.map((arc, i) => (
                <motion.div
                  key={arc.num}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ArcCard arc={arc} color="primary" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* THIRD STEP */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center font-heading text-lg text-primary-foreground font-bold">3</div>
              <div>
                <h2 className="font-heading text-2xl text-primary tracking-wider">Third Step: The Void</h2>
                <p className="text-foreground/60 font-body text-sm">Outer Realm and the Sovereign's World</p>
              </div>
            </div>
            <p className="text-foreground/70 font-body mb-6">
              The peak of power within the universe, where cultivators manipulate the Source (Essence) of laws. Leading the Inner Realm against the Sovereign's forces.
            </p>
            <div className="relative">
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-crimson" />
              <div className="space-y-6">
                {thirdStepArcs.map((arc, i) => (
                  <motion.div
                    key={arc.num}
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="relative pl-16 md:pl-20"
                  >
                    <div className="absolute left-4 md:left-6 top-6 w-4 h-4 rounded-full border-2 border-primary bg-background z-10" />
                    <ArcCard arc={arc} color="primary" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* FOURTH STEP */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full gradient-gold flex items-center justify-center font-heading text-xl text-primary-foreground font-bold">4</div>
              <div>
                <h2 className="font-heading text-3xl text-primary tracking-wider">Fourth Step: Immortal Astral Continent</h2>
                <p className="text-foreground/60 font-body text-sm">Above the Universe — Heaven Trampling</p>
              </div>
            </div>
            <p className="text-foreground/70 font-body mb-6">
              The highest world known in the series. Wang Lin climbs the Nine Heaven Trampling Bridges to reach the ultimate cultivation level and resurrect Li Muwan.
            </p>
            <div className="gradient-card border-2 border-primary/30 rounded-lg p-8 glow-gold">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center font-heading text-primary-foreground font-bold shrink-0">4.1</div>
                <div>
                  <h3 className="font-heading text-xl text-primary tracking-wider mb-2">Immortal Astral Continent — Heaven Trampling</h3>
                  <p className="text-xs font-heading text-muted-foreground tracking-wider mb-2">{fourthStepArcs[0].location}</p>
                </div>
              </div>
              <p className="text-foreground/80 font-body leading-relaxed mb-4">{fourthStepArcs[0].desc}</p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-xs font-heading text-muted-foreground tracking-wider">Key Events:</span>
                  <ul className="mt-2 space-y-1">
                    {fourthStepArcs[0].keyEvents.map((e) => (
                      <li key={e} className="text-sm text-foreground/70 font-body flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-heading text-muted-foreground tracking-wider">Characters:</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {fourthStepArcs[0].characters.map((c) => (
                      <span key={c} className="text-xs font-body px-2 py-0.5 rounded border border-primary/20 text-primary/80">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <h2 className="font-heading text-2xl text-primary text-center mt-16 mb-8 tracking-wider">Heaven-Defying Milestones</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {milestones.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ y: 15, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="gradient-card border border-border rounded-lg p-5"
              >
                <h3 className="font-heading text-sm text-primary tracking-wider mb-1">{m.title}</h3>
                <p className="text-foreground/70 font-body text-sm">{m.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Power Progression */}
          <h2 className="font-heading text-2xl text-primary text-center mt-16 mb-8 tracking-wider">Power Progression</h2>
          <div className="space-y-4">
            {[
              { label: "Early Game (Foundation)", power: 1 },
              { label: "Mid Game (Expansion)", power: 30 },
              { label: "Late Game (Ascension)", power: 70 },
              { label: "Endgame (Transcendence)", power: 100 },
            ].map((stage) => (
              <div key={stage.label} className="gradient-card border border-border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-heading text-sm text-foreground tracking-wider">{stage.label}</span>
                  <span className="text-xs text-primary font-heading">{stage.power}/100</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stage.power}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full gradient-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TimelinePage;
