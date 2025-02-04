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

const CARD_SUBMISSION_DEADLINE_SECONDS = 10;

export const CardManager = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations("controls");
  const lottieAnimationRef = useRef<LottieRefCurrentProps>(null);
  const { buyBingoCard, isBuyCardPending, requestRandomNumbers } =
    useContractWrite();

  const { data } = useContractReads();
  const { isPlayerExists, isDrawnNumbersFilled } = data || {};

  const [submissionTimeRemaining, setSubmissionTimeRemaining] = useState(
    CARD_SUBMISSION_DEADLINE_SECONDS
  );
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
    if (!isDrawnNumbersFilled) return;

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
          animationNaturalDuration / CARD_SUBMISSION_DEADLINE_SECONDS;

        lottieAnimation.setSpeed(animationSpeedRatio);
        lottieAnimation.play();
      }
    }, 100);

    return () => {
      clearInterval(cardSelectionTimer);
    };
  }, [isDrawnNumbersFilled]);

  useEffect(() => {
    if (submissionTimeRemaining <= 0) {
      dispatch(startDrawing());
    }
  }, [submissionTimeRemaining, dispatch]);

  return (
    <div className={styles.cardManager__container}>
      {!isPlayerExists && (
        <AppButton
          text={t("buyTheCard")}
          animated
          onClick={buyBingoCard}
          contentPosition="right"
          content={isBuyCardPending && <Loader2 className="global-loader" />}
        />
      )}

      {isPlayerExists && !isDrawnNumbersFilled && (
        <AppButton
          text={t("requestRandomNumbers")}
          onClick={requestRandomNumbers}
        />
      )}

      {isDrawnNumbersFilled && (
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
            Time Remaining: {minutesRemaining}:
            {secondsRemaining.toString().padStart(2, "0")}
          </div>
        </>
      )}

      {isDrawnNumbersFilled && !isCardSubmitted && (
        <AppButton text={t("submitCard")} onClick={handleCardSubmit} />
      )}
    </div>
  );
};
