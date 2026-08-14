export type SiteSettingsErrorLike = {
  code?: string;
  status?: number;
  message?: string;
  details?: unknown;
};

export function isMissingSiteSettingsError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as SiteSettingsErrorLike;
  const message = candidate.message ?? "";
  const rawCode = candidate.code ?? "";

  if (candidate.status === 404) return true;
  if (rawCode === "PGRST205") return true;
  if (rawCode === "42P01") return true;
  if (message.includes("site_settings") && /could not find the table|not found|404/i.test(message)) {
    return true;
  }

  return false;
}
