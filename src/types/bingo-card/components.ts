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
