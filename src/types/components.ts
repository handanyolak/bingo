// DrawnNumbers Component Types
export interface DrawnNumbersProps {
  loading?: boolean;
}

export interface CenterNumberProps {
  number: number;
  animationKey: number;
}

export interface NumberCellProps {
  number: number;
  isLatest: boolean;
  animationKey: number;
  index: number;
}

export interface NumberGridProps {
  drawnNumbers: number[];
  latestDrawnNumber: number | null;
  pulseOnce: boolean;
  animationKey: number;
  isGameFinishedInUi: boolean;
  isDrawing: boolean;
  totalCells: number;
}
