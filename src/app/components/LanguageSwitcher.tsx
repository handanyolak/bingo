"use client";

import { useLocale } from "@/app/contexts/LocaleContext";
import { LANGUAGES, LanguageCode } from "@/i18n/config";

export const LanguageSwitcher = () => {
  const { locale, updateLocale } = useLocale();

  return (
    <select
      value={locale}
      onChange={(e) => void updateLocale(e.target.value as LanguageCode)}
    >
      {Object.entries(LANGUAGES).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
};
