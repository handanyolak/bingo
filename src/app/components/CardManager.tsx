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

  const [submissionTimeRemaining, setSubmissionTimeRemaining] = useState(0);

  const [hasRequestedRandomNumbers, setHasRequestedRandomNumbers] =
    useState(false);
  const [isCardSubmitted, setIsCardSubmitted] = useState(false);

  const minutesRemaining = Math.floor(submissionTimeRemaining / 60);
  const secondsRemaining = submissionTimeRemaining % 60;

  const handleRandomNumberRequest = () => {
    setHasRequestedRandomNumbers(true);
  };

  const handleCardSubmit = () => {
    setIsCardSubmitted(true);
  };

  useEffect(() => {
    if (!contractReadsData?.isDrawnNumbersFilled) return;

    const cardSelectionTimer = setInterval(() => {
      setSubmissionTimeRemaining((previousTime) => {
        if (previousTime <= 0) {
          clearInterval(cardSelectionTimer);
          return 0;
        }
        return previousTime - 1;
      });
    }, 1000);

    setTimeout(() => {
      const lottieAnimation = lottieAnimationRef.current?.animationItem;
      if (lottieAnimation) {
        const totalAnimationFrames = timerAnimation.op - timerAnimation.ip;
        const animationFrameRate = timerAnimation.fr || 30;
        const animationNaturalDuration =
          totalAnimationFrames / animationFrameRate;
        const animationSpeedRatio =
          animationNaturalDuration /
          Number(contractReadsData?.FINALIZATION_COOLDOWN);

        lottieAnimation.setSpeed(animationSpeedRatio);
        lottieAnimation.play();
      }
    }, 100);

    return () => {
      clearInterval(cardSelectionTimer);
    };
  }, [contractReadsData?.isDrawnNumbersFilled]);

  useEffect(() => {
    if (contractReadsData?.FINALIZATION_COOLDOWN) {
      setSubmissionTimeRemaining(
        Number(contractReadsData.FINALIZATION_COOLDOWN)
      );
    }
  }, [contractReadsData?.FINALIZATION_COOLDOWN]);

  const unixTimestamp = useUnixTimestamp();

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

      {contractReadsData &&
        contractReadsData.drawnNumbersTimestamp !== undefined &&
        contractReadsData.FINALIZATION_COOLDOWN !== undefined &&
        Number(
          contractReadsData.drawnNumbersTimestamp +
            contractReadsData.FINALIZATION_COOLDOWN
        ) -
          unixTimestamp >
          0 && (
          <>
            {contractReadsData?.isDrawnNumbersFilled && (
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
                  Time Remaining:{" "}
                  {!isNaN(minutesRemaining) ? minutesRemaining : 0}:
                  {!isNaN(secondsRemaining)
                    ? secondsRemaining.toString().padStart(2, "0")
                    : "00"}
                </div>
              </>
            )}

            {contractReadsData?.isDrawnNumbersFilled && !isCardSubmitted && (
              <AppButton text={t("submitCard")} onClick={handleCardSubmit} />
            )}
          </>
        )}
    </div>
  );
};
