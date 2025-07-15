import { LOCAL_STORAGE_NAME, DEFAULT_LOCALE } from "@/i18n/config";

export const setLocale = (locale: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_NAME, locale);
  }
};

export const getLocale = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(LOCAL_STORAGE_NAME) ?? DEFAULT_LOCALE;
  }
  return DEFAULT_LOCALE;
};
