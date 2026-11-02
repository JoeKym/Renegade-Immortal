import { useState, useEffect, useCallback } from "react";import { translations } from "@/i18n/resources";



// Supported languages
export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
];

// Detect browser language
function detectBrowserLanguage(): string {
  if (typeof navigator === "undefined") return "en";

  // Get browser languages
  const browserLangs = navigator.languages || [navigator.language];

  // Find first supported language
  for (const lang of browserLangs) {
    const code = lang.split("-")[0].toLowerCase();
    if (translations[code]) {
      return code;
    }
  }

  return "en";
}

// Get saved language from localStorage
function getSavedLanguage(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem("app-language");
}

// Save language to localStorage
function saveLanguage(code: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("app-language", code);
}

export function useTranslation() {
  const [language, setLanguageState] = useState<string>(() => {
    return getSavedLanguage() || detectBrowserLanguage();
  });

  const setLanguage = useCallback((code: string) => {
    setLanguageState(code);
    saveLanguage(code);

    try {
      const hostname = window.location.hostname;
      if (code === "en") {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
      } else {
        document.cookie = `googtrans=/en/${code}; path=/;`;
        document.cookie = `googtrans=/en/${code}; path=/; domain=${hostname};`;
      }

      const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (selectEl) {
        selectEl.value = code;
        selectEl.dispatchEvent(new Event("change"));
      } else if (code !== "en" && !document.cookie.includes(`googtrans=/en/${code}`)) {
        window.location.reload();
      }
    } catch (_e) {}
  }, []);

  // Translate function
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const translation = translations[language]?.[key] || translations["en"]?.[key] || key;

      if (params) {
        return Object.entries(params).reduce(
          (acc, [paramKey, value]) => acc.replace(`{${paramKey}}`, String(value)),
          translation
        );
      }

      return translation;
    },
    [language]
  );

  // Get current language info
  const currentLanguage = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  return {
    t,
    language,
    setLanguage,
    currentLanguage,
    supportedLanguages,
    isRTL: language === "ar",
  };
}

// Simple translation component for use outside React components
export function translate(key: string, lang: string = "en", params?: Record<string, string | number>): string {
  const translation = translations[lang]?.[key] || translations["en"]?.[key] || key;

  if (params) {
    return Object.entries(params).reduce(
      (acc, [paramKey, value]) => acc.replace(`{${paramKey}}`, String(value)),
      translation
    );
  }

  return translation;
}
