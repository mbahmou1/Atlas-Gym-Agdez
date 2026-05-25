"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { translate, type MessageKey } from "@/lib/i18n/translate";
import { LOCALE_STORAGE_KEY, type Locale } from "@/lib/i18n/types";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale: Locale = "ar";

  useEffect(() => {
    const html = document.documentElement;
    html.lang = "ar";
    html.dir = "rtl";
    localStorage.setItem(LOCALE_STORAGE_KEY, "ar");
  }, []);

  const setLocale = useCallback((_next: Locale) => {
    /* العربية فقط */
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => translate("ar", key, params),
      dir: "rtl",
    }),
    [setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
