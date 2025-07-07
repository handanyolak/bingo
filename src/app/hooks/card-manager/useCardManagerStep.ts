import { useMemo } from "react";
import { useAccount } from "wagmi";

import { useDrawTimer } from "@/app/hooks/useDrawTimer";
import { useContractReads } from "@/lib/web3/hooks/useContractReads";
import type { CardManagerStepData } from "@/types/card-manager";

export const useCardManagerStep = (): string | null => {
  const { isConnected } = useAccount();

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

  const { remainingTime } = useDrawTimer({
    lottieRef: undefined,
    timerAnimation: undefined,
  });

  const stepData: CardManagerStepData | undefined =
    isPlayerExists !== undefined
      ? {
          isPlayerExists,
          vrfRequested,
          isDrawnNumbersFilled,
          playerDetails: playerDetails
            ? {
                remainingNumbersCount: playerDetails.remainingNumbersCount,
              }
            : undefined,
          BINGO_CARD_NUMBERS_COUNT,
        }
      : undefined;

  const renderComponent = useMemo((): string | null => {
    if (!isConnected) {
      return null;
    }

    if (!stepData) {
      return null;
    }

    if (!stepData.isPlayerExists && !stepData.vrfRequested) {
      return "buyCard";
    }

    if (stepData.isPlayerExists && !stepData.isDrawnNumbersFilled) {
      return "requestRandom";
    }

    if (
      stepData.isDrawnNumbersFilled &&
      remainingTime > 0 &&
      stepData.playerDetails?.remainingNumbersCount ===
        stepData.BINGO_CARD_NUMBERS_COUNT
    ) {
      return "submitCard";
    }

    if (stepData.isDrawnNumbersFilled && remainingTime > 0) {
      return "timer";
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isConnected,
    stepData?.isPlayerExists,
    stepData?.vrfRequested,
    stepData?.isDrawnNumbersFilled,
    stepData?.playerDetails?.remainingNumbersCount,
    stepData?.BINGO_CARD_NUMBERS_COUNT,
    remainingTime,
  ]);

  return renderComponent;
};
