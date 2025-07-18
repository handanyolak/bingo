import { useEffect, useState } from "react";

import type {
  UseDrawTimerProps,
  UseDrawTimerReturn,
} from "@/app/components/card-manager";
import { useBingoDrawing } from "@/app/hooks";
import { startDrawing } from "@/lib/store/bingo";
import { useAppDispatch } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";
import {
  getUnixTimestamp,
  secondsToMinutes,
  getRemainingSeconds,
} from "@/utils";

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

  const { data } = useContractReads({
    select: (fullData) => ({
      drawnNumbersTimestamp: fullData.drawnNumbersTimestamp,
      finalizationCooldown: fullData.finalizationCooldown,
      isDrawnNumbersFilled: fullData.isDrawnNumbersFilled,
    }),
  });
  const [currentTimestamp, setCurrentTimestamp] = useState(getUnixTimestamp());
  const [isTimerActive, setIsTimerActive] = useState(false);

  const isDataReady =
    !isLoading &&
    !isError &&
    data?.drawnNumbersTimestamp &&
    data?.finalizationCooldown;

  const calculateEndTime = (timestamp: bigint, cooldown: bigint) =>
    Number(timestamp) + Number(cooldown);

  const endTime = isDataReady
    ? calculateEndTime(data?.drawnNumbersTimestamp, data?.finalizationCooldown)
    : 0;

  const remainingTime = Math.max(0, endTime - currentTimestamp);
  const minutesRemaining = secondsToMinutes(remainingTime);
  const secondsRemaining = getRemainingSeconds(remainingTime);

  useEffect(() => {
    if (data?.isDrawnNumbersFilled && !isGameOver) {
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  }, [data?.isDrawnNumbersFilled, isGameOver]);

  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      setCurrentTimestamp(getUnixTimestamp());
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  useEffect(() => {
    if (
      data?.isDrawnNumbersFilled &&
      !isGameOver &&
      data?.drawnNumbersTimestamp &&
      data?.finalizationCooldown
    ) {
      const currentTime = getUnixTimestamp();
      const cooldownEndTimestamp = calculateEndTime(
        data?.drawnNumbersTimestamp,
        data?.finalizationCooldown
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
    data?.isDrawnNumbersFilled,
    data?.drawnNumbersTimestamp,
    data?.finalizationCooldown,
    dispatch,
    isGameOver,
  ]);

  useEffect(() => {
    if (
      !data?.isDrawnNumbersFilled ||
      !data?.finalizationCooldown ||
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
    const totalDuration = Number(data?.finalizationCooldown);

    const speedRatio = animationNaturalDuration / totalDuration;
    lottieAnimation.setSpeed(speedRatio);

    const progress = 1 - remainingTime / totalDuration;
    const frame = Math.floor(progress * totalAnimationFrames);

    lottieAnimation.goToAndPlay(frame, true);

    return () => {
      lottieAnimation.stop();
    };
  }, [
    data?.isDrawnNumbersFilled,
    data?.finalizationCooldown,
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
