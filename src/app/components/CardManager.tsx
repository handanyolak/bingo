"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useRef } from "react";

import { AppButton } from "@/app/components/common/AppButton";
import { useAppDispatch } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";
import { useContractWrite } from "@/lib/web3/";
import styles from "@/styles/CardManager.module.scss";
import { useDrawTimer } from "@/app/hooks/useDrawTimer";

import timerAnimation from "../../../public/animations/timer.json";

export const CardManager = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations("controls");
  const lottieAnimationRef = useRef<LottieRefCurrentProps>(null);
  const { buyBingoCard, isBuyCardPending, requestRandomNumbers } =
    useContractWrite();
  const { data: contractReadsData, isLoading } = useContractReads();

  const [isCardSubmitted, setIsCardSubmitted] = useState(false);

  const { remainingTime, minutesRemaining, secondsRemaining } = useDrawTimer({
    contractData: contractReadsData,
    lottieRef: lottieAnimationRef,
    timerAnimation,
  });

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
