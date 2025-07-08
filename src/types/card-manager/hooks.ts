import { LottieRefCurrentProps } from "lottie-react";
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

export interface UseCardManagerStateProps {
  isConnected: boolean;
  remainingTime: number;
}

export interface UseCardManagerStateReturn {
  shouldShowBuyCard: boolean;
  shouldShowRequestRandom: boolean;
  shouldShowTimer: boolean;
  shouldShowSubmitCard: boolean;
}

export interface CardManagerStepData {
  isPlayerExists: boolean;
  vrfRequested?: boolean;
  isDrawnNumbersFilled?: boolean;
  playerDetails?: {
    remainingNumbersCount: number;
  };
  BINGO_CARD_NUMBERS_COUNT?: number;
}

export interface LottieAnimationData {
  ip: number;
  op: number;
  fr: number;
  [key: string]: unknown;
}

export interface UseDrawTimerProps {
  isLoading?: boolean;
  isError?: boolean;
  lottieRef?: React.RefObject<LottieRefCurrentProps | null>;
  timerAnimation?: LottieAnimationData;
}

export interface UseDrawTimerReturn {
  remainingTime: number;
  minutesRemaining: number;
  secondsRemaining: number;
  endTime: number;
}
