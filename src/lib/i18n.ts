import { Locale, DEFAULT_LOCALE } from "@/types/i18n";

export const UI_STRINGS: Record<string, Record<Locale, string>> = {
  // Navigation
  "nav.about": {
    hy: "Մեր մասին",
    en: "About Us",
    ru: "О нас",
  },
  "nav.civilizations": {
    hy: "Քաղաքակրթություններ",
    en: "Civilizations",
    ru: "Цивилизации",
  },
  "nav.library": {
    hy: "Գրադարան",
    en: "Library",
    ru: "Библиотека",
  },
  "nav.dialogue": {
    hy: "Երկխոսության հարթակ",
    en: "Dialogue Platform",
    ru: "Платформа диалога",
  },
  "nav.forum": {
    hy: "Ֆորում",
    en: "Forum",
    ru: "Форум",
  },
  "nav.admin": {
    hy: "🛡 Ադմին",
    en: "🛡 Admin",
    ru: "🛡 Админ",
  },
  "nav.login": {
    hy: "Մուտք",
    en: "Sign In",
    ru: "Войти",
  },
  "nav.profile": {
    hy: "Պրոֆիլ",
    en: "Profile",
    ru: "Профиль",
  },

  // AI translation notices
  "ai.badge": {
    hy: "",
    en: "Translated by AI",
    ru: "Переведено ИИ",
  },
  "ai.notice.short": {
    hy: "",
    en: "Content translated from Armenian by AI",
    ru: "Контент переведен с армянского с помощью ИИ",
  },
  "ai.notice.detailed": {
    hy: "",
    en: "Original texts are written and curated in Armenian. This version has been automatically translated by AI.",
    ru: "Оригинальные тексты подготовлены на армянском языке. Данная версия автоматически переведена с помощью ИИ.",
  },
  "ai.originalNotice": {
    hy: "",
    en: "View original Armenian text",
    ru: "Посмотреть оригинал на армянском",
  },

  // Actions & Buttons
  "btn.readMore": {
    hy: "Կարդալ ավելին",
    en: "Read More",
    ru: "Читать далее",
  },
  "btn.close": {
    hy: "Փակել",
    en: "Close",
    ru: "Закрыть",
  },
  "btn.translateAi": {
    hy: "🌐 Թարգմանել AI-ով (EN, RU)",
    en: "🌐 Translate with AI",
    ru: "🌐 Перевести с помощью ИИ",
  },
  "btn.translating": {
    hy: "Թարգմանվում է AI-ով...",
    en: "Translating with AI...",
    ru: "Переводится с помощью ИИ...",
  },
  "btn.translatedSuccess": {
    hy: "✓ Թարգմանությունը պահպանվեց Firestore-ում",
    en: "✓ Translations saved to Firestore",
    ru: "✓ Переводы сохранены в Firestore",
  },
  "theme.dark": {
    hy: "Անցնել Մուգ Թեմային",
    en: "Switch to Dark Mode",
    ru: "Переключить на темную тему",
  },
  "theme.light": {
    hy: "Անցնել Լուսավոր Թեմային",
    en: "Switch to Light Mode",
    ru: "Переключить на светлую тему",
  },
};

/**
 * Returns a static UI translation string.
 */
export function t(key: string, locale: Locale): string {
  const entry = UI_STRINGS[key];
  if (!entry) return key;
  return entry[locale] || entry[DEFAULT_LOCALE] || key;
}

/**
 * Checks if a specific object or its active locale translation was translated by AI.
 */
export function isAiTranslated(data: unknown, locale: Locale): boolean {
  if (!data || typeof data !== "object" || locale === "hy") return false;
  const trans = (data as { translations?: Record<string, { _isAiTranslated?: boolean }> }).translations;
  return Boolean(trans?.[locale]?._isAiTranslated);
}

/**
 * Helper to get a localized field from any content object.
 * Falls back to Armenian if the target translation does not exist.
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  item: T | null | undefined,
  field: keyof T,
  locale: Locale
): unknown {
  if (!item) return "";
  if (locale === "hy") {
    return item[field];
  }
  const translated = (item as unknown as { translations?: Record<string, Record<string, unknown>> })
    .translations?.[locale]?.[field as string];
  if (translated !== undefined && translated !== null && translated !== "") {
    return translated;
  }
  return item[field];
}

/**
 * Applies a locale over a content object or array, returning a localized clone.
 * Falls back transparently to canonical Armenian fields.
 */
export function applyLocale<T>(content: T, locale: Locale): T {
  if (!content || locale === "hy") {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map((item) => applyLocale(item, locale)) as unknown as T;
  }

  if (typeof content !== "object") {
    return content;
  }

  const obj = content as Record<string, unknown>;
  const localizedData = (obj.translations as Record<string, Record<string, unknown>> | undefined)?.[locale];

  const result: Record<string, unknown> = { ...obj };

  // If there are translated fields for this locale, overlay them
  if (localizedData && typeof localizedData === "object") {
    for (const [key, val] of Object.entries(localizedData)) {
      if (key.startsWith("_")) continue; // Skip metadata keys like _isAiTranslated
      if (val !== undefined && val !== null && val !== "") {
        result[key] = val;
      }
    }
  }

  // Handle nested arrays with sub-items (e.g. cards, centers, authors, publications, agenda)
  for (const [key, val] of Object.entries(result)) {
    if (Array.isArray(val)) {
      result[key] = val.map((item) => {
        if (typeof item === "object" && item !== null) {
          const itemTrans = (item as { translations?: Record<string, Record<string, unknown>> }).translations?.[locale];
          if (itemTrans && typeof itemTrans === "object") {
            const localizedItem: Record<string, unknown> = { ...item };
            for (const [tKey, tVal] of Object.entries(itemTrans)) {
              if (tKey.startsWith("_")) continue;
              if (tVal !== undefined && tVal !== null && tVal !== "") {
                localizedItem[tKey] = tVal;
              }
            }
            return localizedItem;
          }
        }
        return item;
      });
    }
  }

  return result as T;
}
