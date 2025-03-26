"use client";

import { useQuery } from "@tanstack/react-query";
import { getContract, isAddress } from "viem";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { env } from "@/config/env";
import { publicClient } from "@/lib/web3";
import { abi } from "@/lib/web3";
import { ContractReads } from "@/lib/web3";
import { useSearchParams } from "next/navigation";

export const useContractReads = () => {
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");
  const selectedAddressParam = searchParams.get("selectedAddress");

  const addressToCheck =
    selectedAddressParam && isAddress(selectedAddressParam)
      ? (selectedAddressParam as Address)
      : (address as Address);

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
  });
};
