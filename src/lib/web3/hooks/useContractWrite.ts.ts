import { useWaitForTransactionReceipt } from "wagmi";
import { writeContract } from "@wagmi/core";
import { useState } from "react";
import { sepolia } from "wagmi/chains";
import { useAppSelector } from "@/lib/store/hooks";
import { BingoCard, selectCardNumbers } from "@/lib/store/features/bingo";
import { config } from "@/lib/web3/wagmi/config";
import { abi } from "@/lib/web3/abis";
import { env } from "@/config/env";
import { useMutation } from "@tanstack/react-query";
import { useContractReads } from "@/lib/web3/hooks/useContractReads";

interface ContractWriteState {
  buyCard: () => Promise<`0x${string}`>;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  hash: `0x${string}` | undefined;
  error: Error | null;
}

export const useContractWrite = (): ContractWriteState => {
  const [hash, setHash] = useState<`0x${string}`>();
  const [error, setError] = useState<Error | null>(null);
  const cardNumbers = useAppSelector(selectCardNumbers);

  const { data, isError, isLoading } = useContractReads();

  const { mutateAsync: buyCardMutation, isPending } = useMutation({
    mutationFn: async () => {
      if (!data?.bingoCardPrice) {
        throw new Error("Card price not available");
      }

      return await writeContract(config, {
        address: env.bingoContractAddress,
        abi,
        functionName: "buyCard",
        args: [cardNumbers as any],
        chainId: sepolia.id,
        value: data.bingoCardPrice,
      });
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
      const error = new Error("Failed to buy card", { cause: err });
      setError(error);
      throw error;
    }
  };

  return {
    buyCard,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
};
