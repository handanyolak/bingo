"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";

type ContextType = {
  locale: string;
  messages: any;
  updateLocale: (newLocale: string) => Promise<void>;
};

type ProviderProps = {
  defaultMessages: any;
  children: React.ReactNode;
};

const LocaleContext = createContext<ContextType>({
  locale: "",
  messages: {},
  updateLocale: async () => {},
});

export const useLocale = () => useContext(LocaleContext);

export function LocaleProvider({ defaultMessages, children }: ProviderProps) {
  const [locale, setLocale] = useState<string>("en");
  const [messages, setMessages] = useState<any>(defaultMessages);

  const loadMessages = async (newLocale: string) => {
    try {
      const newMessages = (await import(`../../../messages/${newLocale}.json`))
        .default;
      return newMessages;
    } catch (error) {
      console.error("Error loading messages:", error);
      return null;
    }
  };

  const updateLocale = async (newLocale: string) => {
    const newMessages = await loadMessages(newLocale);
    if (newMessages) {
      setLocale(newLocale);
      setMessages(newMessages);
      localStorage.setItem("preferred-locale", newLocale);
      document.cookie = `preferred-locale=${newLocale};path=/`;
    }
  };

  useEffect(() => {
    const savedLocale = localStorage.getItem("preferred-locale");
    if (savedLocale && savedLocale !== locale) {
      void updateLocale(savedLocale);
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, messages, updateLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
