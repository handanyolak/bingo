"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeColorProvider } from "@/app/components/ThemeColorProvider";
import { AccountChangeProvider } from "@/app/contexts/AccountChangeContext";
import { LocaleProvider } from "@/app/contexts/LocaleContext";
import ContextProvider from "@/app/contexts/ReownContext";
import { useLocaleProvider } from "@/app/hooks/useLocaleProvider";
import StoreProvider from "@/app/StoreProvider";
import { queryClient } from "@/lib/queryClient";
import type { AppProvidersProps } from "@/types/contexts";

export const AppProviders = ({ messages, children }: AppProvidersProps) => {
  const { locale, updateLocale, currentMessages } = useLocaleProvider({
    messages,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <ThemeColorProvider>
          <NextIntlClientProvider messages={currentMessages} locale={locale}>
            <LocaleProvider
              value={{
                locale,
                updateLocale,
              }}
            >
              <ContextProvider
                cookies={typeof window !== "undefined" ? document.cookie : null}
              >
                <AccountChangeProvider>
                  <ToastContainer
                    autoClose={5000}
                    hideProgressBar={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    pauseOnHover
                    theme="dark"
                    toastStyle={{
                      backgroundColor: "transparent",
                      color: "var(--text)",
                    }}
                  />
                  {children}
                </AccountChangeProvider>
              </ContextProvider>
            </LocaleProvider>
          </NextIntlClientProvider>
        </ThemeColorProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
};
