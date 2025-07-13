"use client";

import { NextIntlClientProvider } from "next-intl";

import {
  LocaleContext,
  useLocaleProvider,
  type LocaleProviderProps,
} from "@/contexts";

export const LocaleProvider = ({ messages, children }: LocaleProviderProps) => {
  const {
    locale,
    updateLocale,
    messages: currentMessages,
  } = useLocaleProvider({
    messages,
  });

  return (
    <LocaleContext.Provider value={{ locale, updateLocale }}>
      <NextIntlClientProvider messages={currentMessages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
};
