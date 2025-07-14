"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AccountChangeProvider } from "@/app/contexts/AccountChangeContext";
import ContextProvider from "@/app/contexts/ReownContext";
import StoreProvider from "@/app/StoreProvider";
import { LocaleProvider, type AppProvidersProps } from "@/contexts";
import { ThemeProvider } from "@/contexts";
import { queryClient } from "@/lib/queryClient";

export const AppProviders = ({ messages, children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <NextThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ThemeProvider>
            <LocaleProvider messages={messages}>
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
          </ThemeProvider>
        </NextThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
};
