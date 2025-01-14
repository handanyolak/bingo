"use client";

import { createContext, useContext, useState } from "react";
import { setLocale } from "@/lib/actions";
import { LanguageCode } from "@/i18n/config";

type ContextType = {
  locale: LanguageCode;
  updateLocale: (newLocale: LanguageCode) => Promise<void>;
};

const LocaleContext = createContext<ContextType>({} as ContextType);

export const useLocale = () => useContext(LocaleContext);

type Props = {
  locale: LanguageCode;
  children: React.ReactNode;
};

export const LocaleProvider = ({ locale: initialLocale, children }: Props) => {
  const [locale, setCurrentLocale] = useState(initialLocale);

  const updateLocale = async (newLocale: LanguageCode) => {
    try {
      setCurrentLocale(newLocale);
      await setLocale(newLocale);
    } catch (error) {
      console.error("Error updating locale:", error);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, updateLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
