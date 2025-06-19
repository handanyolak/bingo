import { useAccountChange } from "@/app/contexts/AccountChangeContext";
import { useAccount } from "wagmi";
import { useConfetti } from "@/app/hooks/useConfetti";
import { useWinnerStatus } from "@/app/hooks/useWinnerStatus";
import { useContractReads } from "@/lib/web3";
import { useAppSelector } from "@/lib/store/hooks";
import { selectIsGameFinishedInUi } from "@/lib/store/bingo";

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
