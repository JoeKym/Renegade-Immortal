import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Search, Sword, Wand2 } from "lucide-react";

interface ArtifactItem {
  name: string;
  type: "artifact" | "technique";
  origin: string;
  owner: string;
  power: string;
  firstAppearance: string;
  storyArc: string;
  dao?: string;
}

const items: ArtifactItem[] = [
  // ========== TREASURES ==========
  {
    name: "Heaven-Defying Bead",
    type: "artifact",
    origin: "Unknown origin, bonded to Wang Lin",
    owner: "Wang Lin",
    power: "Wang Lin's most critical treasure. Allows entry into Dream Space where time moves 10:1 ratio vs outside world. Can absorb five elements and eventually opens Gate of Emptiness leading to Dao Realm.",
    firstAppearance: "Chapter 1",
    storyArc: "The Beginning"
  },
  {
    name: "Billion Soul Flag",
    type: "artifact",
    origin: "Soul Refining Sect inheritance",
    owner: "Wang Lin",
    power: "Inherited from Soul Refining Sect. Allows control of millions of souls. One of his primary weapons during middle-stage cultivation. Can deploy devastating soul attacks.",
    firstAppearance: "Soul Refining arc",
    storyArc: "Sect Master Era"
  },
  {
    name: "Celestial Sealing Stamp",
    type: "artifact",
    origin: "Refined by divine retribution",
    owner: "Wang Lin",
    power: "Powerful artifact later integrated into spells to form the '18 Layers of Hell Reincarnation Realm'. Can seal and suppress enemies across dimensions.",
    firstAppearance: "Mid-late arcs",
    storyArc: "Celestial Techniques"
  },
  {
    name: "Karma Whip (Soul Lasher)",
    type: "artifact",
    origin: "Originally Red Butterfly's artifact",
    owner: "Wang Lin",
    power: "Originally Red Butterfly's artifact, Wang Lin nourished it with his Karma artistic conception. Strikes directly at the primordial spirit, bypassing physical defense.",
    firstAppearance: "Alliance Star System arc",
    storyArc: "Karma Dao Mastery",
    dao: "Karma"
  },
  {
    name: "Ancient God Trident",
    type: "artifact",
    origin: "Ancient God Tu Si's life treasure",
    owner: "Wang Lin",
    power: "Life treasure of Ancient God Tu Si. Channels Ancient God power for devastating attacks. Grows stronger with Wang Lin's Ancient God body.",
    firstAppearance: "Ancient God inheritance arc",
    storyArc: "Ancient God Integration"
  },
  {
    name: "God Slaying Spear",
    type: "artifact",
    origin: "Ancient God Tu Si's life treasure",
    owner: "Wang Lin",
    power: "Legendary life treasure of Ancient God Tu Si. Designed to kill Ancient God-level beings. Wang Lin's ultimate weapon for fighting higher-level cultivators.",
    firstAppearance: "Late arcs",
    storyArc: "Ancient Race conflicts"
  },
  {
    name: "Heaven-Avoiding Coffin",
    type: "artifact",
    origin: "Mysterious origin",
    owner: "Wang Lin",
    power: "Used to preserve and eventually resurrect Li Muwan. Can seal a person's life force and soul, preventing death and decay across millennia.",
    firstAppearance: "Li Muwan death arc",
    storyArc: "The Obsession with Resurrection"
  },

  // ========== STANDARD ARTIFACTS ==========
  { name: "Heaven Rending Sword", type: "artifact", origin: "Ancient battlefield", owner: "Wang Lin", power: "Capable of slicing through spatial barriers and dimensional rifts", firstAppearance: "Mid arcs", storyArc: "Outer Realm Exploration" },
  { name: "Soul Flag", type: "artifact", origin: "Underworld Dao refinement", owner: "Wang Lin", power: "Captures and binds souls, can command an army of spirits", firstAppearance: "Early arcs", storyArc: "Foundation Stage", dao: "Underworld" },
  { name: "Ancient God Leather Armor", type: "artifact", origin: "Ancient God remains", owner: "Wang Lin", power: "Provides immense physical defense, enhances Ancient God body", firstAppearance: "Ancient God arc", storyArc: "Ancient God Integration" },
  { name: "Restriction Flag", type: "artifact", origin: "Wang Lin's creation", owner: "Wang Lin", power: "Deploys sealing arrays and binding formations", firstAppearance: "Early arcs", storyArc: "Foundation Stage" },
  { name: "Celestial Sword", type: "artifact", origin: "Celestial Realm", owner: "Various sect leaders", power: "Standard high-level cultivator weapon with celestial energy", firstAppearance: "Various", storyArc: "Multiple arcs" },
  { name: "Mosquito Beast", type: "artifact", origin: "Ancient creature", owner: "Wang Lin", power: "Soul-devouring beast companion, grows stronger over time", firstAppearance: "Early arcs", storyArc: "Foundation Stage" },

  // ========== SIGNATURE TECHNIQUES ==========
  {
    name: "Ji Realm (Death Spell)",
    type: "technique",
    origin: "Taboo state achieved through extreme trauma",
    owner: "Wang Lin",
    power: "Mythical and 'taboo' state where Wang Lin's spiritual energy/divine sense turns red. Instantly kills any cultivator at his own level or below just by looking at them. Allows fighting far above his cultivation realm.",
    firstAppearance: "After Teng Clan massacre",
    storyArc: "Vengeance and Resilience"
  },
  {
    name: "Finger of Death",
    type: "technique",
    origin: "Situ Nan's Three Fingers / Underworld Dao",
    owner: "Wang Lin",
    power: "One of Situ Nan's three early celestial spells. Absorbs life force from surroundings. Later evolves to summon the Underworld River, which exists outside the cycle of reincarnation.",
    firstAppearance: "Early cultivation",
    storyArc: "Situ Nan's Training",
    dao: "Underworld"
  },
  {
    name: "Demonic Finger",
    type: "technique",
    origin: "Situ Nan's Three Fingers",
    owner: "Wang Lin",
    power: "One of Situ Nan's three incomplete celestial spells. Taints the opponent with demonic energy, corrupting their cultivation and soul.",
    firstAppearance: "Early cultivation",
    storyArc: "Situ Nan's Training"
  },
  {
    name: "Underworld Finger",
    type: "technique",
    origin: "Situ Nan's Three Fingers evolution",
    owner: "Wang Lin",
    power: "The evolved form that can summon the Underworld River from beyond reincarnation. Deals damage from a realm outside the normal cycle of life and death.",
    firstAppearance: "Mid arcs",
    storyArc: "Underworld Dao Mastery",
    dao: "Underworld"
  },

  // ========== CELESTIAL EMPEROR SPELLS ==========
  {
    name: "Call the Wind",
    type: "technique",
    origin: "Celestial Emperor Bai Fan's 6 Spells",
    owner: "Wang Lin",
    power: "Highly powerful art summoning black dragons or spears of wind that tear through space. One of Bai Fan's signature spells.",
    firstAppearance: "Alliance Star System arc",
    storyArc: "Celestial Emperor Legacy"
  },
  {
    name: "Summon the Rain",
    type: "technique",
    origin: "Celestial Emperor Bai Fan's 6 Spells",
    owner: "Wang Lin",
    power: "Destructive blue crystal drops that can erode and destroy nearly anything they touch. Devastating area-of-effect technique.",
    firstAppearance: "Alliance Star System arc",
    storyArc: "Celestial Emperor Legacy"
  },
  {
    name: "Magic Arsenal",
    type: "technique",
    origin: "Celestial Emperor Bai Fan's 6 Spells",
    owner: "Wang Lin",
    power: "Creates countless magical weapons that barrage enemies simultaneously. Overwhelming offensive capability.",
    firstAppearance: "Alliance Star System arc",
    storyArc: "Celestial Emperor Legacy"
  },
  {
    name: "Celestial Emperor Spell #4",
    type: "technique",
    origin: "Celestial Emperor Bai Fan's 6 Spells",
    owner: "Wang Lin",
    power: "One of the six powerful spells inherited from Celestial Emperor Bai Fan.",
    firstAppearance: "Alliance Star System arc",
    storyArc: "Celestial Emperor Legacy"
  },
  {
    name: "Celestial Emperor Spell #5",
    type: "technique",
    origin: "Celestial Emperor Bai Fan's 6 Spells",
    owner: "Wang Lin",
    power: "One of the six powerful spells inherited from Celestial Emperor Bai Fan.",
    firstAppearance: "Alliance Star System arc",
    storyArc: "Celestial Emperor Legacy"
  },
  {
    name: "Celestial Emperor Spell #6",
    type: "technique",
    origin: "Celestial Emperor Bai Fan's 6 Spells",
    owner: "Wang Lin",
    power: "One of the six powerful spells inherited from Celestial Emperor Bai Fan.",
    firstAppearance: "Alliance Star System arc",
    storyArc: "Celestial Emperor Legacy"
  },

  // ========== ANCIENT GOD TECHNIQUES ==========
  {
    name: "Ancient God Body",
    type: "technique",
    origin: "Ancient God Tu Si inheritance",
    owner: "Wang Lin",
    power: "Wang Lin reconstructs his body into that of an Ancient God, gaining immense physical strength. Stars on forehead represent power level. Can fight purely with physical power.",
    firstAppearance: "Ancient God arc",
    storyArc: "Ancient God Integration"
  },
  {
    name: "Ancient God Transformation",
    type: "technique",
    origin: "Ancient God bloodline",
    owner: "Wang Lin",
    power: "Transforms into Ancient God form with increased size, strength, and power. Forehead stars glow with divine light.",
    firstAppearance: "Ancient God arc",
    storyArc: "Ancient God Integration"
  },
  {
    name: "Ancient God Punch",
    type: "technique",
    origin: "Ancient God inheritance",
    owner: "Wang Lin",
    power: "Physical attack infused with Ancient God body power. Can shatter mountains and crack space with raw force.",
    firstAppearance: "Ancient God arc",
    storyArc: "Ancient God Integration"
  },

  // ========== DAO DOMAINS & ORIGINAL SPELLS ==========
  {
    name: "Life & Death Domain",
    type: "technique",
    origin: "Life/Death Dao mastery",
    owner: "Wang Lin",
    power: "Formed after living as a mortal for a century. Creates a domain where Wang Lin controls the cycle of reincarnation of all within. Absolute control over life and death.",
    firstAppearance: "Soul Formation arc",
    storyArc: "Life/Death Dao",
    dao: "Life/Death"
  },
  {
    name: "Karma Domain",
    type: "technique",
    origin: "Karma Dao mastery",
    owner: "Wang Lin",
    power: "Evolved from Life and Death Domain. Targets the karmic cause and effect of enemies. Can manipulate fate and sever destiny connections.",
    firstAppearance: "Late mid arcs",
    storyArc: "Karma Dao Mastery",
    dao: "Karma"
  },
  {
    name: "Sundered Night",
    type: "technique",
    origin: "Wang Lin's self-created original spell",
    owner: "Wang Lin",
    power: "First self-created original spell based on Dao of Beginning and End (Creation and Extermination). Represents Wang Lin's true understanding of his path.",
    firstAppearance: "Third Step arc",
    storyArc: "Original Spell Creation",
    dao: "Absolute Beginning/Absolute End"
  },
  {
    name: "Flowing Time",
    type: "technique",
    origin: "Wang Lin's self-created original spell",
    owner: "Wang Lin",
    power: "High-level original spell utilizing Dao of Time. Manipulates aging or movement of targets. Can accelerate or decelerate time on enemies.",
    firstAppearance: "Third Step arc",
    storyArc: "Original Spell Creation",
    dao: "Time"
  },
  {
    name: "Stop",
    type: "technique",
    origin: "Space/Time Dao",
    owner: "Wang Lin",
    power: "Freezes time in a localized area. Devastating when combined with other Daos. Allows Wang Lin to act while enemies are frozen.",
    firstAppearance: "Transcendent arc",
    storyArc: "Space/Time Dao",
    dao: "Space/Time"
  },
  {
    name: "True/False Reversal",
    type: "technique",
    origin: "True/False Dao",
    owner: "Wang Lin",
    power: "Makes illusions real and reality into illusion. Can turn attacks into nothingness or make imaginary attacks real.",
    firstAppearance: "Divine Transformation arc",
    storyArc: "True/False Dao",
    dao: "True/False"
  },
  {
    name: "Slaughter Domain",
    type: "technique",
    origin: "Slaughter Dao",
    owner: "Wang Lin",
    power: "Fills an area with killing intent, amplifying attack power dramatically. Created from Wang Lin's countless battles and killings.",
    firstAppearance: "Core Formation arc",
    storyArc: "Slaughter Dao Mastery",
    dao: "Slaughter"
  },
  {
    name: "Karmic Severance",
    type: "technique",
    origin: "Karma Dao",
    owner: "Wang Lin",
    power: "Severs karmic ties between beings, weakening their fate connections. Can nullify relationships and inherited karma.",
    firstAppearance: "Late mid arcs",
    storyArc: "Karma Dao Mastery",
    dao: "Karma"
  },
];

