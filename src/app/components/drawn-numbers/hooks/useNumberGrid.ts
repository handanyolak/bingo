import { useMemo } from "react";

import { DEFAULT_BINGO_CONFIG } from "@/constants";
import {
  selectDrawnNumbers,
  selectIsDrawing,
  selectIsGameFinishedInUi,
  selectCardNumbers,
} from "@/lib/store/bingo";
import { useAppSelector } from "@/lib/store/hooks";

export const useNumberGrid = () => {
  const { drawnNumbers, isDrawing, isGameFinishedInUi, userCardNumbers } =
    useAppSelector((state) => ({
      drawnNumbers: selectDrawnNumbers(state),
      isDrawing: selectIsDrawing(state),
      isGameFinishedInUi: selectIsGameFinishedInUi(state),
      userCardNumbers: selectCardNumbers(state),
    }));

  const latestDrawnNumber = drawnNumbers.at(-1) ?? null;
  const totalCells = DEFAULT_BINGO_CONFIG.BINGO_MAX_NUMBER;

  const placeholderCount = useMemo(
    () =>
      totalCells -
      drawnNumbers.length -
      (isDrawing && drawnNumbers.length === 0 ? 1 : 0),
    [totalCells, drawnNumbers.length, isDrawing]
  );

  const placeholderArray = useMemo(
    () => Array.from({ length: placeholderCount }),
    [placeholderCount]
  );

  const shouldShowLoading = isDrawing && drawnNumbers.length === 0;

  return {
    drawnNumbers,
    latestDrawnNumber,
    isDrawing,
    isGameFinishedInUi,
    userCardNumbers,
    placeholderArray,
    shouldShowLoading,
  };
};
