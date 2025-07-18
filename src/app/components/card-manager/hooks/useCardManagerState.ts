import { useMemo } from "react";

import {
  type UseCardManagerStateProps,
  type UseCardManagerStateReturn,
} from "@/app/components/card-manager";
import { useContractReads } from "@/lib/web3";

export const useCardManagerState = ({
  isConnected,
  remainingTime,
}: UseCardManagerStateProps): UseCardManagerStateReturn => {
  const { data } = useContractReads({
    select: (fullData) => ({
      isPlayerExists: fullData.isPlayerExists,
      vrfRequested: fullData.vrfRequested,
      isDrawnNumbersFilled: fullData.isDrawnNumbersFilled,
      playerDetails: fullData.playerDetails,
      BINGO_CARD_NUMBERS_COUNT: fullData.BINGO_CARD_NUMBERS_COUNT,
    }),
  });

  const shouldShowBuyCard = useMemo(() => {
    return isConnected && !data?.isPlayerExists && !data?.vrfRequested;
  }, [isConnected, data?.isPlayerExists, data?.vrfRequested]);

  const shouldShowRequestRandom = useMemo(() => {
    return !!(data?.isPlayerExists && !data?.isDrawnNumbersFilled);
  }, [data?.isPlayerExists, data?.isDrawnNumbersFilled]);

  const shouldShowTimer = useMemo(() => {
    return !!(data?.isDrawnNumbersFilled && remainingTime > 0);
  }, [data?.isDrawnNumbersFilled, remainingTime]);

  const shouldShowSubmitCard = useMemo(() => {
    return !!(
      data?.isDrawnNumbersFilled &&
      remainingTime > 0 &&
      data?.playerDetails?.remainingNumbersCount ===
        data?.BINGO_CARD_NUMBERS_COUNT
    );
  }, [
    data?.isDrawnNumbersFilled,
    remainingTime,
    data?.playerDetails?.remainingNumbersCount,
    data?.BINGO_CARD_NUMBERS_COUNT,
  ]);

  return {
    shouldShowBuyCard,
    shouldShowRequestRandom,
    shouldShowTimer,
    shouldShowSubmitCard,
  };
};
