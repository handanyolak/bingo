"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getContract, isAddress } from "viem";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { env } from "@/config/env";
import { publicClient } from "@/lib/web3";
import { abi } from "@/lib/web3";
import { ContractReads } from "@/lib/web3";

interface UseContractReadsOptions<T = ContractReads> {
  select?: (data: ContractReads) => T;
}

export const useContractReads = <T = ContractReads>(
  options?: UseContractReadsOptions<T>
) => {
  const { address, isConnected } = useAccount();
  const search = useSearchParams();

  const urlId = search.get("id");
  const selectedParam = search.get("selectedAddress");

  const addressToCheck = isAddress(selectedParam ?? "")
    ? (selectedParam as Address)
    : address && isAddress(address)
    ? address
    : ("0x0" as Address);

  const fetchContractData = async (): Promise<ContractReads> => {
    const contract = getContract({
      address: env.bingoContractAddress,
      abi,
      client: publicClient,
    });

    const currentGameId = await contract.read.availableGameId();
    const targetGameId = urlId ? BigInt(urlId) : currentGameId;

    const [
      [playerAddresses, playerNextCursor],
      [winnerAddresses, winnerNextCursor],
      BINGO_MAX_NUMBER,
      BINGO_MIN_NUMBER,
      BINGO_CARD_NUMBERS_COUNT,
      { finalizationCooldown, bingoCardPrice },
      isPlayerExists,
      isDrawnNumbersFilled,
      drawnNumbers,
      drawnNumbersTimestamp,
      prizePoolBalance,
      requestRandomnessPayment,
      requestRandomNumbersRefund,
      winningDrawnNumberIndex,
      vrfRequested,
      rewardByWinner,
    ] = await Promise.all([
      contract.read.players([targetGameId, BigInt(0), BigInt(100)]),
      contract.read.winners([targetGameId, BigInt(0), BigInt(100)]),
      contract.read.BINGO_MAX_NUMBER(),
      contract.read.BINGO_MIN_NUMBER(),
      contract.read.BINGO_CARD_NUMBERS_COUNT(),
      contract.read.gameConfig([targetGameId]),
      contract.read.isPlayerExists([targetGameId, addressToCheck]),
      contract.read.isDrawnNumbersFilled([targetGameId]),
      contract.read.drawnNumbers([targetGameId]),
      contract.read.drawnNumbersTimestamp([targetGameId]),
      contract.read.prizePoolBalance([targetGameId]),
      contract.read.requestRandomnessPayment([targetGameId]),
      contract.read.requestRandomNumbersRefund([targetGameId]),
      contract.read.winningDrawnNumberIndex([targetGameId]),
      contract.read.vrfRequested([targetGameId]),
      contract.read.rewardByWinner([targetGameId, addressToCheck]),
    ]);

    let playerDetails;
    if (isPlayerExists) {
      playerDetails = await contract.read.playerDetails([
        targetGameId,
        addressToCheck,
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
      prizePoolBalance,
      requestRandomnessPayment,
      requestRandomNumbersRefund,
      winningDrawnNumberIndex,
      vrfRequested,
      rewardByWinner,
      players: {
        playerAddresses,
        playerNextCursor,
      },
      winners: {
        winnerAddresses,
        winnerNextCursor,
      },
    };
  };

  return useQuery({
    queryKey: ["contract", "game-reads", urlId, addressToCheck],
    queryFn: fetchContractData,
    select: options?.select,
    enabled: !!addressToCheck && isConnected,
  });
};
