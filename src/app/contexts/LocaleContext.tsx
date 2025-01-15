"use client";

import { NextIntlClientProvider } from "next-intl";
import StoreProvider from "@/app/StoreProvider";
import ContextProvider from "@/app/contexts/ReownContext";
import { ClientColorProvider } from "@/app/components/ClientColorProvider";
import { createContext, useContext, useState } from "react";
import { LanguageCode } from "@/i18n/config";
import { setLocale, getLocale } from "@/lib/actions";

type ContextType = {
  locale: LanguageCode;
  updateLocale: (newLocale: LanguageCode) => void;
};

type Messages = {
  [K in LanguageCode]: {
    [key: string]:
      | string
      | {
          [key: string]: string;
        };
  };
};

type Props = {
  messages: Messages;
  children: React.ReactNode;
};

const LocaleContext = createContext<ContextType>({} as ContextType);

export const useLocale = () => useContext(LocaleContext);

export const LocaleProvider = ({ messages, children }: Props) => {
  const [currentLocale, setCurrentLocale] = useState<LanguageCode>(() => {
    return getLocale() as LanguageCode;
  });

  const updateLocale = (newLocale: LanguageCode) => {
    setCurrentLocale(newLocale);
    setLocale(newLocale);
  };

  return (
    <NextIntlClientProvider
      messages={messages[currentLocale]}
      locale={currentLocale}
    >
      <LocaleContext.Provider value={{ locale: currentLocale, updateLocale }}>
        <StoreProvider>
          <ContextProvider
            cookies={typeof window !== "undefined" ? document.cookie : null}
          >
            <ClientColorProvider>{children}</ClientColorProvider>
          </ContextProvider>
        </StoreProvider>
      </LocaleContext.Provider>
    </NextIntlClientProvider>
  );
};
