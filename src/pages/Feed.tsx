import { motion } from "framer-motion";
import { Clock3, ExternalLink, Film, ImageIcon, Newspaper, Sparkles, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { fetchRenegadeImmortalFeed, type SocialFeedItem } from "@/data/socialFeedData";

const typeIconMap = {
  post: Sparkles,
  video: Video,
  photo: ImageIcon,
  news: Newspaper,
};

const typeColorMap = {
  post: "bg-primary/10 text-primary border-primary/20",
  video: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  photo: "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20",
  news: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

export default function Feed() {
  const [items, setItems] = useState<SocialFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  useEffect(() => {
    let isMounted = true;

    fetchRenegadeImmortalFeed()
      .then((feed) => {
        if (isMounted) setItems(feed);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const platforms = useMemo(
    () => ["all", ...new Set(items.map((item) => item.platform))],
    [items]
  );

  const filteredItems = useMemo(() => {
    if (selectedPlatform === "all") return items;

    return items.filter((item) => {
      const platform = item.platform.toLowerCase();
      const selected = selectedPlatform.toLowerCase();
      return platform.includes(selected) || item.tags.some((tag) => tag.toLowerCase() === selected);
    });
  }, [items, selectedPlatform]);

  return (
    <Layout>
      <div className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full border border-primary/20 bg-primary/10 p-2 text-primary">
                <Film className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-heading uppercase tracking-[0.3em] text-primary">Renegade Immortal feed</p>
                <h1 className="text-3xl font-heading text-foreground">Social updates</h1>
              </div>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground font-body">
              Catch the latest episode buzz, fan reactions, media drops, and discussion threads from the biggest social platforms connected to Renegade Immortal.
            </p>
          </motion.div>

          <div className="mb-6 flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => setSelectedPlatform(platform)}
                className={`rounded-full border px-3 py-1.5 text-xs font-heading transition-colors ${
                  selectedPlatform === platform
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {platform === "all" ? "All platforms" : platform}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="text-muted-foreground font-body animate-pulse">Loading latest Renegade Immortal social updates...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="text-muted-foreground font-body">No social updates matched this filter yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item, index) => {
                const Icon = typeIconMap[item.type] || Sparkles;

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                  >
                    <a href={item.url} target="_blank" rel="noreferrer" className="block">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          <span className="rounded-full border border-white/20 bg-black/30 px-2 py-1 text-[10px] font-heading uppercase tracking-[0.2em] text-white">
                            {item.platform}
                          </span>
                        </div>
                      </div>
                    </a>

                    <div className="space-y-4 p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-heading uppercase tracking-[0.2em] ${typeColorMap[item.type]}`}>
                          <Icon className="h-3 w-3" />
                          {item.type}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock3 className="h-3 w-3" />
                          {new Date(item.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-lg font-heading text-foreground transition-colors group-hover:text-primary">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-body">{item.summary}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={`${item.id}-${tag}`} className="rounded-full border border-border bg-muted/40 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-heading text-primary transition-colors hover:text-primary/80"
                      >
                        Open on {item.platform}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
