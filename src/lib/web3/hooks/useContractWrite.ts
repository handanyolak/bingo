import { useMutation } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Hash } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { sepolia } from "wagmi/chains";

import { env } from "@/config/env";
import { selectCardNumbers } from "@/lib/store/features/bingo";
import { useAppSelector } from "@/lib/store/hooks";
import { config } from "@/lib/web3";
import { abi } from "@/lib/web3";
import { useContractReads } from "@/lib/web3";


interface ContractWriteState {
  buyBingoCard: () => Promise<Hash>;
  requestRandomNumbers: () => Promise<Hash>;
  isBuyCardPending: boolean;
  isBuyCardConfirming: boolean;
  isBuyCardSuccess: boolean;
  isRequestRandomPending: boolean;
  isRequestRandomConfirming: boolean;
  isRequestRandomSuccess: boolean;
  buyCardHash: Hash | undefined;
  requestRandomHash: Hash | undefined;
  error: Error | null;
}

export const useContractWrite = (): ContractWriteState => {
  const [buyCardHash, setBuyCardHash] = useState<Hash>();
  const [requestRandomHash, setRequestRandomHash] = useState<Hash>();
  const [error, setError] = useState<Error | null>(null);
  const cardNumbers = useAppSelector(selectCardNumbers);
  const { data } = useContractReads();

  const { mutateAsync: buyBingoCard, isPending: isBuyCardPending } =
    useMutation({
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
        setBuyCardHash(result);
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

  const {
    mutateAsync: requestRandomNumbers,
    isPending: isRequestRandomPending,
  } = useMutation({
    mutationFn: async () => {
      try {
        const result = await writeContract(config, {
          address: env.bingoContractAddress,
          abi,
          functionName: "requestRandomNumbers",
          chainId: sepolia.id,
        });
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to request random numbers";
        toast.error(errorMessage);
        throw err;
      }
    },
    onMutate: () => {
      toast.loading("Sending transaction...", {
        toastId: "requestRandomToast",
      });
    },
    onSuccess: (result) => {
      setRequestRandomHash(result);
      setError(null);
      toast.update("requestRandomToast", {
        render: "Confirming transaction...",
        type: "info",
        isLoading: true,
      });
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.dismiss("requestRandomToast");
    },
  });

  const { isLoading: isBuyCardConfirming, isSuccess: isBuyCardSuccess } =
    useWaitForTransactionReceipt({
      hash: buyCardHash,
    });

  const {
    isLoading: isRequestRandomConfirming,
    isSuccess: isRequestRandomSuccess,
  } = useWaitForTransactionReceipt({
    hash: requestRandomHash,
  });

  useEffect(() => {
    if (isBuyCardSuccess) {
      toast.update("buyCardToast", {
        render: "Card purchased successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }, [isBuyCardSuccess]);

  useEffect(() => {
    if (isRequestRandomSuccess) {
      toast.update("requestRandomToast", {
        render: "Random numbers requested successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }, [isRequestRandomSuccess]);

  return {
    buyBingoCard,
    requestRandomNumbers,
    isBuyCardPending,
    isBuyCardConfirming,
    isBuyCardSuccess,
    isRequestRandomPending,
    isRequestRandomConfirming,
    isRequestRandomSuccess,
    buyCardHash,
    requestRandomHash,
    error,
  };
};