const types = ["All", "artifact", "technique"];
const typeLabels: Record<string, string> = { All: "All Items", artifact: "Artifacts", technique: "Techniques" };

const ArtifactsPage = () => {
  const [searchParams] = useSearchParams();
  const queryItem = searchParams.get("q");
  
  const [search, setSearch] = useState(queryItem || "");
  const [typeFilter, setTypeFilter] = useState("All");

  // Auto-search from URL query param on mount
  useEffect(() => {
    if (queryItem) {
      setSearch(queryItem);
    }
  }, [queryItem]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.power.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "All" || item.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  return (
    <Layout>
      <PageHero title="Artifacts & Techniques" subtitle="The legendary weapons, treasures, and cultivation techniques of Renegade Immortal" />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Filters */}
          <div className="gradient-card border border-border rounded-lg p-6 mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Search size={18} className="text-primary" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search artifacts and techniques..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none font-body text-lg border-b border-border pb-1 focus:border-primary transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-1.5 rounded text-xs font-body transition-colors ${typeFilter === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                >
                  {typeLabels[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`gradient-card border rounded-lg p-6 hover:border-primary/30 transition-all duration-300 ${
                  item.type === "artifact" ? "border-crimson/20 border-l-2 border-l-crimson/40" : "border-jade/20 border-l-2 border-l-jade/40"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  {item.type === "artifact" ? (
                    <Sword size={16} className="text-crimson mt-0.5 shrink-0" />
                  ) : (
                    <Wand2 size={16} className="text-jade mt-0.5 shrink-0" />
                  )}
                  <div>
                    <h3 className="font-heading text-lg text-primary tracking-wider">{item.name}</h3>
                    <p className="text-xs text-muted-foreground font-body capitalize">{item.type} • {item.owner}</p>
                  </div>
                </div>
                <p className="text-foreground/80 font-body text-sm leading-relaxed mb-4">{item.power}</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-body">
                  <div>
                    <span className="text-muted-foreground">Origin:</span>
                    <p className="text-foreground/70">{item.origin}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Story Arc:</span>
                    <p className="text-foreground/70">{item.storyArc}</p>
                  </div>
                </div>
                {item.dao && (
                  <div className="mt-3">
                    <Link to="/daos" className="text-xs font-body px-2 py-0.5 rounded border border-primary/20 text-primary/80 hover:bg-primary/10 transition-colors">
                      {item.dao} Dao
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12 font-body">No items match your search</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ArtifactsPage;
