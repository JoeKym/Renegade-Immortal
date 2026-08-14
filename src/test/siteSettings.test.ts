import { describe, expect, it } from "vitest";
import { isMissingSiteSettingsError } from "@/lib/siteSettings";

describe("site settings error handling", () => {
  it("treats missing table and 404 responses as recoverable", () => {
    expect(isMissingSiteSettingsError({ code: "PGRST205", message: "Could not find the table 'public.site_settings' in the schema cache" })).toBe(true);
    expect(isMissingSiteSettingsError({ status: 404, message: "Not Found" })).toBe(true);
    expect(isMissingSiteSettingsError({ code: "23505", message: "duplicate key value" })).toBe(false);
  });
});
