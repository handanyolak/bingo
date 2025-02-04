import { useQuery } from "@tanstack/react-query";
import { getContract } from "viem";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { env } from "@/config/env";
import { publicClient } from "@/lib/web3";
import { abi } from "@/lib/web3";

export const useContractReads = () => {
  const { isConnected, address } = useAccount();

  const fetchContractData = async () => {
    const contract = getContract({
      address: env.bingoContractAddress,
      abi,
      client: publicClient,
    });

    const [gameId, bingoCardPrice, isPlayerExists, isDrawnNumbersFilled] =
      await Promise.all([
        contract.read.availableGameId(),
        contract.read.BINGO_CARD_PRICE(),
        contract.read.isPlayerExists([BigInt(0), address as Address]),
        contract.read.isDrawnNumbersFilled([BigInt(0)]),
      ]);

    return { gameId, bingoCardPrice, isPlayerExists, isDrawnNumbersFilled };
  };

  return useQuery({
    queryKey: ["contract", "initial-reads"],
    queryFn: fetchContractData,
    enabled: isConnected && !!address,
    staleTime: 5000,
    gcTime: 10000,
  });
};
