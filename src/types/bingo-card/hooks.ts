export interface CardConfig {
  BINGO_MIN_NUMBER: number;
  BINGO_MAX_NUMBER: number;
  BINGO_CARD_NUMBERS_COUNT: number;
}

export interface UseBingoCardCellProps {
  isRefreshingCard: boolean;
  isGameFinished: boolean;
}
