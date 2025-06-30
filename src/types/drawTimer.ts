import { LottieRefCurrentProps } from "lottie-react";

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
