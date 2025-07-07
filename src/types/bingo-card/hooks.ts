import { BINGO_CARD_SIZE } from "@/constants/bingo";
import { Fixed } from "@/types/utility";

export interface CardConfig {
  BINGO_MIN_NUMBER: number;
  BINGO_MAX_NUMBER: number;
  BINGO_CARD_NUMBERS_COUNT: number;
}

export type BingoCardNumbers = Fixed<number, typeof BINGO_CARD_SIZE>;
