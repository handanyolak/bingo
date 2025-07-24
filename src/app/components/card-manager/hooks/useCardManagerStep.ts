import { useMemo } from "react";
import { useAccount } from "wagmi";

import { type CardManagerStepData } from "@/app/components/card-manager";
import { useDrawTimer } from "@/app/components/card-manager/hooks/useDrawTimer";
import { useContractReads } from "@/lib/web3";

export const useCardManagerStep = (): string | null => {
  const { isConnected } = useAccount();

  const { data } = useContractReads({
    select: (fullData) => ({
      isPlayerExists: fullData.isPlayerExists,
      vrfRequested: fullData.vrfRequested,
      isDrawnNumbersFilled: fullData.isDrawnNumbersFilled,
      playerDetails: fullData.playerDetails,
      BINGO_CARD_NUMBERS_COUNT: fullData.BINGO_CARD_NUMBERS_COUNT,
      playersSubmittedTimestamp: fullData.playersSubmittedTimestamp,
    }),
  });

  const { remainingTime } = useDrawTimer({});

  const stepData: CardManagerStepData | undefined =
    data?.isPlayerExists !== undefined
      ? {
          isPlayerExists: data?.isPlayerExists,
          vrfRequested: data?.vrfRequested,
          isDrawnNumbersFilled: data?.isDrawnNumbersFilled,
          playerDetails: data?.playerDetails
            ? {
                remainingNumbersCount:
                  data?.playerDetails.remainingNumbersCount,
              }
            : undefined,
          BINGO_CARD_NUMBERS_COUNT: data?.BINGO_CARD_NUMBERS_COUNT,
        }
      : undefined;

  const renderComponent = useMemo((): string | null => {
    if (!isConnected) {
      return null;
    }

    if (!stepData) {
      return null;
    }

    if (
      data?.playersSubmittedTimestamp &&
      data?.playersSubmittedTimestamp > BigInt(0)
    ) {
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
    data?.playersSubmittedTimestamp,
  ]);

  return renderComponent;
};
