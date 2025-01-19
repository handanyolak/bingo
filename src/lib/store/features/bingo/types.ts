export interface BingoState {
  isDrawing: boolean;
  drawnNumbers: number[];
  bingoNumbers: number[];
}

export type DrawnNumberPayload = number;
export type BingoNumbersPayload = number[];
