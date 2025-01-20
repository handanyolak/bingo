import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

const selectBingo = (state: RootState) => state.bingo;

export const selectDrawnNumbers = createSelector(
  [selectBingo],
  (bingo): number[] => bingo.drawnNumbers
);

export const selectIsDrawing = createSelector(
  [selectBingo],
  (bingo): boolean => bingo.isDrawing
);
