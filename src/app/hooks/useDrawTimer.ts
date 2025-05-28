import { LottieRefCurrentProps } from "lottie-react";
import { useEffect, useState } from "react";

import { startDrawing } from "@/lib/store/bingo";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  getUnixTimestamp,
  secondsToMinutes,
  getRemainingSeconds,
} from "@/lib/utils/time";
import { ContractReads } from "@/lib/web3";
import type {
  UseDrawTimerProps,
  UseDrawTimerReturn,
  LottieAnimationData,
} from "@/types";

export const useDrawTimer = ({
  contractData,
  isLoading = false,
  isError = false,
  lottieRef,
  timerAnimation,
  isGameOver = false,
}: UseDrawTimerProps): UseDrawTimerReturn => {
  const dispatch = useAppDispatch();
  const [currentTimestamp, setCurrentTimestamp] = useState(getUnixTimestamp());
  const [isTimerActive, setIsTimerActive] = useState(false);

  const isDataReady = !isLoading && !isError && contractData;

  const calculateEndTime = (timestamp: bigint, cooldown: bigint) =>
    Number(timestamp) + Number(cooldown);

  const endTime = isDataReady
    ? calculateEndTime(
        contractData.drawnNumbersTimestamp,
        contractData.finalizationCooldown
      )
    : 0;

  const remainingTime = Math.max(0, endTime - currentTimestamp);
  const minutesRemaining = secondsToMinutes(remainingTime);
  const secondsRemaining = getRemainingSeconds(remainingTime);

  useEffect(() => {
    if (contractData?.isDrawnNumbersFilled && !isGameOver) {
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  }, [contractData?.isDrawnNumbersFilled, isGameOver]);

  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      setCurrentTimestamp(getUnixTimestamp());
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  useEffect(() => {
    if (contractData?.isDrawnNumbersFilled && !isGameOver) {
      const currentTime = getUnixTimestamp();
      const cooldownEndTimestamp = calculateEndTime(
        contractData.drawnNumbersTimestamp,
        contractData.finalizationCooldown
      );

      if (currentTime >= cooldownEndTimestamp) {
        dispatch(startDrawing());
      } else {
        const timeUntilStart = (cooldownEndTimestamp - currentTime) * 1000;
        const timer = setTimeout(() => {
          dispatch(startDrawing());
        }, timeUntilStart);

        return () => clearTimeout(timer);
      }
    }
  }, [
    contractData?.isDrawnNumbersFilled,
    contractData?.drawnNumbersTimestamp,
    contractData?.finalizationCooldown,
    dispatch,
    isGameOver,
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
