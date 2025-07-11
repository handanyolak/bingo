import { useEffect, useState } from "react";

import type {
  UseDrawTimerProps,
  UseDrawTimerReturn,
} from "@/app/components/card-manager/CardManager.types";
import { useBingoDrawing } from "@/app/hooks/useBingoDrawing";
import { startDrawing } from "@/lib/store/bingo";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  getUnixTimestamp,
  secondsToMinutes,
  getRemainingSeconds,
} from "@/lib/utils/time";
import { useContractReads } from "@/lib/web3";

export const useDrawTimer = ({
  isLoading = false,
  isError = false,
  lottieRef,
  timerAnimation,
}: Omit<
  UseDrawTimerProps,
  "contractData" | "isGameOver"
>): UseDrawTimerReturn => {
  const dispatch = useAppDispatch();
  const { isGameOver } = useBingoDrawing();

  const {
    data: {
      drawnNumbersTimestamp,
      finalizationCooldown,
      isDrawnNumbersFilled,
    } = {},
  } = useContractReads({
    select: (data) => ({
      drawnNumbersTimestamp: data.drawnNumbersTimestamp,
      finalizationCooldown: data.finalizationCooldown,
      isDrawnNumbersFilled: data.isDrawnNumbersFilled,
    }),
  });
  const [currentTimestamp, setCurrentTimestamp] = useState(getUnixTimestamp());
  const [isTimerActive, setIsTimerActive] = useState(false);

  const isDataReady =
    !isLoading && !isError && drawnNumbersTimestamp && finalizationCooldown;

  const calculateEndTime = (timestamp: bigint, cooldown: bigint) =>
    Number(timestamp) + Number(cooldown);

  const endTime = isDataReady
    ? calculateEndTime(drawnNumbersTimestamp, finalizationCooldown)
    : 0;

  const remainingTime = Math.max(0, endTime - currentTimestamp);
  const minutesRemaining = secondsToMinutes(remainingTime);
  const secondsRemaining = getRemainingSeconds(remainingTime);

  useEffect(() => {
    if (isDrawnNumbersFilled && !isGameOver) {
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  }, [isDrawnNumbersFilled, isGameOver]);

  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      setCurrentTimestamp(getUnixTimestamp());
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  useEffect(() => {
    if (
      isDrawnNumbersFilled &&
      !isGameOver &&
      drawnNumbersTimestamp &&
      finalizationCooldown
    ) {
      const currentTime = getUnixTimestamp();
      const cooldownEndTimestamp = calculateEndTime(
        drawnNumbersTimestamp,
        finalizationCooldown
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
    isDrawnNumbersFilled,
    drawnNumbersTimestamp,
    finalizationCooldown,
    dispatch,
    isGameOver,
  ]);

  useEffect(() => {
    if (
      !isDrawnNumbersFilled ||
      !finalizationCooldown ||
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
    const totalDuration = Number(finalizationCooldown);

    const speedRatio = animationNaturalDuration / totalDuration;
    lottieAnimation.setSpeed(speedRatio);

    const progress = 1 - remainingTime / totalDuration;
    const frame = Math.floor(progress * totalAnimationFrames);

    lottieAnimation.goToAndPlay(frame, true);

    return () => {
      lottieAnimation.stop();
    };
  }, [
    isDrawnNumbersFilled,
    finalizationCooldown,
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
