import { useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { writeContract } from "@wagmi/core";
import { useState } from "react";
import { sepolia } from "wagmi/chains";
import { useAppSelector } from "@/lib/store/hooks";
import { BingoCard, selectCardNumbers } from "@/lib/store/features/bingo";
import { config } from "@/lib/wagmi/config";
import { abi } from "@/lib/wagmi/abis";
import { env } from "@/config/env";

interface BingoContractHookReturn {
  gameId: bigint | undefined;
  isGameIdError: boolean;
  isGameIdLoading: boolean;
  refetchGameId: () => void;
  buyCard: () => Promise<`0x${string}`>;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  hash: `0x${string}` | undefined;
  bingoCardPrice: bigint | undefined;
}

export const useBingoContract = (): BingoContractHookReturn => {
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<`0x${string}`>();

  const cardNumbers = useAppSelector(selectCardNumbers);

  const {
    data: gameId,
    isError: isGameIdError,
    isLoading: isGameIdLoading,
    refetch: refetchGameId,
  } = useReadContract({
    address: env.bingoContractAddress,
    abi,
    functionName: "availableGameId",
    chainId: sepolia.id,
  });

  const { data: bingoCardPrice } = useReadContract({
    address: env.bingoContractAddress,
    abi,
    functionName: "BINGO_CARD_PRICE",
    chainId: sepolia.id,
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const buyCard = async () => {
    try {
      setIsPending(true);

      const result = await writeContract(config, {
        address: env.bingoContractAddress,
        abi,
        functionName: "buyCard",
        args: [cardNumbers] as [BingoCard],
        chainId: sepolia.id,
        value: bingoCardPrice,
      });

      setHash(result);
      return result;
    } catch (error) {
      console.error("Error buying card:", error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return {
    gameId,
    isGameIdError,
    isGameIdLoading,
    refetchGameId,
    buyCard,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    bingoCardPrice,
  };
};
