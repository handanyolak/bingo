"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { Address } from "viem";
import { decodeEventLog } from "viem";
import { useAccount } from "wagmi";

import { useTransactionToast } from "@/app/hooks/useTransactionToast";
import { env } from "@/config/env";
import { selectIsGameFinishedInUi } from "@/lib/store/bingo";
import { useAppSelector } from "@/lib/store/hooks";
import { publicClient } from "@/lib/web3";
import { abi } from "@/lib/web3";
import { useContractReads, useContractWrite } from "@/lib/web3";
import styles from "@/styles/Winners.module.scss";

interface WinnersProps {
  onAddressClick: (address: Address) => void;
}

export const Winners = ({ onAddressClick }: WinnersProps) => {
  const t = useTranslations();
  const { address } = useAccount();
  const { data: contractData, isLoading } = useContractReads();

  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);

  const {
    claimReward,
    isClaimRewardPending,
    isClaimRewardConfirming,
    isClaimRewardSuccess,
  } = useContractWrite();

  const {
    showInitiatingTransactionToast,
    showSuccessToast,
    showErrorToast,
    dismissToast,
  } = useTransactionToast();

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

  const isClaimButtonDisabled = isClaimRewardPending || isClaimRewardConfirming;

  useEffect(() => {
    if (isClaimRewardSuccess) {
      const toastId = "claimRewardToast";
      showSuccessToast(toastId, t("controls.rewardClaimedMessage"));
    }
  }, [isClaimRewardSuccess, showSuccessToast, t]);

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

  const isWinner =
    address && contractData?.winners.winnerAddresses.includes(address);

  return (
    <div className={styles.winners__list}>
      {isLoading ? (
        <div className={styles.winners__loading}>
          <Loader2 className="global-loader" />
        </div>
      ) : !isGameFinishedInUi ||
        contractData?.winners.winnerAddresses.length === 0 ? (
        <div className={styles.winners__empty}>{t("controls.noWinners")}</div>
      ) : (
        contractData?.winners.winnerAddresses.map((winnerAddress) => (
          <div key={winnerAddress} className={styles.winners__item}>
            <span onClick={() => onAddressClick(winnerAddress)}>
              {winnerAddress}
            </span>
            {address === winnerAddress && (
              <>
                {isLoadingClaimStatus ? (
                  <div className={styles["winners__claim-loading"]}>
                    <Loader2 className="global-loader" size={18} />
                  </div>
                ) : !hasUserClaimedGame(
                    contractData?.targetGameId || BigInt(0)
                  ) ? (
                  <button
                    className={styles["winners__claim-button"]}
                    onClick={handleClaimReward}
                    disabled={isClaimButtonDisabled}
                  >
                    {isClaimButtonDisabled ? (
                      <>
                        <Loader2 className="global-loader" size={14} />
                        {t("controls.claiming")}
                      </>
                    ) : (
                      t("controls.claimReward")
                    )}
                  </button>
                ) : (
                  <div className={styles["winners__claimed-status"]}>
                    {t("controls.rewardClaimed")}
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}

      {!isLoading &&
        isWinner &&
        isGameFinishedInUi &&
        !hasUserClaimedGame(contractData?.targetGameId || BigInt(0)) && (
          <div className={styles["winners__info-box"]}>
            {t("controls.claimInfo")}
          </div>
        )}
    </div>
  );
};
