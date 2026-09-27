import { createContext, useContext, useEffect, ReactNode } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  language: string;
  setLanguage: (code: string) => void;
  currentLanguage: { code: string; name: string; flag: string };
  supportedLanguages: { code: string; name: string; flag: string }[];
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const translation = useTranslation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.getElementById("google-translate-container")) {
      const container = document.createElement("div");
      container.id = "google-translate-container";
      container.style.display = "none";
      const el = document.createElement("div");
      el.id = "google_translate_element";
      container.appendChild(el);
      document.body.appendChild(container);
    }

    if (!document.getElementById("google-translate-script")) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <TranslationContext.Provider value={translation}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useT() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useT must be used within a TranslationProvider");
  }
  return context;
}
