import { Link } from "react-router-dom";
import { Volume2, ExternalLink } from "lucide-react";
import { DONGHUA_SERIES, DonghuaSeries } from "@/data/donghuaData";
import { useState } from "react";

interface SeriesGridProps {
  currentSeriesId: string;
}

export function SeriesGrid({ currentSeriesId }: SeriesGridProps) {
  const otherSeries = DONGHUA_SERIES.filter(s => s.id !== currentSeriesId);
  const [brokenThumbs, setBrokenThumbs] = useState<Record<string, boolean>>({});

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading text-foreground tracking-wider flex items-center gap-2">
          <Volume2 size={20} className="text-primary" />
          More Donghua Series
        </h3>
        <Link to="/donghua-series" className="text-xs text-primary hover:underline font-body">View All</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {otherSeries.slice(0, 4).map((s) => (
          <Link
            key={s.id}
            to={`/watch/${s.id}`}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all shadow-lg bg-card"
          >
            <img
              src={brokenThumbs[s.id] ? "/placeholder.svg" : s.thumbnail}
              alt={s.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={() => setBrokenThumbs((prev) => ({ ...prev, [s.id]: true }))}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-[10px] text-primary font-body uppercase tracking-tighter mb-0.5">Series</p>
              <h4 className="text-xs font-heading text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {s.title}
              </h4>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
                <ExternalLink size={18} className="text-primary-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
