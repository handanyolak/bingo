import { sepolia } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage } from "wagmi";

import { env } from "@/config/env";

// Get projectId from https://cloud.reown.com
export const projectId = env.projectId;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [sepolia] as [AppKitNetwork, ...AppKitNetwork[]];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: false,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
