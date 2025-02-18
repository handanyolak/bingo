import { useEffect } from "react";
import { LottieRefCurrentProps } from "lottie-react";
import { startDrawing } from "@/lib/store/features/bingo";
import { useAppDispatch } from "@/lib/store/hooks";
import { ContractReads } from "@/lib/web3";
import {
  getUnixTimestamp,
  useUnixTimestamp,
  secondsToMinutes,
  getRemainingSeconds,
} from "@/lib/utils/time";

interface UseDrawTimerProps {
  contractData: ContractReads | undefined;
  isLoading?: boolean;
  isError?: boolean;
  lottieRef?: React.RefObject<LottieRefCurrentProps | null>;
  timerAnimation?: any;
}

interface UseDrawTimerReturn {
  remainingTime: number;
  minutesRemaining: number;
  secondsRemaining: number;
  endTime: number;
}

export const useDrawTimer = ({
  contractData,
  isLoading = false,
  isError = false,
  lottieRef,
  timerAnimation,
}: UseDrawTimerProps): UseDrawTimerReturn => {
  const dispatch = useAppDispatch();
  const currentTimestamp = useUnixTimestamp();

  const isDataReady = !isLoading && !isError && !!contractData;

  const endTime =
    isDataReady &&
    contractData?.drawnNumbersTimestamp &&
    contractData?.finalizationCooldown
      ? Number(contractData.drawnNumbersTimestamp) +
        Number(contractData.finalizationCooldown)
      : 0;

  const remainingTime = endTime ? Math.max(0, endTime - currentTimestamp) : 0;
  const minutesRemaining = Math.floor(remainingTime / 60);
  const secondsRemaining = remainingTime % 60;

  useEffect(() => {
    if (contractData?.isDrawnNumbersFilled) {
      const currentTime = Math.floor(Date.now() / 1000);
      const cooldownEndTimestamp =
        Number(contractData.drawnNumbersTimestamp) +
        Number(contractData.finalizationCooldown);

      if (currentTime >= cooldownEndTimestamp) {
        dispatch(startDrawing());
      }
    }
  }, [
    contractData?.isDrawnNumbersFilled,
    contractData?.drawnNumbersTimestamp,
    contractData?.finalizationCooldown,
    dispatch,
  ]);

  useEffect(() => {
    if (
      !contractData?.isDrawnNumbersFilled ||
      !contractData?.finalizationCooldown ||
      remainingTime <= 0 ||
      !lottieRef?.current ||
      !timerAnimation
    )
      return;

    const lottieAnimation = lottieRef.current.animationItem;
    if (!lottieAnimation) return;

    const totalAnimationFrames = timerAnimation.op - timerAnimation.ip;
    const animationFrameRate = timerAnimation.fr || 30;
    const animationNaturalDuration = totalAnimationFrames / animationFrameRate;
    const totalDuration = Number(contractData.finalizationCooldown);

    const speedRatio = animationNaturalDuration / totalDuration;
    lottieAnimation.setSpeed(speedRatio);

    const progress = 1 - remainingTime / totalDuration;
    const frame = Math.floor(progress * totalAnimationFrames);

    lottieAnimation.goToAndPlay(frame, true);

    return () => {
      lottieAnimation.stop();
    };
  }, [
    contractData?.isDrawnNumbersFilled,
    contractData?.finalizationCooldown,
    remainingTime,
    lottieRef,
    timerAnimation,
  ]);

  return {
    remainingTime,
    minutesRemaining,
    secondsRemaining,
    endTime,
  };
};
