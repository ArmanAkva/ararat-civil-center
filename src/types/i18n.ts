export type Locale = "hy" | "en" | "ru";

export const DEFAULT_LOCALE: Locale = "hy";

export interface LocaleOption {
  code: Locale;
  label: string; // e.g., "AM", "EN", "RU"
  name: string;  // e.g., "Հայերեն", "English", "Русский"
}

export const SUPPORTED_LOCALES: LocaleOption[] = [
  { code: "hy", label: "AM", name: "Հայերեն" },
  { code: "en", label: "EN", name: "English" },
  { code: "ru", label: "RU", name: "Русский" },
];

export interface TranslationMeta {
  _isAiTranslated?: boolean;
  _translatedAt?: string;
  _sourceLang?: string;
}

export type TranslationsMap<T = Record<string, unknown>> = {
  [K in Exclude<Locale, "hy">]?: Partial<T> & TranslationMeta;
};

export interface Translatable {
  translations?: TranslationsMap<Record<string, unknown>>;
}
