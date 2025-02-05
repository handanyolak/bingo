import { useQuery } from "@tanstack/react-query";
import { getContract } from "viem";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { env } from "@/config/env";
import { publicClient } from "@/lib/web3";
import { abi } from "@/lib/web3";
import { ContractReads } from "@/lib/web3";

export const useContractReads = () => {
  const { isConnected, address } = useAccount();

  const fetchContractData = async (): Promise<ContractReads> => {
    const contract = getContract({
      address: env.bingoContractAddress,
      abi,
      client: publicClient,
    });

    const currentGameId = await contract.read.availableGameId();
    const gameIdToUse = currentGameId - BigInt(1);

    const [
      gameId,
      bingoCardPrice,
      BINGO_MAX_NUMBER,
      BINGO_MIN_NUMBER,
      BINGO_CARD_NUMBERS_COUNT,
      isPlayerExists,
      isDrawnNumbersFilled,
      playerDetails,
      drawnNumbers,
      FINALIZATION_COOLDOWN,
    ] = await Promise.all([
      contract.read.availableGameId(),
      contract.read.BINGO_CARD_PRICE(),
      contract.read.BINGO_MAX_NUMBER(),
      contract.read.BINGO_MIN_NUMBER(),
      contract.read.BINGO_CARD_NUMBERS_COUNT(),
      contract.read.isPlayerExists([gameIdToUse, address as Address]),
      contract.read.isDrawnNumbersFilled([gameIdToUse]),
      contract.read.playerDetails([gameIdToUse, address as Address]),
      contract.read.drawnNumbers([gameIdToUse]),
      contract.read.FINALIZATION_COOLDOWN(),
    ]);

    return {
      gameId,
      bingoCardPrice,
      BINGO_MAX_NUMBER,
      BINGO_MIN_NUMBER,
      BINGO_CARD_NUMBERS_COUNT,
      isPlayerExists,
      isDrawnNumbersFilled,
      playerDetails,
      drawnNumbers,
      FINALIZATION_COOLDOWN,
    };
  };

  return useQuery({
    queryKey: ["contract", "initial-reads"],
    queryFn: fetchContractData,
    enabled: isConnected && !!address,
  });
};
