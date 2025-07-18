import { useMemo } from "react";

import { type UseWinnersProps } from "@/app/components/participants";

export const useWinners = ({
  winners,
  isGameFinishedInUi,
  isLoading,
}: UseWinnersProps) => {
  const winnerAddresses = useMemo(() => {
    if (!isGameFinishedInUi) return [];
    return winners?.winnerAddresses || [];
  }, [isGameFinishedInUi, winners?.winnerAddresses]);

  const isVisible = isGameFinishedInUi && winnerAddresses.length > 0;

  return {
    winnerAddresses,
    isVisible,
    isGameFinishedInUi,
    isLoading,
  };
};
