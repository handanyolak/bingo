export interface BingoState {
  isDrawing: boolean;
  drawnNumbers: number[];
}

export type DrawnNumberPayload = number;
export type BingoNumbersPayload = number[];
