import { useMutation } from "@tanstack/react-query";
import { simulateContract, writeContract } from "@wagmi/core";
import { useState } from "react";
import { Hash } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { sepolia } from "wagmi/chains";

import { env } from "@/config/env";
import { selectCardNumbers } from "@/lib/store/bingo";
import { useAppSelector } from "@/lib/store/hooks";
import { config } from "@/lib/web3";
import { abi } from "@/lib/web3";
import { useContractReads } from "@/lib/web3";

interface ContractWriteState {
  buyBingoCard: () => Promise<Hash>;
  requestRandomNumbers: () => Promise<Hash>;
  submitCard: () => Promise<Hash>;
  claimReward: (gameId: bigint) => Promise<Hash>;
  isBuyCardPending: boolean;
  isBuyCardConfirming: boolean;
  isBuyCardSuccess: boolean;
  isRequestRandomPending: boolean;
  isRequestRandomConfirming: boolean;
  isRequestRandomSuccess: boolean;
  isSubmitCardPending: boolean;
  isSubmitCardConfirming: boolean;
  isSubmitCardSuccess: boolean;
  isClaimRewardPending: boolean;
  isClaimRewardConfirming: boolean;
  isClaimRewardSuccess: boolean;
  buyCardHash: Hash | undefined;
  requestRandomHash: Hash | undefined;
  submitCardHash: Hash | undefined;
  claimRewardHash: Hash | undefined;
}

export const useContractWrite = (): ContractWriteState => {
  const [buyCardHash, setBuyCardHash] = useState<Hash>();
  const [requestRandomHash, setRequestRandomHash] = useState<Hash>();
  const [submitCardHash, setSubmitCardHash] = useState<Hash>();
  const [claimRewardHash, setClaimRewardHash] = useState<Hash>();
  const cardNumbers = useAppSelector(selectCardNumbers);
  const { data } = useContractReads();

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
      onSuccess: (result) => {
        setBuyCardHash(result);
      },
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
    onSuccess: (result) => {
      setRequestRandomHash(result);
    },
  });

  const { mutateAsync: submitCard, isPending: isSubmitCardPending } =
    useMutation({
      mutationFn: async () => {
        const result = await simulateContract(config, {
          address: env.bingoContractAddress,
          abi,
          functionName: "submitCard",
          chainId: sepolia.id,
        });
        return await writeContract(config, result.request);
      },
      onSuccess: (result) => {
        setSubmitCardHash(result);
      },
    });

  const { mutateAsync: claimReward, isPending: isClaimRewardPending } =
    useMutation({
      mutationFn: async (gameId: bigint) => {
        const result = await simulateContract(config, {
          address: env.bingoContractAddress,
          abi,
          functionName: "claimReward",
          args: [gameId],
          chainId: sepolia.id,
        });
        return await writeContract(config, result.request);
      },
      onSuccess: (result) => {
        setClaimRewardHash(result);
      },
    });

  const { isLoading: isBuyCardConfirming, isSuccess: isBuyCardSuccess } =
    useWaitForTransactionReceipt({ hash: buyCardHash });

  const {
    isLoading: isRequestRandomConfirming,
    isSuccess: isRequestRandomSuccess,
  } = useWaitForTransactionReceipt({ hash: requestRandomHash });

  const { isLoading: isSubmitCardConfirming, isSuccess: isSubmitCardSuccess } =
    useWaitForTransactionReceipt({ hash: submitCardHash });

  const {
    isLoading: isClaimRewardConfirming,
    isSuccess: isClaimRewardSuccess,
  } = useWaitForTransactionReceipt({ hash: claimRewardHash });

  return {
    buyBingoCard,
    requestRandomNumbers,
    submitCard,
    claimReward,
    isBuyCardPending,
    isBuyCardConfirming,
    isBuyCardSuccess,
    isRequestRandomPending,
    isRequestRandomConfirming,
    isRequestRandomSuccess,
    isSubmitCardPending,
    isSubmitCardConfirming,
    isSubmitCardSuccess,
    isClaimRewardPending,
    isClaimRewardConfirming,
    isClaimRewardSuccess,
    buyCardHash,
    requestRandomHash,
    submitCardHash,
    claimRewardHash,
  };
};
