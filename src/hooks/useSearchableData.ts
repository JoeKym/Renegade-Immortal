import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { characters } from "@/data/charactersData";
import { DONGHUA_SERIES } from "@/data/donghuaData";
import { ARTIFACT_ITEMS } from "@/pages/Artifacts";
import { searchableData } from "@/data/searchData";
import { useDonghuaCatalog } from "@/contexts/DonghuaCatalogContext";
import { useLoreContent } from "@/contexts/LoreContentContext";
import { supabase } from "@/integrations/supabase/client";
import { buildSearchIndex } from "@/lib/searchIndex";

const emptyPublicData = { communities: [], profiles: [] };

export function useSearchableData(enabled = true) {
  const { records } = useLoreContent();
  const { series } = useDonghuaCatalog();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!enabled) return;
    const updateTime = () => setNow(new Date());
    updateTime();
    const intervalId = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(intervalId);
  }, [enabled]);

  const { data: publicData = emptyPublicData } = useQuery({
    queryKey: ["site-search-public-data"],
    enabled,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const [communitiesResult, profilesResult] = await Promise.all([
        supabase
          .from("communities")
          .select("id, name, description, category")
          .eq("is_active", true)
          .order("name")
          .limit(1000),
        supabase
          .from("profiles")
          .select("username, display_name, bio")
          .not("username", "is", null)
          .order("display_name")
          .limit(1000),
      ]);

      if (communitiesResult.error) throw communitiesResult.error;
      if (profilesResult.error) throw profilesResult.error;
      return {
        communities: communitiesResult.data,
        profiles: profilesResult.data.filter(
          (profile): profile is typeof profile & { username: string } => Boolean(profile.username),
        ),
      };
    },
  });

  return useMemo(() => buildSearchIndex({
    baseResults: searchableData,
    characters,
    loreRecords: records,
    artifactItems: ARTIFACT_ITEMS,
    series: series ?? DONGHUA_SERIES,
    communities: publicData.communities,
    profiles: publicData.profiles,
    now,
  }), [now, publicData, records, series]);
}