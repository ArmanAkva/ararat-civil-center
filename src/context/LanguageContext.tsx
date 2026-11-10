"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Locale, DEFAULT_LOCALE, SUPPORTED_LOCALES, LocaleOption } from "@/types/i18n";
import { t as translateKey, applyLocale as applyLocaleFn } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  supportedLocales: LocaleOption[];
  t: (key: string) => string;
  applyLocale: <T>(content: T) => T;
  isAiNoticeVisible: boolean;
  dismissAiNotice: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [isAiNoticeVisible, setIsAiNoticeVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("preferred_locale") as Locale | null;
      if (stored && (stored === "hy" || stored === "en" || stored === "ru")) {
        setLocaleState(stored);
        document.documentElement.setAttribute("lang", stored);
      } else {
        document.documentElement.setAttribute("lang", DEFAULT_LOCALE);
      }

      const noticeDismissed = localStorage.getItem("ai_notice_dismissed");
      if (noticeDismissed === "true") {
        setIsAiNoticeVisible(false);
      }
    } catch {
      // Fallback gracefully
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("preferred_locale", newLocale);
      document.documentElement.setAttribute("lang", newLocale);
    } catch {
      // ignore
    }
  }, []);

  const dismissAiNotice = useCallback(() => {
    setIsAiNoticeVisible(false);
    try {
      localStorage.setItem("ai_notice_dismissed", "true");
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      return translateKey(key, locale);
    },
    [locale]
  );

  const applyLocale = useCallback(
    <T,>(content: T): T => {
      return applyLocaleFn(content, locale);
    },
    [locale]
  );

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        supportedLocales: SUPPORTED_LOCALES,
        t,
        applyLocale,
        isAiNoticeVisible,
        dismissAiNotice,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

