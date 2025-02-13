"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState, useRef } from "react";

import { AppButton } from "@/app/components/common/AppButton";
import { startDrawing } from "@/lib/store/features/bingo";
import { useAppDispatch } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";
import { useContractWrite } from "@/lib/web3/";
import styles from "@/styles/CardManager.module.scss";

import timerAnimation from "../../../public/animations/timer.json";
import { useUnixTimestamp } from "../hooks/useUnixTimestamp";

export const CardManager = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations("controls");
  const lottieAnimationRef = useRef<LottieRefCurrentProps>(null);
  const { buyBingoCard, isBuyCardPending, requestRandomNumbers } =
    useContractWrite();
  const { data: contractReadsData, isLoading } = useContractReads();
  const currentTimestamp = useUnixTimestamp();

  const [isCardSubmitted, setIsCardSubmitted] = useState(false);

  const endTime =
    contractReadsData?.drawnNumbersTimestamp &&
    contractReadsData?.finalizationCooldown
      ? Number(contractReadsData.drawnNumbersTimestamp) +
        Number(contractReadsData.finalizationCooldown)
      : 0;

  const remainingTime = endTime ? Math.max(0, endTime - currentTimestamp) : 0;
  const minutesRemaining = Math.floor(remainingTime / 60);
  const secondsRemaining = remainingTime % 60;

  useEffect(() => {
    if (
      !contractReadsData?.isDrawnNumbersFilled ||
      !contractReadsData?.finalizationCooldown ||
      remainingTime <= 0
    )
      return;

    const lottieAnimation = lottieAnimationRef.current?.animationItem;
    if (!lottieAnimation) return;

    const totalAnimationFrames = timerAnimation.op - timerAnimation.ip;
    const animationFrameRate = timerAnimation.fr || 30;
    const animationNaturalDuration = totalAnimationFrames / animationFrameRate;
    const totalDuration = Number(contractReadsData.finalizationCooldown);

    const speedRatio = animationNaturalDuration / totalDuration;
    lottieAnimation.setSpeed(speedRatio);

    const progress = 1 - remainingTime / totalDuration;
    const frame = Math.floor(progress * totalAnimationFrames);

    lottieAnimation.goToAndPlay(frame, true);

    return () => {
      lottieAnimation.stop();
    };
  }, [
    contractReadsData?.isDrawnNumbersFilled,
    contractReadsData?.finalizationCooldown,
    remainingTime,
  ]);

  const handleCardSubmit = () => {
    setIsCardSubmitted(true);
  };

  return (
    <div className={styles.cardManager__container}>
      {!contractReadsData?.isPlayerExists && (
        <AppButton
          text={t("buyTheCard")}
          animated
          onClick={buyBingoCard}
          contentPosition="right"
          content={isBuyCardPending && <Loader2 className="global-loader" />}
        />
      )}

      {contractReadsData?.isPlayerExists &&
        !contractReadsData?.isDrawnNumbersFilled && (
          <AppButton
            text={t("requestRandomNumbers")}
            onClick={requestRandomNumbers}
          />
        )}

      {contractReadsData?.isDrawnNumbersFilled && remainingTime > 0 && (
        <>
          <div className={styles.cardManager__timer}>
            <Lottie
              lottieRef={lottieAnimationRef}
              animationData={timerAnimation}
              loop={false}
              autoplay={false}
            />
          </div>
          <div className={styles.cardManager__time}>
            Time Remaining: {!isNaN(minutesRemaining) ? minutesRemaining : 0}:
            {!isNaN(secondsRemaining)
              ? secondsRemaining.toString().padStart(2, "0")
              : "00"}
          </div>
          {!isCardSubmitted && (
            <AppButton text={t("submitCard")} onClick={handleCardSubmit} />
          )}
        </>
      )}
    </div>
  );
};
