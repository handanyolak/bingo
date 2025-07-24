import { LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef } from "react";

import { type UseLottieTimerProps } from "@/app/components/card-manager";
import { useContractReads } from "@/lib/web3";

export const useLottieTimer = ({
  animationData,
  remainingTime,
}: UseLottieTimerProps) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const { data } = useContractReads({
    select: (fullData) => ({
      finalizationCooldown: fullData.finalizationCooldown,
    }),
  });

  const totalDuration = data?.finalizationCooldown
    ? Number(data.finalizationCooldown)
    : 0;

  useEffect(() => {
    if (
      !animationData ||
      remainingTime <= 0 ||
      !lottieRef?.current ||
      !totalDuration
    )
      return;

    const lottieAnimation = lottieRef.current.animationItem;
    if (!lottieAnimation) return;

    const totalAnimationFrames = animationData.op - animationData.ip;
    const animationFrameRate = animationData.fr || 30;
    const animationNaturalDuration = totalAnimationFrames / animationFrameRate;

    const speedRatio = animationNaturalDuration / totalDuration;
    lottieAnimation.setSpeed(speedRatio);

    const progress = 1 - remainingTime / totalDuration;
    const frame = Math.floor(progress * totalAnimationFrames);

    lottieAnimation.goToAndPlay(frame, true);

    return () => {
      lottieAnimation.stop();
    };
  }, [remainingTime, totalDuration, animationData]);

  return { lottieRef };
};
