import { useWaitForTransactionReceipt } from "wagmi";
import { readContract, writeContract } from "@wagmi/core";
import { useState } from "react";
import { sepolia } from "wagmi/chains";
import { useAppSelector } from "@/lib/store/hooks";
import { BingoCard, selectCardNumbers } from "@/lib/store/features/bingo";
import { config } from "@/lib/wagmi/config";
import { abi } from "@/lib/wagmi/abis";
import { env } from "@/config/env";
import { useMutation, useQuery } from "@tanstack/react-query";

const CONTRACT_CONFIG = {
  address: env.bingoContractAddress,
  abi,
  chainId: sepolia.id,
} as const;

interface BingoContractState {
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
  error: Error | null;
}

class BingoContractError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "BingoContractError";
  }
}

export const useBingoContract = (): BingoContractState => {
  const [hash, setHash] = useState<`0x${string}`>();
  const [error, setError] = useState<Error | null>(null);
  const cardNumbers = useAppSelector(selectCardNumbers);

  const {
    data: gameId,
    isError: isGameIdError,
    isLoading: isGameIdLoading,
    refetch: refetchGameId,
  } = useQuery({
    queryKey: ["bingo", "gameId"],
    queryFn: async () => {
      try {
        return await readContract(config, {
          ...CONTRACT_CONFIG,
          functionName: "availableGameId",
        });
      } catch (err) {
        throw new BingoContractError("Failed to fetch game ID", err);
      }
    },
  });

  const { data: bingoCardPrice } = useQuery({
    queryKey: ["bingo", "cardPrice"],
    queryFn: async () => {
      try {
        return await readContract(config, {
          ...CONTRACT_CONFIG,
          functionName: "BINGO_CARD_PRICE",
        });
      } catch (err) {
        throw new BingoContractError("Failed to fetch card price", err);
      }
    },
  });

  const { mutateAsync: buyCardMutation, isPending } = useMutation({
    mutationFn: async () => {
      if (!bingoCardPrice) {
        throw new BingoContractError("Card price not available");
      }

      try {
        return await writeContract(config, {
          ...CONTRACT_CONFIG,
          functionName: "buyCard",
          args: [cardNumbers] as [BingoCard],
          value: bingoCardPrice,
        });
      } catch (err) {
        throw new BingoContractError("Failed to buy card", err);
      }
    },
    onSuccess: (result) => {
      setHash(result);
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error(String(err)));
    },
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const buyCard = async () => {
    try {
      return await buyCardMutation();
    } catch (err) {
      const error = new BingoContractError(
        "Failed to process buy card transaction",
        err
      );
      setError(error);
      throw error;
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
    error,
  };
};
