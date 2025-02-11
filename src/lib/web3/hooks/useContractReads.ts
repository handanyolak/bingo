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
      bingoCardPrice,
      BINGO_MAX_NUMBER,
      BINGO_MIN_NUMBER,
      BINGO_CARD_NUMBERS_COUNT,
      FINALIZATION_COOLDOWN,
    ] = await Promise.all([
      contract.read.BINGO_CARD_PRICE(),
      contract.read.BINGO_MAX_NUMBER(),
      contract.read.BINGO_MIN_NUMBER(),
      contract.read.BINGO_CARD_NUMBERS_COUNT(),
      contract.read.FINALIZATION_COOLDOWN(),
    ]);

    const gameDataPromise = Promise.all([
      contract.read.isPlayerExists([targetGameId, address as Address]),
      contract.read.isDrawnNumbersFilled([targetGameId]),
      contract.read.playerDetails([targetGameId, address as Address]),
      contract.read.drawnNumbers([targetGameId]),
      contract.read.drawnNumbersTimestamp([targetGameId]),
    ]).catch(() => {
      const emptyPlayerDetails = {
        playerAddress: "",
        remainingNumbersCount: 0,
        cardNumbers: [] as const,
        numberBitmap: BigInt(0),
      };
      return [false, false, emptyPlayerDetails, [], BigInt(0)] as const;
    });

    const [
      isPlayerExists,
      isDrawnNumbersFilled,
      playerDetails,
      drawnNumbers,
      drawnNumbersTimestamp,
    ] = await gameDataPromise;

    return {
      gameId: currentGameId,
      targetGameId,
      bingoCardPrice,
      BINGO_MAX_NUMBER,
      BINGO_MIN_NUMBER,
      BINGO_CARD_NUMBERS_COUNT,
      FINALIZATION_COOLDOWN,
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
