import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  type BingoCard,
  type BingoState,
  type DrawnNumberPayload,
} from "./types";

const generateRandomNumbers = (): number[] => {
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
  cardNumbers: generateRandomNumbers() as BingoCard,
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
    generateCardNumbers: (state) => {
      state.cardNumbers = generateRandomNumbers() as BingoCard;
    },
  },
});

export const {
  startDrawing,
  stopDrawing,
  addDrawnNumber,
  generateCardNumbers,
} = bingoSlice.actions;
export default bingoSlice.reducer;
