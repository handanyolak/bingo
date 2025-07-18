export interface RefreshButtonProps {
  isRefreshingCard: boolean;
  onRefresh: () => void;
}

export interface BingoCardCellProps {
  number: number;
  isNumberDrawn: boolean;
  isPlayerExists: boolean;
  isRefreshingCard: boolean;
  isGameFinished: boolean;
}

export interface BingoCardGridProps {
  isRefreshingCard: boolean;
}

export interface CardConfig {
  BINGO_MIN_NUMBER: number;
  BINGO_MAX_NUMBER: number;
  BINGO_CARD_NUMBERS_COUNT: number;
}
