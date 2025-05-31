export interface RefreshButtonProps {
  isRefreshingCard: boolean;
  onRefresh: () => void;
}

export interface BingoCardCellProps {
  number: number;
  isNumberDrawn: boolean;
  isPlayerExists: boolean;
  isRefreshingCard: boolean;
  isPlayerCardComplete: boolean;
  isGameFinished: boolean;
}

export interface BingoCardGridProps {
  playerParticipationStatus: "active" | "notPlayed";
  cardNumbers: number[];
  drawnNumbers: number[];
  isPlayerExists?: boolean;
  isRefreshingCard: boolean;
  isPlayerCardComplete: boolean;
  isGameFinished: boolean;
}
