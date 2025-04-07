import "./globals.css";
import { Comfortaa } from "next/font/google";

import { Header } from "@/app/components/Header";
import { getStaticMessages } from "@/i18n/config";

import { LocaleProvider } from "./contexts/LocaleContext";

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
  const messages = await getStaticMessages();

  return (
    <html>
      <body className={`${comfortaa.className}`} lang="en">
        <LocaleProvider messages={messages}>
          <Header />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
