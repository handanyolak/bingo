import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  DrawnNumberWithTimestamp,
  type BingoCardNumbers,
  type BingoState,
  type DrawnNumberPayload,
  type CardGenerationConfig,
} from "@/lib/store/bingo";

const generateRandomNumbers = (cardConfig: CardGenerationConfig): number[] => {
  const { BINGO_MIN_NUMBER, BINGO_MAX_NUMBER, BINGO_CARD_NUMBERS_COUNT } =
    cardConfig;

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
  cardNumbers: [] as unknown as BingoCardNumbers,
  isGameFinishedInUi: false,
  drawnNumbersWithTimestamp: [],
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
      if (!state.drawnNumbers.includes(action.payload)) {
        state.drawnNumbers.push(action.payload);
      }
    },
    setGameFinishedInUi: (state, action: PayloadAction<boolean>) => {
      state.isGameFinishedInUi = action.payload;
    },
    setDrawnNumbersWithTimestamp: (
      state,
      action: PayloadAction<DrawnNumberWithTimestamp[]>
    ) => {
      state.drawnNumbersWithTimestamp = action.payload;
    },
    setCardNumbers: (state, action: PayloadAction<BingoCardNumbers>) => {
      state.cardNumbers = action.payload;
    },
    generateCardNumbers: (
      state,
      action: PayloadAction<CardGenerationConfig>
    ) => {
      state.cardNumbers = generateRandomNumbers(
        action.payload
      ) as BingoCardNumbers;
    },
    resetStateForNewGame: (state) => {
      state.isDrawing = false;
      state.drawnNumbers = [];
      state.isGameFinishedInUi = false;
      state.drawnNumbersWithTimestamp = [];
      state.cardNumbers = [] as unknown as BingoCardNumbers;
    },
  },
});

export const {
  startDrawing,
  stopDrawing,
  addDrawnNumber,
  setCardNumbers,
  generateCardNumbers,
  setGameFinishedInUi,
  setDrawnNumbersWithTimestamp,
  resetStateForNewGame,
} = bingoSlice.actions;

export default bingoSlice.reducer;
