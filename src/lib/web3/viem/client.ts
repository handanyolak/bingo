import { http, createPublicClient } from "viem";
import { sepolia } from "viem/chains";

export const publicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: sepolia,
  transport: http(
    "https://sepolia.infura.io/v3/aa96b1e2b9624d88a1bd49336049a3de"
  ),
});
