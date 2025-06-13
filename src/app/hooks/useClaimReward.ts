import { useEffect, useState, useCallback } from "react";
import { decodeEventLog } from "viem";

import { env } from "@/config/env";
import { publicClient } from "@/lib/web3";
import { abi } from "@/lib/web3";
import { UseClaimRewardProps } from "@/types/winners";

export const useClaimReward = ({
  address,
  contractData,
  claimReward,
  isClaimRewardPending,
  isClaimRewardConfirming,
  isClaimRewardSuccess,
  showInitiatingTransactionToast,
  showSuccessToast,
  showErrorToast,
  dismissToast,
  rewardClaimedMessage,
}: UseClaimRewardProps) => {
  const [claimedGameIds, setClaimedGameIds] = useState<string[]>([]);
  const [isLoadingClaimStatus, setIsLoadingClaimStatus] = useState(false);

  const hasUserClaimedGame = useCallback(
    (gameId: bigint) => {
      return claimedGameIds.includes(gameId.toString());
    },
    [claimedGameIds]
  );

  const handleClaimReward = async () => {
    const toastId = "claimRewardToast";
    try {
      if (!contractData?.targetGameId) {
        return;
      }

      showInitiatingTransactionToast(toastId);

      try {
        await claimReward(contractData.targetGameId);
      } catch (txError) {
        dismissToast(toastId);
        showErrorToast(txError);
        console.error("Transaction error:", txError);
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      dismissToast(toastId);
      showErrorToast(error);
    }
  };

  const fetchClaimedRewards = useCallback(async () => {
    if (!address || !contractData?.targetGameId) return;

    setIsLoadingClaimStatus(true);

    try {
      const gameLogs = await publicClient.getLogs({
        address: env.bingoContractAddress,
        event: {
          type: "event",
          name: "RewardClaimed",
          inputs: [
            { indexed: true, name: "gameId", type: "uint256" },
            { indexed: true, name: "winner", type: "address" },
            { indexed: false, name: "claimAmount", type: "uint256" },
          ],
        },
        args: {
          winner: address,
          gameId: contractData.targetGameId,
        },
        fromBlock: BigInt(0),
        toBlock: "latest",
      });

      const gameIds = gameLogs.map((log) => {
        const decoded = decodeEventLog({
          abi,
          data: log.data,
          topics: log.topics,
        });
        return decoded.args.gameId.toString();
      });

      setClaimedGameIds((prevIds) => {
        const combinedIds = [...new Set([...prevIds, ...gameIds])];
        return combinedIds;
      });
    } catch (error) {
      console.error("Error fetching claimed rewards:", error);
    } finally {
      setIsLoadingClaimStatus(false);
    }
  }, [address, contractData?.targetGameId]);

  useEffect(() => {
    if (isClaimRewardSuccess) {
      const toastId = "claimRewardToast";
      showSuccessToast(toastId, rewardClaimedMessage);
    }
  }, [isClaimRewardSuccess, showSuccessToast, rewardClaimedMessage]);

  useEffect(() => {
    if (address) {
      fetchClaimedRewards();
    } else {
      setClaimedGameIds([]);
    }
  }, [address, fetchClaimedRewards]);

  useEffect(() => {
    if (address && contractData?.targetGameId) {
      fetchClaimedRewards();
    }
  }, [contractData?.targetGameId, address, fetchClaimedRewards]);

  useEffect(() => {
    if (isClaimRewardSuccess && contractData?.targetGameId) {
      const gameId = contractData.targetGameId.toString();
      if (!claimedGameIds.includes(gameId)) {
        setClaimedGameIds([...claimedGameIds, gameId]);
      }

      setTimeout(() => {
        fetchClaimedRewards();
      }, 5000);
    }
  }, [
    isClaimRewardSuccess,
    contractData?.targetGameId,
    claimedGameIds,
    fetchClaimedRewards,
  ]);

  const isClaimButtonDisabled = isClaimRewardPending || isClaimRewardConfirming;

  return {
    handleClaimReward,
    hasUserClaimedGame,
    isClaimButtonDisabled,
    isLoadingClaimStatus,
    isClaimRewardPending,
    isClaimRewardConfirming,
    claimedGameIds,
  };
};
