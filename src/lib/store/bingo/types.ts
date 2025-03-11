export type BingoCardNumbers = number[] & { length: 25 };

export interface BingoState {
  isDrawing: boolean;
  drawnNumbers: number[];
  cardNumbers: BingoCardNumbers;
}

export type DrawnNumberPayload = number;
export type BingoNumbersPayload = number[];
