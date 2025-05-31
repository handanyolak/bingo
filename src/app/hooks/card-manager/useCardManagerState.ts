import { useMemo } from "react";

import type {
  UseCardManagerStateProps,
  UseCardManagerStateReturn,
} from "@/types/card-manager";

export const useCardManagerState = ({
  contractData,
  isConnected,
  remainingTime,
}: UseCardManagerStateProps): UseCardManagerStateReturn => {
  const shouldShowBuyCard = useMemo(() => {
    return (
      isConnected &&
      !contractData?.isPlayerExists &&
      !contractData?.vrfRequested
    );
  }, [isConnected, contractData?.isPlayerExists, contractData?.vrfRequested]);

  const shouldShowRequestRandom = useMemo(() => {
    return contractData?.isPlayerExists && !contractData?.isDrawnNumbersFilled;
  }, [contractData?.isPlayerExists, contractData?.isDrawnNumbersFilled]);

  const shouldShowTimer = useMemo(() => {
    return contractData?.isDrawnNumbersFilled && remainingTime > 0;
  }, [contractData?.isDrawnNumbersFilled, remainingTime]);

  const shouldShowSubmitCard = useMemo(() => {
    return (
      contractData?.isDrawnNumbersFilled &&
      remainingTime > 0 &&
      contractData?.playerDetails?.remainingNumbersCount ===
        contractData?.BINGO_CARD_NUMBERS_COUNT
    );
  }, [
    contractData?.isDrawnNumbersFilled,
    remainingTime,
    contractData?.playerDetails?.remainingNumbersCount,
    contractData?.BINGO_CARD_NUMBERS_COUNT,
  ]);

  return {
    shouldShowBuyCard,
    shouldShowRequestRandom,
    shouldShowTimer,
    shouldShowSubmitCard,
  };
};
