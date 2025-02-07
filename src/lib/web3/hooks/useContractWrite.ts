import { useMutation } from "@tanstack/react-query";
import { simulateContract, writeContract } from "@wagmi/core";
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

const useSuccessTransactionToast = (
  toastId: string,
  successMessage: string,
  isSuccess: boolean
) => {
  useEffect(() => {
    if (isSuccess) {
      toast.update(toastId, {
        render: successMessage,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }, [isSuccess, toastId, successMessage]);
};

export const useContractWrite = (): ContractWriteState => {
  const [buyCardHash, setBuyCardHash] = useState<Hash>();
  const [requestRandomHash, setRequestRandomHash] = useState<Hash>();
  const [error, setError] = useState<Error | null>(null);
  const cardNumbers = useAppSelector(selectCardNumbers);
  const { data } = useContractReads();

  const handleError = (err: any, toastId: string) => {
    const trimmedMessage = err?.message
      .split("Contract Call:")[0]
      .trim()
      .split("\n")[0];
    toast.error(trimmedMessage);
    setError(err instanceof Error ? err : new Error(String(err)));
    toast.dismiss(toastId);
  };

  const { mutateAsync: buyBingoCard, isPending: isBuyCardPending } =
    useMutation({
      mutationFn: async () => {
        const result = await simulateContract(config, {
          address: env.bingoContractAddress,
          abi,
          functionName: "buyCard",
          args: [cardNumbers as any],
          chainId: sepolia.id,
          value: data?.bingoCardPrice,
        });
        return await writeContract(config, result.request);
      },
      onMutate: () =>
        toast.loading("Simulating transaction...", { toastId: "buyCardToast" }),
      onSuccess: (result) => {
        setBuyCardHash(result);
        setError(null);
        toast.update("buyCardToast", {
          render: "Confirming transaction...",
          type: "info",
          isLoading: true,
        });
      },
      onError: (err) => handleError(err, "buyCardToast"),
    });

  const {
    mutateAsync: requestRandomNumbers,
    isPending: isRequestRandomPending,
  } = useMutation({
    mutationFn: async () => {
      const result = await simulateContract(config, {
        address: env.bingoContractAddress,
        abi,
        functionName: "requestRandomNumbers",
        chainId: sepolia.id,
      });
      return await writeContract(config, result.request);
    },
    onMutate: () =>
      toast.loading("Simulating transaction...", {
        toastId: "requestRandomToast",
      }),
    onSuccess: (result) => {
      setRequestRandomHash(result);
      setError(null);
      toast.update("requestRandomToast", {
        render: "Sending transaction...",
        type: "info",
        isLoading: true,
      });
    },
    onError: (err) => handleError(err, "requestRandomToast"),
  });

  const { isLoading: isBuyCardConfirming, isSuccess: isBuyCardSuccess } =
    useWaitForTransactionReceipt({ hash: buyCardHash });
  const {
    isLoading: isRequestRandomConfirming,
    isSuccess: isRequestRandomSuccess,
  } = useWaitForTransactionReceipt({ hash: requestRandomHash });

  useSuccessTransactionToast(
    "buyCardToast",
    "Card purchased successfully!",
    isBuyCardSuccess
  );
  useSuccessTransactionToast(
    "requestRandomToast",
    "Random numbers requested successfully!",
    isRequestRandomSuccess
  );

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
