import { useEffect } from "react";

import { useBingoDrawing } from "../useBingoDrawing";
import { useDrawTimer } from "../useDrawTimer";
import { selectIsDrawing } from "@/lib/store/bingo/bingoSelector";
import { startDrawing } from "@/lib/store/bingo/bingoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import type {
  UseGameStateProps,
  UseGameStateReturn,
} from "@/types/card-manager";

export const useGameState = ({
  contractData,
  lottieRef,
  timerAnimation,
}: UseGameStateProps): UseGameStateReturn => {
  const dispatch = useAppDispatch();
  const isDrawing = useAppSelector(selectIsDrawing);
  const { drawnNumbers, isGameOver } = useBingoDrawing();

  const { remainingTime, minutesRemaining, secondsRemaining } = useDrawTimer({
    contractData,
    lottieRef,
    timerAnimation,
    isGameOver,
  });

  useEffect(() => {
    if (
      remainingTime === 0 &&
      contractData?.isDrawnNumbersFilled &&
      !isDrawing &&
      drawnNumbers.length < (contractData?.drawnNumbers?.length || 0) &&
      !isGameOver
    ) {
      dispatch(startDrawing());
    }
  }, [
    remainingTime,
    contractData?.isDrawnNumbersFilled,
    isDrawing,
    drawnNumbers.length,
    contractData?.drawnNumbers?.length,
    dispatch,
    isGameOver,
  ]);

  return {
    remainingTime,
    minutesRemaining,
    secondsRemaining,
  };
};
