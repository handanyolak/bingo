import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContractReads } from "@/lib/web3";
import {
  type BingoCardNumbers,
  type BingoState,
  type DrawnNumberPayload,
} from "./types";

const generateRandomNumbers = (contractData: ContractReads): number[] => {
  const { BINGO_MIN_NUMBER, BINGO_MAX_NUMBER, BINGO_CARD_NUMBERS_COUNT } =
    contractData;

  const min = Number(BINGO_MIN_NUMBER);
  const max = Number(BINGO_MAX_NUMBER);
  const count = Number(BINGO_CARD_NUMBERS_COUNT);

  const numbers = new Set<number>();
  while (numbers.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }
  return Array.from(numbers);
};

const initialState: BingoState = {
  isDrawing: false,
  drawnNumbers: [],
  cardNumbers: new Array(25).fill(0) as BingoCardNumbers,
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
    setCardNumbers: (state, action: PayloadAction<BingoCardNumbers>) => {
      state.cardNumbers = action.payload;
    },
    generateCardNumbers: (state, action: PayloadAction<ContractReads>) => {
      state.cardNumbers = generateRandomNumbers(
        action.payload
      ) as BingoCardNumbers;
    },
  },
});

export const {
  startDrawing,
  stopDrawing,
  addDrawnNumber,
  setCardNumbers,
  generateCardNumbers,
} = bingoSlice.actions;
export default bingoSlice.reducer;
