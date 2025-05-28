import { LottieRefCurrentProps } from "lottie-react";
import { ContractReads } from "@/lib/web3";

export interface LottieAnimationData {
  ip: number;
  op: number;
  fr: number;
  [key: string]: unknown;
}

export interface UseDrawTimerProps {
  contractData?: ContractReads;
  isLoading?: boolean;
  isError?: boolean;
  lottieRef?: React.RefObject<LottieRefCurrentProps | null>;
  timerAnimation?: LottieAnimationData;
  isGameOver?: boolean;
}

export interface UseDrawTimerReturn {
  remainingTime: number;
  minutesRemaining: number;
  secondsRemaining: number;
  endTime: number;
}
