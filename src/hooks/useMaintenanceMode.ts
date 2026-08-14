import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isMissingSiteSettingsError } from "@/lib/siteSettings";

export function useMaintenanceMode() {
  const [maintenance, setMaintenance] = useState(false);
  const [maintenanceEta, setMaintenanceEta] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings" as any)
        .select("key, value")
        .in("key", ["maintenance_mode", "maintenance_eta"]);

      if (error) {
        if (isMissingSiteSettingsError(error)) {
          setMaintenance(false);
          setMaintenanceEta(null);
          setLoading(false);
          return;
        }
        setLoading(false);
        return;
      }

      if (data) {
        (data as any[]).forEach((row: any) => {
          if (row.key === "maintenance_mode") {
            const value = row.value;
            setMaintenance(value === true || value === "true");
          }
          if (row.key === "maintenance_eta") {
            setMaintenanceEta(row.value ? String(row.value) : null);
          }
        });
      }
    } catch (error) {
      if (isMissingSiteSettingsError(error)) {
        setMaintenance(false);
        setMaintenanceEta(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const channel = supabase
      .channel("site-settings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => { void refresh(); }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { maintenance, maintenanceEta, loading, refresh };
}
