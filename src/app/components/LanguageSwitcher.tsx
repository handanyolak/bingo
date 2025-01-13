"use client";
import { useLocale } from "@/app/contexts/LocaleContext";

export const LanguageSwitcher = () => {
  const { locale, updateLocale } = useLocale();

  const handleLanguageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = e.target.value;
    await updateLocale(newLang);
  };

  return (
    <select value={locale} onChange={handleLanguageChange}>
      <option value="en">English</option>
      <option value="tr">Türkçe</option>
      <option value="de">Deutsch</option>
    </select>
  );
};
