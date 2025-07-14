import "./globals.css";
import { Comfortaa } from "next/font/google";
import { Suspense } from "react";

import { Header } from "@/app/components/header/Header";
import { Loader } from "@/app/components/ui/loader";
import { Providers } from "@/app/providers";
import { getStaticMessages } from "@/i18n/config";

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
        <Providers messages={messages}>
          <Suspense fallback={<Loader role="status" aria-label="Loading..." />}>
            <Header />
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
