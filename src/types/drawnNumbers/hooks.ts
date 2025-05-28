export interface UseDrawnNumbersDisplayReturn {
  isVisible: boolean;
  currentNumber: number | null;
  showingNumber: boolean;
  pulseOnce: boolean;
  animationKey: number;
  totalCells: number;
  latestDrawnNumber: number | null;
  drawnNumbers: number[];
  isDrawing: boolean;
  isGameFinishedInUi: boolean;
  isConnected: boolean;
}
