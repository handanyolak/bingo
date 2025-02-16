"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useRef, useCallback, useEffect } from "react";

import { AppButton } from "@/app/components/common/AppButton";
import { useAppDispatch } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";
import { useContractWrite } from "@/lib/web3";
import { useContractEvents } from "@/lib/web3";
import styles from "@/styles/CardManager.module.scss";
import { useDrawTimer } from "@/app/hooks/useDrawTimer";

import timerAnimation from "../../../public/animations/timer.json";
import { toast } from "react-toastify";

export const CardManager = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations("controls");
  const lottieAnimationRef = useRef<LottieRefCurrentProps>(null);
  const {
    buyBingoCard,
    requestRandomNumbers,
    isBuyCardPending,
    isBuyCardConfirming,
    isRequestRandomPending,
    isRequestRandomConfirming,
  } = useContractWrite();
  const { data: contractReadsData, isLoading, refetch } = useContractReads();

  const [isCardSubmitted, setIsCardSubmitted] = useState(false);
  const [waitingCardEvent, setWaitingCardEvent] = useState(false);
  const [waitingRandomEvent, setWaitingRandomEvent] = useState(false);

  const { remainingTime, minutesRemaining, secondsRemaining } = useDrawTimer({
    contractData: contractReadsData,
    lottieRef: lottieAnimationRef,
    timerAnimation,
  });

  const handleCardPurchased = useCallback(() => {
    toast.dismiss("waitingCardEvent");
    setWaitingCardEvent(false);
    toast.success("Card successfully purchased!");
    refetch();
  }, [refetch]);

  const handleDrawnNumbersFilled = useCallback(() => {
    toast.dismiss("waitingRandomEvent");
    setWaitingRandomEvent(false);
    toast.success("Random numbers received! Game will start soon.");
    refetch();
  }, [refetch]);

  useContractEvents({
    onCardPurchased: handleCardPurchased,
    onDrawnNumbersFilled: handleDrawnNumbersFilled,
    refetchData: refetch,
  });

  useEffect(() => {
    if (waitingCardEvent && !isBuyCardPending && !isBuyCardConfirming) {
      toast.loading("Getting card details...", {
        toastId: "waitingCardEvent",
      });
    }
    if (
      waitingRandomEvent &&
      !isRequestRandomPending &&
      !isRequestRandomConfirming
    ) {
      toast.loading("Getting random numbers...", {
        toastId: "waitingRandomEvent",
      });
    }
  }, [
    waitingCardEvent,
    waitingRandomEvent,
    isBuyCardPending,
    isBuyCardConfirming,
    isRequestRandomPending,
    isRequestRandomConfirming,
  ]);

  const handleBuyCard = async () => {
    try {
      setWaitingCardEvent(true);
      await buyBingoCard();
    } catch (error) {
      setWaitingCardEvent(false);
      console.error("Error in handleBuyCard:", error);
      toast.error("Error occurred while purchasing the card");
    }
  };

  const handleRequestRandomNumbers = async () => {
    try {
      setWaitingRandomEvent(true);
      await requestRandomNumbers();
    } catch (error) {
      setWaitingRandomEvent(false);
      console.error("Error in handleRequestRandomNumbers:", error);
      toast.error("Error occurred while getting random numbers");
    }
  };

  const handleCardSubmit = () => {
    setIsCardSubmitted(true);
  };

  const isBuyCardLoading =
    isBuyCardPending || isBuyCardConfirming || waitingCardEvent;
  const isRequestRandomLoading =
    isRequestRandomPending || isRequestRandomConfirming || waitingRandomEvent;

  if (isLoading) {
    return (
      <div className={styles.cardManager__container}>
        <Loader2 className="global-loader" />
      </div>
    );
  }

  return (
    <div className={styles.cardManager__container}>
      {!contractReadsData?.isPlayerExists && (
        <AppButton
          text={t("buyTheCard")}
          animated
          onClick={handleBuyCard}
          contentPosition="right"
          content={isBuyCardLoading && <Loader2 className="global-loader" />}
          disabled={isBuyCardLoading}
        />
      )}

      {contractReadsData?.isPlayerExists &&
        !contractReadsData?.isDrawnNumbersFilled && (
          <AppButton
            text={t("requestRandomNumbers")}
            onClick={handleRequestRandomNumbers}
            disabled={isRequestRandomLoading}
            content={
              isRequestRandomLoading && <Loader2 className="global-loader" />
            }
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
