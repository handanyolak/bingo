export type BingoCard = number[] & { length: 25 };

export interface BingoState {
  isDrawing: boolean;
  drawnNumbers: number[];
  cardNumbers: BingoCard;
}

export type DrawnNumberPayload = number;
export type BingoNumbersPayload = number[];
