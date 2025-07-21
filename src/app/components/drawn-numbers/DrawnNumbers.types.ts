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
  isInUserCard: boolean;
}

export interface NumberGridProps {
  pulseOnce: boolean;
  animationKey: number;
}

export interface UseNumberGridProps {
  drawnNumbers: number[];
  totalCells: number;
  isDrawing: boolean;
}

export interface UseDrawnNumbersDisplayReturn {
  isVisible: boolean;
  currentNumber: number | null;
  showingNumber: boolean;
  pulseOnce: boolean;
  animationKey: number;
  isGameFinishedInUi: boolean;
  isConnected: boolean;
}
