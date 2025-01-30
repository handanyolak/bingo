"use client";

import { NextIntlClientProvider } from "next-intl";
import StoreProvider from "@/app/StoreProvider";
import ContextProvider from "@/app/contexts/ReownContext";
import { ThemeColorProvider } from "@/app/components/ThemeColorProvider";
import { createContext, useContext, useState } from "react";
import { LanguageCode } from "@/i18n/config";
import { setLocale, getLocale } from "@/lib/actions";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

const queryClient = new QueryClient();

export const LocaleProvider = ({ messages, children }: Props) => {
  const [currentLocale, setCurrentLocale] = useState<LanguageCode>(() => {
    return getLocale() as LanguageCode;
  });

  const updateLocale = (newLocale: LanguageCode) => {
    setCurrentLocale(newLocale);
    setLocale(newLocale);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <ThemeColorProvider>
            <NextIntlClientProvider
              messages={messages[currentLocale]}
              locale={currentLocale}
            >
              <LocaleContext.Provider
                value={{ locale: currentLocale, updateLocale }}
              >
                <ContextProvider
                  cookies={
                    typeof window !== "undefined" ? document.cookie : null
                  }
                >
                  {children}
                </ContextProvider>
              </LocaleContext.Provider>
            </NextIntlClientProvider>
          </ThemeColorProvider>
        </StoreProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
