export type BingoCard = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export const toBingoCardTuple = (numbers: number[]): BingoCard => {
  if (numbers.length !== 25) {
    throw new Error("Array must contain exactly 25 numbers");
  }
  return numbers as unknown as BingoCard;
};

export interface BingoState {
  isDrawing: boolean;
  drawnNumbers: number[];
  cardNumbers: BingoCard;
}

export type DrawnNumberPayload = number;
export type BingoNumbersPayload = number[];
