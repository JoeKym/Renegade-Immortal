import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isLoreContentType, type LoreContentRecord } from "@/lib/loreContent";

const LORE_CONTENT_UPDATED_EVENT = "lore_content_updated";

interface LoreContentContextValue {
  records: LoreContentRecord[];
  refresh: () => Promise<void>;
}

const LoreContentContext = createContext<LoreContentContextValue>({
  records: [],
  refresh: async () => undefined,
});

async function fetchPublishedLoreContent(): Promise<LoreContentRecord[]> {
  const { data, error } = await supabase
    .from("lore_content")
    .select("id, content_type, payload")
    .eq("is_published", true);
  if (error) throw error;
  return data.filter((record) => isLoreContentType(record.content_type));
}

export function notifyLoreContentUpdated() {
  window.dispatchEvent(new Event(LORE_CONTENT_UPDATED_EVENT));
}

export function LoreContentProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<LoreContentRecord[]>([]);

  const refresh = useCallback(async () => {
    setRecords(await fetchPublishedLoreContent());
  }, []);

  useEffect(() => {
    let active = true;
    const loadContent = async () => {
      try {
        const publishedRecords = await fetchPublishedLoreContent();
        if (active) setRecords(publishedRecords);
      } catch (error) {
        console.error("Could not load published lore content; using bundled content.", error);
      }
    };

    void loadContent();
    window.addEventListener(LORE_CONTENT_UPDATED_EVENT, loadContent);
    return () => {
      active = false;
      window.removeEventListener(LORE_CONTENT_UPDATED_EVENT, loadContent);
    };
  }, []);

  const value = useMemo(() => ({ records, refresh }), [records, refresh]);
  return <LoreContentContext.Provider value={value}>{children}</LoreContentContext.Provider>;
}

export function useLoreContent() {
  return useContext(LoreContentContext);
}
