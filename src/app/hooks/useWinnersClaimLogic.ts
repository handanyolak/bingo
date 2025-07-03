import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import { useIsViewingOwnCard } from "@/app/hooks/useIsViewingOwnCard";
import { useTransactionToast } from "@/app/hooks/useTransactionToast";
import { useWinnerStatus } from "@/app/hooks/useWinnerStatus";
import { selectIsGameFinishedInUi } from "@/lib/store/bingo";
import { useAppSelector } from "@/lib/store/hooks";
import { useContractReads, useContractWrite } from "@/lib/web3";

interface UseWinnersClaimLogicProps {
  isLoading: boolean;
}

export const useWinnersClaimLogic = ({
  isLoading,
}: UseWinnersClaimLogicProps) => {
  const t = useTranslations();
  const { address } = useAccount();
  const { data: contractData, refetch } = useContractReads();
  const { isWinner } = useWinnerStatus();
  const { isViewingOwnCard } = useIsViewingOwnCard();
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

  const userRewardAmount = contractData?.rewardByWinner || BigInt(0);
  const hasClaimableReward = userRewardAmount > BigInt(0);

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

      refetch();
    }
  }, [isClaimRewardSuccess, showSuccessToast, t, refetch]);

  return {
    handleClaimReward,
    isClaimButtonDisabled,
    hasClaimableReward,
    userRewardAmount,
    isGameFinishedInUi,
    isWinner,
    address,
    isViewingOwnCard,
  };
};
