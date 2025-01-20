"use client";

import React, { useEffect, useState, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import timerAnimation from "../../../public/animations/timer.json";
import { useTranslations } from "next-intl";
import { AppButton } from "@/app/components/AppButton";
import styles from "@/styles/CardManager.module.scss";
import { useAppDispatch } from "@/lib/store/hooks";
import { startDrawing } from "@/lib/store/features/bingo";

const CARD_SUBMISSION_DEADLINE_SECONDS = 10;

export const CardManager = () => {
  const dispatch = useAppDispatch();
  const translations = useTranslations("controls");
  const lottieAnimationRef = useRef<LottieRefCurrentProps>(null);

  const [submissionTimeRemaining, setSubmissionTimeRemaining] = useState(
    CARD_SUBMISSION_DEADLINE_SECONDS
  );
  const [isCardPurchaseStarted, setIsCardPurchaseStarted] = useState(false);
  const [hasRequestedRandomNumbers, setHasRequestedRandomNumbers] =
    useState(false);
  const [isCardSubmitted, setIsCardSubmitted] = useState(false);

  const minutesRemaining = Math.floor(submissionTimeRemaining / 60);
  const secondsRemaining = submissionTimeRemaining % 60;

  const handleCardPurchase = () => {
    setIsCardPurchaseStarted(true);
  };

  const handleRandomNumberRequest = () => {
    setHasRequestedRandomNumbers(true);
  };

  const handleCardSubmit = () => {
    setIsCardSubmitted(true);
  };

  useEffect(() => {
    if (!isCardPurchaseStarted || !hasRequestedRandomNumbers) return;

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
  }, [isCardPurchaseStarted, hasRequestedRandomNumbers]);

  useEffect(() => {
    if (submissionTimeRemaining <= 0) {
      dispatch(startDrawing());
    }
  }, [submissionTimeRemaining, dispatch]);

  return (
    <div className={styles.cardManager__container}>
      {!isCardPurchaseStarted && (
        <AppButton
          text={translations("buyTheCard")}
          onClick={handleCardPurchase}
        />
      )}

      {isCardPurchaseStarted && !hasRequestedRandomNumbers && (
        <AppButton
          text={translations("requestRandomNumbers")}
          onClick={handleRandomNumberRequest}
        />
      )}

      {hasRequestedRandomNumbers && (
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

      {hasRequestedRandomNumbers && !isCardSubmitted && (
        <AppButton
          text={translations("submitCard")}
          onClick={handleCardSubmit}
        />
      )}
    </div>
  );
};
