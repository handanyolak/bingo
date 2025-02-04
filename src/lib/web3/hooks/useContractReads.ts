import { useQuery } from "@tanstack/react-query";
import { getContract } from "viem";
import { publicClient } from "@/lib/web3";
import { env } from "@/config/env";
import { abi } from "@/lib/web3";
import { useAccount } from "wagmi";

export const useContractReads = () => {
  return useQuery({
    queryKey: ["contract", "initial-reads"],
    queryFn: async () => {
      const contract = getContract({
        address: env.bingoContractAddress,
        abi,
        client: publicClient,
      });

      const [gameId, bingoCardPrice] = await Promise.all([
        contract.read.availableGameId(),
        contract.read.BINGO_CARD_PRICE(),
      ]);

      return {
        gameId,
        bingoCardPrice,
      };
    },
    staleTime: 5_000,
    gcTime: 10_000,
  });
};
