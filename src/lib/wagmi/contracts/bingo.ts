import { getContract } from "viem";
import { getPublicClient } from "@wagmi/core";
import { config } from "../config";
import { abi } from "@/lib/wagmi/abis";
import { env } from "@/config/env";

export const getBingoContract = () => {
  const publicClient = getPublicClient(config);

  return getContract({
    address: env.bingoContract,
    abi: abi,
    client: publicClient,
  });
};
