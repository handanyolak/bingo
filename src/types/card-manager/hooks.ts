export interface UseGameStateProps {
  contractData: any;
  lottieRef: any;
  timerAnimation: any;
}

export interface UseCardPurchaseReturn {
  handleBuyCard: () => Promise<void>;
  isBuyCardLoading: boolean;
}

export interface UseRandomNumbersReturn {
  handleRequestRandomNumbers: () => Promise<void>;
  isRequestRandomLoading: boolean;
}

export interface UseCardSubmissionReturn {
  handleCardSubmit: () => Promise<void>;
  isSubmitCardLoading: boolean;
  isSubmitCardSuccess: boolean;
}

export interface UseGameStateReturn {
  remainingTime: number;
  minutesRemaining: number;
  secondsRemaining: number;
}

export interface UseCardManagerStateProps {
  contractData: any;
  isConnected: boolean;
  remainingTime: number;
}

export interface UseCardManagerStateReturn {
  shouldShowBuyCard: boolean;
  shouldShowRequestRandom: boolean;
  shouldShowTimer: boolean;
  shouldShowSubmitCard: boolean;
}
