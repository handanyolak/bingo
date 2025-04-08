"use client";

import { createAppKit } from "@reown/appkit/react";
import { useTheme } from "next-themes";
import React, { type ReactNode, useEffect } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

import { wagmiAdapter, projectId, networks } from "@/lib/web3/reown/config";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const metadata = {
  name: "appkit-example",
  description: "AppKit Example",
  url: "https://appkitexampleapp.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: "light",
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const { theme } = useTheme();
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme =
        (localStorage.getItem("theme") as "dark" | "light") || "light";
      modal.setThemeMode(storedTheme);
    }

    if (theme) {
      modal.setThemeMode(theme as "dark" | "light");
    }
  }, [theme]);

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      {children}
    </WagmiProvider>
  );
}

export default ContextProvider;
