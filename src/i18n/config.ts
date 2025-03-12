export const LANGUAGES = {
  en: "English",
  tr: "Türkçe",
  de: "Deutsch",
  fr: "Français",
} as const;

export type LanguageCode = keyof typeof LANGUAGES;
export const DEFAULT_LOCALE: LanguageCode = "en";
export const LOCAL_STORAGE_NAME = "preferred-locale";

export const getStaticMessages = async () => {
  return {
    en: (await import(`../../messages/en.json`)).default,
    tr: (await import(`../../messages/tr.json`)).default,
    de: (await import(`../../messages/de.json`)).default,
    fr: (await import(`../../messages/fr.json`)).default,
  };
};
