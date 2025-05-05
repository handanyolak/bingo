import { http, createPublicClient, fallback } from "viem";
import { sepolia } from "viem/chains";

const SEPOLIA_RPC_URLS = [
  "https://eth-sepolia.public.blastapi.io",
  "https://sepolia-rpc.publicnode.com",
  "https://1rpc.io/sepolia",
  "https://sepolia.infura.io/v3/aa96b1e2b9624d88a1bd49336049a3de",
];

const httpConfig = {
  retryCount: 3,
  retryDelay: 1000,
  timeout: 30000,
};

export const publicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: sepolia,
  transport: fallback(SEPOLIA_RPC_URLS.map((url) => http(url, httpConfig))),
});
