import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { BingoState, DrawnNumberPayload } from "./types";

const initialState: BingoState = {
  isDrawing: false,
  drawnNumbers: [],
};

export const bingoSlice = createSlice({
  name: "bingo",
  initialState,
  reducers: {
    startDrawing: (state) => {
      state.isDrawing = true;
    },
    stopDrawing: (state) => {
      state.isDrawing = false;
    },
    addDrawnNumber: (state, action: PayloadAction<DrawnNumberPayload>) => {
      state.drawnNumbers.push(action.payload);
    },
  },
});

export const { startDrawing, stopDrawing, addDrawnNumber } = bingoSlice.actions;
export default bingoSlice.reducer;
