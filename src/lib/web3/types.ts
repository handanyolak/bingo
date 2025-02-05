export interface ContractReads {
  gameId: bigint;
  bingoCardPrice: bigint;
  BINGO_MAX_NUMBER: number;
  BINGO_MIN_NUMBER: number;
  BINGO_CARD_NUMBERS_COUNT: number;
  isPlayerExists: boolean;
  isDrawnNumbersFilled: boolean;
  playerDetails: {
    playerAddress: string;
    remainingNumbersCount: number;
    cardNumbers: readonly number[];
    numberBitmap: bigint;
  };
}
