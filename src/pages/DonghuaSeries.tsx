import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { DONGHUA_SECTIONS, DONGHUA_SERIES } from "@/data/donghuaData";
import { Link, useParams } from "react-router-dom";
import { Play } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";

export default function DonghuaSeriesList() {
  const { sectionId } = useParams<{ sectionId?: string }>();
  const [brokenThumbs, setBrokenThumbs] = useState<Record<string, boolean>>({});

  const section = useMemo(
    () => sectionId ? DONGHUA_SECTIONS.find((item) => item.id === sectionId) : null,
    [sectionId],
  );

  const visibleSeries = useMemo(() => {
    if (!section) return DONGHUA_SERIES;
    const allowed = new Set(section.seriesIds);
    return DONGHUA_SERIES.filter((series) => allowed.has(series.id));
  }, [section]);

  const pageTitle = section ? `${section.title} - Renegade Immortal` : "All Donghua Series - Renegade Immortal";
  const pageDescription = section
    ? section.description
    : "Browse our complete collection of Donghua series including Renegade Immortal, Swallowed Star, Battle Through The Heavens, and more.";

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      
      <PageHero
        title={section ? section.title : "Donghua Series Collection"}
        subtitle={section ? section.description : "Explore our curated selection of top-tier Donghua series."}
      />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
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
                  onError={() => {
                    setBrokenThumbs((prev) => ({ ...prev, [series.id]: true }));
                  }}
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
        </div>
      </section>
    </Layout>
  );
}
