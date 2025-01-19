import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  BingoState,
  DrawnNumberPayload,
  BingoNumbersPayload,
} from "./types";

const generateInitialNumbers = (): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < 25) {
    const num = Math.floor(Math.random() * 75) + 1;
    numbers.add(num);
  }
  return Array.from(numbers);
};

const initialState: BingoState = {
  isDrawing: false,
  drawnNumbers: [],
  bingoNumbers: generateInitialNumbers(),
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
    setBingoNumbers: (state, action: PayloadAction<BingoNumbersPayload>) => {
      state.bingoNumbers = action.payload;
    },
  },
});

export const { startDrawing, stopDrawing, addDrawnNumber, setBingoNumbers } =
  bingoSlice.actions;
export default bingoSlice.reducer;
