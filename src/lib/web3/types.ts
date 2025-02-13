export interface ContractReads {
  gameId: bigint;
  targetGameId: bigint;
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
  drawnNumbers: readonly number[];
  finalizationCooldown: bigint;
  drawnNumbersTimestamp: bigint;
}
