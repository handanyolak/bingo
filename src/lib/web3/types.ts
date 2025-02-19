import { Address } from "viem";

export type BingoCardNumbers = readonly number[] & { length: 25 };

export interface ContractReads {
  gameId: bigint;
  targetGameId: bigint;
  bingoCardPrice: bigint;
  BINGO_MAX_NUMBER: number;
  BINGO_MIN_NUMBER: number;
  BINGO_CARD_NUMBERS_COUNT: number;
  isPlayerExists: boolean;
  isDrawnNumbersFilled: boolean;
  playerDetails?: {
    playerAddress: string;
    remainingNumbersCount: number;
    cardNumbers: BingoCardNumbers;
    numberBitmap: bigint;
  };
  drawnNumbers: readonly number[];
  finalizationCooldown: bigint;
  drawnNumbersTimestamp: bigint;
  players: {
    addresses: readonly Address[];
    nextCursor: bigint;
  };
}
