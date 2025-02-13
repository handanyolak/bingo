"use client";

import { useQuery } from "@tanstack/react-query";
import { getContract } from "viem";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { env } from "@/config/env";
import { publicClient } from "@/lib/web3";
import { abi } from "@/lib/web3";
import { ContractReads } from "@/lib/web3";
import { useSearchParams } from "next/navigation";

export const useContractReads = () => {
  const { isConnected, address } = useAccount();
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");

  const fetchContractData = async (): Promise<ContractReads> => {
    const contract = getContract({
      address: env.bingoContractAddress,
      abi,
      client: publicClient,
    });

    const currentGameId = await contract.read.availableGameId();

    const targetGameId = urlId ? BigInt(urlId) : currentGameId;

    const [
      BINGO_MAX_NUMBER,
      BINGO_MIN_NUMBER,
      BINGO_CARD_NUMBERS_COUNT,
      { finalizationCooldown, bingoCardPrice },
      isPlayerExists,
      isDrawnNumbersFilled,
      drawnNumbers,
      drawnNumbersTimestamp,
    ] = await Promise.all([
      contract.read.BINGO_MAX_NUMBER(),
      contract.read.BINGO_MIN_NUMBER(),
      contract.read.BINGO_CARD_NUMBERS_COUNT(),
      contract.read.gameConfig([targetGameId]),
      contract.read.isPlayerExists([targetGameId, address as Address]),
      contract.read.isDrawnNumbersFilled([targetGameId]),
      contract.read.drawnNumbers([targetGameId]),
      contract.read.drawnNumbersTimestamp([targetGameId]),
    ]);

    let playerDetails;
    if (isPlayerExists) {
      playerDetails = await contract.read.playerDetails([
        targetGameId,
        address as Address,
      ]);
    }

    return {
      gameId: currentGameId,
      targetGameId,
      bingoCardPrice,
      BINGO_MAX_NUMBER,
      BINGO_MIN_NUMBER,
      BINGO_CARD_NUMBERS_COUNT,
      finalizationCooldown,
      isPlayerExists,
      isDrawnNumbersFilled,
      playerDetails,
      drawnNumbers,
      drawnNumbersTimestamp,
    };
  };

  return useQuery({
    queryKey: ["contract", "game-reads", urlId, address],
    queryFn: fetchContractData,
    enabled: isConnected && !!address,
  });
};
