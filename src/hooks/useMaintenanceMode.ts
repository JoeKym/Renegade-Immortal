import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useMaintenanceMode() {
  const [maintenance, setMaintenance] = useState<boolean>(() => {
    return localStorage.getItem("maintenance_mode") === "true";
  });
  const [maintenanceEta, setMaintenanceEta] = useState<string | null>(() => {
    return localStorage.getItem("maintenance_eta");
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    let localMode = localStorage.getItem("maintenance_mode") === "true";
    let localEta = localStorage.getItem("maintenance_eta");

    try {
      const { data, error } = await supabase
        .from("site_settings" as any)
        .select("key, value")
        .in("key", ["maintenance_mode", "maintenance_eta"]);

      if (!error && data && data.length > 0) {
        (data as any[]).forEach((row: any) => {
          if (row.key === "maintenance_mode") {
            localMode = row.value === true || row.value === "true";
            localStorage.setItem("maintenance_mode", String(localMode));
          }
          if (row.key === "maintenance_eta") {
            localEta = row.value ? String(row.value) : null;
            if (localEta) localStorage.setItem("maintenance_eta", localEta);
          }
        });
      }
    } catch (_e) {
      // Fallback to local storage values
    }

    setMaintenance(localMode);
    setMaintenanceEta(localEta);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    const handleLocalChange = () => {
      setMaintenance(localStorage.getItem("maintenance_mode") === "true");
      setMaintenanceEta(localStorage.getItem("maintenance_eta"));
    };

    window.addEventListener("maintenance_mode_changed", handleLocalChange);
    window.addEventListener("storage", handleLocalChange);

    const channel = supabase
      .channel("site-settings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => { void refresh(); }
      )
      .subscribe();

    return () => {
      window.removeEventListener("maintenance_mode_changed", handleLocalChange);
      window.removeEventListener("storage", handleLocalChange);
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { maintenance, maintenanceEta, loading, refresh };
}
