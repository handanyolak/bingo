import { BINGO_CARD_SIZE } from "@/constants/bingo";

export interface BingoState {
  isDrawing: boolean;
  drawnNumbers: number[];
  cardNumbers: BingoCardNumbers;
  isGameFinishedInUi: boolean;
  drawnNumbersWithTimestamp: DrawnNumberWithTimestamp[];
}

export type BingoCardNumbers = number[] & { length: typeof BINGO_CARD_SIZE };
export type DrawnNumberPayload = number;
export type BingoNumbersPayload = number[];

export interface DrawnNumberWithTimestamp {
  number: number;
  timestamp: number;
}
