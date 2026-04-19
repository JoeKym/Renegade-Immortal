import { createContext, useContext, ReactNode } from "react";
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
