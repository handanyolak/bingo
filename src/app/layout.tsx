import "./globals.css";
import { Header } from "@/app/components/Header";
import { Comfortaa } from "next/font/google";
import { headers } from "next/headers";
import ContextProvider from "@/app/contexts/ReownContext";
import StoreProvider from "@/app/StoreProvider";
import { ClientColorProvider } from "@/app/components/ClientColorProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { LocaleProvider } from "@/app/contexts/LocaleContext";
import { getLocale } from "@/lib/actions";
import { LanguageCode } from "@/i18n/config";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Bingo",
  description: "Next.js with Bingo Game",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie") || null;

  const locale = (await getLocale()) as LanguageCode;
  const messages = await getMessages();

  return (
    <html lang="en">
      <body className={comfortaa.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LocaleProvider locale={locale}>
            <StoreProvider>
              <ContextProvider cookies={cookies}>
                <ClientColorProvider>
                  <Header />
                  {children}
                </ClientColorProvider>
              </ContextProvider>
            </StoreProvider>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
