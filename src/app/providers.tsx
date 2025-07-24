"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StoreProvider from "@/app/StoreProvider";
import { toastConfig } from "@/config/toast";
import { LocaleProvider, type AppProvidersProps } from "@/contexts";
import { ThemeProvider } from "@/contexts";
import { queryClient } from "@/lib/queryClient";
import { ReownProvider } from "@/lib/web3";

export const Providers = ({ messages, children }: AppProvidersProps) => {
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
              <ReownProvider
                cookies={typeof window !== "undefined" ? document.cookie : null}
              >
                <ToastContainer {...toastConfig} />
                {children}
              </ReownProvider>
            </LocaleProvider>
          </ThemeProvider>
        </NextThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
};
