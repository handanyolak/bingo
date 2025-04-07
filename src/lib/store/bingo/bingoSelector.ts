import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/lib/store";

import { DrawnNumberWithTimestamp } from "./types";

const selectBingo = (state: RootState) => state.bingo;

export const selectDrawnNumbers = createSelector(
  [selectBingo],
  (bingo): number[] => bingo.drawnNumbers
);

export const selectIsDrawing = createSelector(
  [selectBingo],
  (bingo): boolean => bingo.isDrawing
);

export const selectCardNumbers = createSelector(
  [selectBingo],
  (bingo): number[] => bingo.cardNumbers
);

export const selectIsGameFinishedInUi = createSelector(
  [selectBingo],
  (bingo): boolean => bingo.isGameFinishedInUi
);

export const selectDrawnNumbersWithTimestamp = createSelector(
  [selectBingo],
  (bingo): DrawnNumberWithTimestamp[] => bingo.drawnNumbersWithTimestamp
);
