import { Star, Tv, Clock } from "lucide-react";
import { AniListData } from "@/hooks/useDonghuaData";
import { DonghuaSeries } from "@/data/donghuaData";

interface WatchBannerProps {
  aniData: AniListData | null;
  series: DonghuaSeries;
  releasedCount: number;
  countdown: string;
  title: string;
}

export function WatchBanner({ aniData, series, releasedCount, countdown, title }: WatchBannerProps) {
  return (
    <div
      className="relative h-48 sm:h-64 overflow-hidden"
      style={{
        backgroundImage: aniData?.bannerImage ? `url(${aniData.bannerImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        backgroundColor: "hsl(228 15% 7%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 flex items-end gap-5">
        <img
          src={aniData?.coverImage?.large || series.thumbnail}
          alt={title}
          className="hidden sm:block w-24 h-36 object-cover rounded-lg border border-border shadow-xl flex-shrink-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== series.thumbnail) {
              target.src = series.thumbnail;
            }
          }}
        />
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-heading text-foreground tracking-wider leading-tight truncate">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            {aniData?.averageScore && (
              <span className="flex items-center gap-1 text-xs text-yellow-400 font-body">
                <Star size={12} fill="currentColor" /> {(aniData.averageScore / 10).toFixed(1)}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
              <Tv size={12} /> {releasedCount} Episodes
            </span>
            {countdown && (
              <span className="flex items-center gap-1 text-xs text-primary font-body animate-pulse">
                <Clock size={12} /> Next: {countdown}
              </span>
            )}
          </div>
          {aniData?.genres && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {aniData.genres.slice(0, 4).map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-body border border-primary/20">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
