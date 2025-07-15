import { Address } from "viem";

import { BINGO_CARD_SIZE } from "@/constants/bingo";

export type Fixed<
  T,
  L extends number,
  A extends T[] = []
> = A["length"] extends L ? A : Fixed<T, L, [...A, T]>;

export type ContractCardNumbers = Fixed<number, typeof BINGO_CARD_SIZE>;

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
    cardNumbers: Readonly<ContractCardNumbers>;
    numberBitmap: bigint;
  };
  drawnNumbers: readonly number[];
  finalizationCooldown: bigint;
  drawnNumbersTimestamp: bigint;
  players: {
    playerAddresses: readonly Address[];
    playerNextCursor: bigint;
  };
  winners: {
    winnerAddresses: readonly Address[];
    winnerNextCursor: bigint;
  };
  prizePoolBalance: bigint;
  requestRandomnessPayment: bigint;
  requestRandomNumbersRefund: bigint;
  winningDrawnNumberIndex: number;
  vrfRequested: boolean;
  rewardByWinner?: bigint;
}
