import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DONGHUA_SERIES, type DonghuaSeries } from "@/data/donghuaData";
import { supabase } from "@/integrations/supabase/client";
import { mergeDonghuaCatalog } from "@/lib/donghuaCatalog";

const CATALOG_UPDATED_EVENT = "donghua_catalog_updated";

interface DonghuaCatalogContextValue {
  series: DonghuaSeries[];
  refresh: () => Promise<void>;
}

const DonghuaCatalogContext = createContext<DonghuaCatalogContextValue>({
  series: DONGHUA_SERIES,
  refresh: async () => undefined,
});

async function fetchPublishedCatalog(): Promise<DonghuaSeries[]> {
  const { data, error } = await supabase
    .from("donghua_catalog")
    .select("id, payload")
    .eq("is_published", true);
  if (error) throw error;
  return mergeDonghuaCatalog(DONGHUA_SERIES, data);
}

export function notifyDonghuaCatalogUpdated() {
  window.dispatchEvent(new Event(CATALOG_UPDATED_EVENT));
}

export function DonghuaCatalogProvider({ children }: { children: ReactNode }) {
  const [series, setSeries] = useState(DONGHUA_SERIES);

  const refresh = useCallback(async () => {
    const catalog = await fetchPublishedCatalog();
    setSeries(catalog);
  }, []);

  useEffect(() => {
    let active = true;
    const loadCatalog = async () => {
      try {
        const catalog = await fetchPublishedCatalog();
        if (active) setSeries(catalog);
      } catch (error) {
        console.error("Could not load the published donghua catalog; using bundled catalog data.", error);
      }
    };

    const handleUpdate = () => {
      void loadCatalog();
    };
    void loadCatalog();
    window.addEventListener(CATALOG_UPDATED_EVENT, handleUpdate);
    return () => {
      active = false;
      window.removeEventListener(CATALOG_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  const value = useMemo(() => ({ series, refresh }), [series, refresh]);
  return <DonghuaCatalogContext.Provider value={value}>{children}</DonghuaCatalogContext.Provider>;
}

export function useDonghuaCatalog() {
  return useContext(DonghuaCatalogContext);
}
