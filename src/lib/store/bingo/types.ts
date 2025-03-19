export interface BingoState {
  isDrawing: boolean;
  drawnNumbers: number[];
  cardNumbers: BingoCardNumbers;
  isGameFinishedInUi: boolean;
  drawnNumbersWithTimestamp: DrawnNumberWithTimestamp[];
}

export type BingoCardNumbers = number[] & { length: 25 };
export type DrawnNumberPayload = number;
export type BingoNumbersPayload = number[];

export interface DrawnNumberWithTimestamp {
  number: number;
  timestamp: number;
}
