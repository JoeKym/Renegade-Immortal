import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { DONGHUA_SERIES, DONGHUA_SECTIONS } from "@/data/donghuaData";
import { Link, useParams } from "react-router-dom";
import { Play, Volume2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function DonghuaSeriesList() {
  const { sectionId } = useParams<{ sectionId?: string }>();
  const [brokenThumbs, setBrokenThumbs] = useState<Record<string, boolean>>({});

  const activeSection = useMemo(
    () => (sectionId ? DONGHUA_SECTIONS.find((s) => s.id === sectionId) : undefined),
    [sectionId]
  );

  const visibleSeries = useMemo(() => {
    if (activeSection?.seriesIds) {
      const set = new Set(activeSection.seriesIds);
      return DONGHUA_SERIES.filter((s) => set.has(s.id));
    }
    return DONGHUA_SERIES;
  }, [activeSection]);

  const pageTitle = activeSection
    ? `${activeSection.title} - Donghua Series`
    : "All Donghua Series - Renegade Immortal";
  const pageDesc = activeSection?.description
    ?? "Browse our complete collection of Donghua series including Renegade Immortal, Swallowed Star, Battle Through The Heavens, and more.";

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
      </Helmet>

      <PageHero
        title={activeSection?.title ?? "Donghua Series Collection"}
        subtitle={activeSection?.description ?? "Explore our curated selection of top-tier Donghua series."}
      />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {activeSection && (
            <div className="mb-10 gradient-card border border-border rounded-lg p-6 flex items-center gap-3">
              <Volume2 size={24} className="text-primary shrink-0" />
              <div>
                <h2 className="font-heading text-2xl text-primary tracking-wider">{activeSection.title}</h2>
                <p className="text-sm text-muted-foreground font-body mt-1">{activeSection.description}</p>
                <Link
                  to="/donghua-series"
                  className="text-xs text-primary hover:underline mt-2 inline-block font-body"
                >
                  ← Show all series
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {visibleSeries.map((series) => (
              <Link
                key={series.id}
                to={`/watch/${series.id}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all shadow-lg bg-card"
              >
                <img
                  src={brokenThumbs[series.id] ? "/placeholder.svg" : series.thumbnail}
                  alt={series.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={() =>
                    setBrokenThumbs((prev) => ({ ...prev, [series.id]: true }))
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[10px] text-primary font-body uppercase tracking-tighter mb-1">Series</p>
                  <h4 className="text-sm font-heading text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {series.title}
                  </h4>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform shadow-lg shadow-primary/20">
                    <Play size={20} className="text-primary-foreground ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {visibleSeries.length === 0 && (
            <p className="text-center text-muted-foreground py-16 font-body">
              No series match the requested filter.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
