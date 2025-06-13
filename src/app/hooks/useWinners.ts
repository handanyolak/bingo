import { useMemo } from "react";

import { UseWinnersProps } from "@/types/winners";

export const useWinners = ({
  contractData,
  isGameFinishedInUi,
  isLoading,
}: Pick<
  UseWinnersProps,
  "contractData" | "isGameFinishedInUi" | "isLoading"
>) => {
  const winnerAddresses = useMemo(() => {
    if (!isGameFinishedInUi) return [];
    return contractData?.winners.winnerAddresses || [];
  }, [isGameFinishedInUi, contractData?.winners.winnerAddresses]);

  const isVisible = isGameFinishedInUi && winnerAddresses.length > 0;

  return {
    winnerAddresses,
    isVisible,
    isGameFinishedInUi,
    isLoading,
  };
};
