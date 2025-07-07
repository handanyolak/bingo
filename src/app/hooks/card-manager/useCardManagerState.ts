import { useMemo } from "react";

import { useContractReads } from "@/lib/web3/hooks/useContractReads";
import type {
  UseCardManagerStateProps,
  UseCardManagerStateReturn,
} from "@/types";

export const useCardManagerState = ({
  isConnected,
  remainingTime,
}: UseCardManagerStateProps): UseCardManagerStateReturn => {
  const {
    data: {
      isPlayerExists,
      vrfRequested,
      isDrawnNumbersFilled,
      playerDetails,
      BINGO_CARD_NUMBERS_COUNT,
    } = {},
  } = useContractReads({
    select: (data) => ({
      isPlayerExists: data.isPlayerExists,
      vrfRequested: data.vrfRequested,
      isDrawnNumbersFilled: data.isDrawnNumbersFilled,
      playerDetails: data.playerDetails,
      BINGO_CARD_NUMBERS_COUNT: data.BINGO_CARD_NUMBERS_COUNT,
    }),
  });

  const shouldShowBuyCard = useMemo(() => {
    return isConnected && !isPlayerExists && !vrfRequested;
  }, [isConnected, isPlayerExists, vrfRequested]);

  const shouldShowRequestRandom = useMemo(() => {
    return !!(isPlayerExists && !isDrawnNumbersFilled);
  }, [isPlayerExists, isDrawnNumbersFilled]);

  const shouldShowTimer = useMemo(() => {
    return !!(isDrawnNumbersFilled && remainingTime > 0);
  }, [isDrawnNumbersFilled, remainingTime]);

  const shouldShowSubmitCard = useMemo(() => {
    return !!(
      isDrawnNumbersFilled &&
      remainingTime > 0 &&
      playerDetails?.remainingNumbersCount === BINGO_CARD_NUMBERS_COUNT
    );
  }, [
    isDrawnNumbersFilled,
    remainingTime,
    playerDetails?.remainingNumbersCount,
    BINGO_CARD_NUMBERS_COUNT,
  ]);

  return {
    shouldShowBuyCard,
    shouldShowRequestRandom,
    shouldShowTimer,
    shouldShowSubmitCard,
  };
};
