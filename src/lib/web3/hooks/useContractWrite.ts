import { useWaitForTransactionReceipt } from "wagmi";
import { writeContract } from "@wagmi/core";
import { useState, useEffect } from "react";
import { sepolia } from "wagmi/chains";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCardNumbers } from "@/lib/store/features/bingo";
import { config } from "@/lib/web3/reown/config";
import { abi } from "@/lib/web3/abis";
import { env } from "@/config/env";
import { useMutation } from "@tanstack/react-query";
import { useContractReads } from "@/lib/web3/hooks/useContractReads";
import { toast } from "react-toastify";

interface ContractWriteState {
  buyBingoCard: () => Promise<`0x${string}`>;
  isBuyCardPending: boolean;
  isBuyCardConfirming: boolean;
  isBuyCardSuccess: boolean;
  hash: `0x${string}` | undefined;
  error: Error | null;
}

export const useContractWrite = (): ContractWriteState => {
  const [hash, setHash] = useState<`0x${string}`>();
  const [error, setError] = useState<Error | null>(null);
  const cardNumbers = useAppSelector(selectCardNumbers);
  const { data } = useContractReads();

  const { mutateAsync: buyBingoCard, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const result = await writeContract(config, {
          address: env.bingoContractAddress,
          abi,
          functionName: "buyCard",
          args: [cardNumbers as any],
          chainId: sepolia.id,
          value: data?.bingoCardPrice,
        });
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to buy card";
        toast.error(errorMessage);
        throw err;
      }
    },
    onMutate: () => {
      toast.loading("Sending transaction...", {
        toastId: "buyCardToast",
      });
    },
    onSuccess: (result) => {
      setHash(result);
      setError(null);
      toast.update("buyCardToast", {
        render: "Confirming transaction...",
        type: "info",
        isLoading: true,
      });
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.dismiss("buyCardToast");
    },
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.update("buyCardToast", {
        render: "Card purchased successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }, [isSuccess]);

  return {
    buyBingoCard,
    isBuyCardPending: isPending,
    isBuyCardConfirming: isConfirming,
    isBuyCardSuccess: isSuccess,
    hash,
    error,
  };
};
