export const LANGUAGES = {
  en: "English",
  tr: "Türkçe",
  de: "Deutsch",
} as const;

export type LanguageCode = keyof typeof LANGUAGES;
export const DEFAULT_LOCALE: LanguageCode = "en";
export const COOKIE_NAME = "preferred-locale";
