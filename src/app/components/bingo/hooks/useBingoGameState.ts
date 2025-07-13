import { useAccount } from "wagmi";

import { useConfetti } from "@/app/components/bingo";
import { useWinnerStatus } from "@/app/components/participants";
import { useAccountChange } from "@/app/contexts/AccountChangeContext";
import { selectIsGameFinishedInUi } from "@/lib/store/bingo";
import { useAppSelector } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";

export const useBingoGameState = () => {
  const { key } = useAccountChange();
  const { isConnected } = useAccount();
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);
  const { isLoading: contractLoading } = useContractReads();
  const { isWinner } = useWinnerStatus();

  const { showConfetti, handleConfettiComplete } = useConfetti({
    isGameFinished: isGameFinishedInUi,
    isWinner,
  });

  const shouldShowLoader = contractLoading && isConnected;

  return {
    key,
    contractLoading,
    showConfetti,
    handleConfettiComplete,
    shouldShowLoader,
  };
};
