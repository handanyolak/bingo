import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";

import { AppButton } from "@/app/components/common/AppButton";
import { useBingoDrawing } from "@/app/hooks/useBingoDrawing";
import { useDrawTimer } from "@/app/hooks/useDrawTimer";
import { useTransactionToast } from "@/app/hooks/useTransactionToast";
import { selectIsDrawing } from "@/lib/store/bingo/bingoSelector";
import { startDrawing } from "@/lib/store/bingo/bingoSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";
import { useContractWrite } from "@/lib/web3";
import { useContractEvents } from "@/lib/web3";
import styles from "@/styles/CardManager.module.scss";

import timerAnimation from "../../../public/animations/timer.json";

export const CardManager = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const lottieAnimationRef = useRef<LottieRefCurrentProps>(null);
  const { isConnected } = useAccount();
  const isDrawing = useAppSelector(selectIsDrawing);
  const { drawnNumbers, isGameOver } = useBingoDrawing();

  const {
    showInitiatingTransactionToast,
    showConfirmingTransactionToast,
    showSuccessToast,
    showErrorToast,
    dismissToast,
    showWaitingForEventToast,
  } = useTransactionToast();

  const {
    buyBingoCard,
    requestRandomNumbers,
    submitCard,
    isBuyCardPending,
    isBuyCardConfirming,
    isRequestRandomPending,
    isRequestRandomConfirming,
    isSubmitCardPending,
    isSubmitCardConfirming,
    isSubmitCardSuccess,
    isBuyCardSuccess,
    isRequestRandomSuccess,
  } = useContractWrite();

  const { data: contractData, isLoading, refetch } = useContractReads();

  const [waitingCardEvent, setWaitingCardEvent] = useState(false);
  const [waitingRandomEvent, setWaitingRandomEvent] = useState(false);
  const [waitingSubmitEvent, setWaitingSubmitEvent] = useState(false);

  const { remainingTime, minutesRemaining, secondsRemaining } = useDrawTimer({
    contractData,
    lottieRef: lottieAnimationRef,
    timerAnimation,
    isGameOver,
  });

  const handleBuyCard = async () => {
    try {
      setWaitingCardEvent(true);
      showInitiatingTransactionToast("waitingCardEvent");
      await buyBingoCard();
    } catch (error) {
      setWaitingCardEvent(false);
      dismissToast("waitingCardEvent");
      showErrorToast(error);
      console.error("Error in handleBuyCard:", error);
    }
  };

  const handleRequestRandomNumbers = async () => {
    try {
      setWaitingRandomEvent(true);
      showInitiatingTransactionToast("waitingRandomEvent");
      await requestRandomNumbers();
    } catch (error) {
      setWaitingRandomEvent(false);
      dismissToast("waitingRandomEvent");
      showErrorToast(error);
      console.error("Error in handleRequestRandomNumbers:", error);
    }
  };

  const handleCardSubmit = async () => {
    try {
      setWaitingSubmitEvent(true);
      showInitiatingTransactionToast("waitingSubmitEvent");
      await submitCard();
    } catch (error) {
      setWaitingSubmitEvent(false);
      dismissToast("waitingSubmitEvent");
      showErrorToast(error);
      console.error("Error in handleCardSubmit:", error);
    }
  };

  const handleCardPurchased = useCallback(() => {
    if (waitingCardEvent) {
      dismissToast("waitingCardEvent");
      setWaitingCardEvent(false);
      showSuccessToast("waitingCardEvent", t("toast.cardPurchased"));
    }
    refetch();
  }, [refetch, waitingCardEvent, dismissToast, showSuccessToast, t]);

  const handleDrawnNumbersFilled = useCallback(() => {
    if (waitingRandomEvent) {
      dismissToast("waitingRandomEvent");
      setWaitingRandomEvent(false);
      showSuccessToast("waitingRandomEvent", t("toast.randomNumbersReceived"));
    }
    refetch();
  }, [refetch, waitingRandomEvent, dismissToast, showSuccessToast, t]);

  const handleBuyCardSuccess = useCallback(() => {
    if (waitingCardEvent) {
      setWaitingCardEvent(false);
      showSuccessToast("waitingCardEvent", t("toast.cardPurchased"));
      refetch();
    }
  }, [waitingCardEvent, showSuccessToast, refetch, t]);

  const handleRequestRandomSuccess = useCallback(() => {
    if (waitingRandomEvent) {
      showWaitingForEventToast(
        "waitingRandomEvent",
        t("toast.waitingRandomNumbers")
      );
    }
  }, [waitingRandomEvent, showWaitingForEventToast, t]);

  const handleCardSubmitSuccess = useCallback(() => {
    if (waitingSubmitEvent) {
      setWaitingSubmitEvent(false);
      showSuccessToast("waitingSubmitEvent", t("toast.cardSubmitted"));
      refetch();
    }
  }, [waitingSubmitEvent, showSuccessToast, refetch, t]);

  useContractEvents({
    onCardPurchased: handleCardPurchased,
    onDrawnNumbersFilled: handleDrawnNumbersFilled,
    refetchData: refetch,
  });

  useEffect(() => {
    if (waitingCardEvent && isBuyCardConfirming) {
      showConfirmingTransactionToast("waitingCardEvent");
    }
    if (waitingRandomEvent && isRequestRandomConfirming) {
      showConfirmingTransactionToast("waitingRandomEvent");
    }
    if (waitingSubmitEvent && isSubmitCardConfirming) {
      showConfirmingTransactionToast("waitingSubmitEvent");
    }
  }, [
    waitingCardEvent,
    waitingRandomEvent,
    waitingSubmitEvent,
    isBuyCardConfirming,
    isRequestRandomConfirming,
    isSubmitCardConfirming,
    showConfirmingTransactionToast,
  ]);

  useEffect(() => {
    if (isBuyCardSuccess) {
      handleBuyCardSuccess();
    }
  }, [isBuyCardSuccess, handleBuyCardSuccess]);

  useEffect(() => {
    if (isRequestRandomSuccess) {
      handleRequestRandomSuccess();
    }
  }, [isRequestRandomSuccess, handleRequestRandomSuccess]);

  useEffect(() => {
    if (isSubmitCardSuccess) {
      handleCardSubmitSuccess();
    }
  }, [isSubmitCardSuccess, handleCardSubmitSuccess]);

  useEffect(() => {
    if (
      remainingTime === 0 &&
      contractData?.isDrawnNumbersFilled &&
      !isDrawing &&
      drawnNumbers.length < (contractData?.drawnNumbers?.length || 0) &&
      !isGameOver
    ) {
      dispatch(startDrawing());
    }
  }, [
    remainingTime,
    contractData?.isDrawnNumbersFilled,
    isDrawing,
    drawnNumbers.length,
    contractData?.drawnNumbers?.length,
    dispatch,
    isGameOver,
  ]);

  const isBuyCardLoading =
    isBuyCardPending || isBuyCardConfirming || waitingCardEvent;
  const isRequestRandomLoading =
    isRequestRandomPending || isRequestRandomConfirming || waitingRandomEvent;
  const isSubmitCardLoading =
    isSubmitCardPending || isSubmitCardConfirming || waitingSubmitEvent;

  if (isLoading) {
    return (
      <div className={styles.cardManager__container}>
        <Loader2 className="global-loader" />
      </div>
    );
  }

  return (
    <div className={styles.cardManager__container}>
      {isConnected &&
        !contractData?.isPlayerExists &&
        !contractData?.vrfRequested && (
          <AppButton
            text={t("controls.buyTheCard")}
            animated={!isBuyCardLoading}
            onClick={handleBuyCard}
            contentPosition="right"
            content={isBuyCardLoading && <Loader2 className="global-loader" />}
            disabled={isBuyCardLoading}
          />
        )}

      {contractData?.isPlayerExists && !contractData?.isDrawnNumbersFilled && (
        <AppButton
          text={t("controls.requestRandomNumbers")}
          animated={!isRequestRandomLoading}
          onClick={handleRequestRandomNumbers}
          disabled={isRequestRandomLoading}
          content={
            isRequestRandomLoading && <Loader2 className="global-loader" />
          }
        />
      )}

      {contractData?.isDrawnNumbersFilled && remainingTime > 0 && (
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
            {t("controls.timeRemaining")}{" "}
            {!isNaN(minutesRemaining) ? minutesRemaining : 0}:
            {!isNaN(secondsRemaining)
              ? secondsRemaining.toString().padStart(2, "0")
              : "00"}
          </div>
          {!isSubmitCardSuccess &&
            contractData?.playerDetails?.remainingNumbersCount ===
              contractData?.BINGO_CARD_NUMBERS_COUNT && (
              <AppButton
                text={t("controls.submitCard")}
                animated={!isSubmitCardLoading}
                onClick={handleCardSubmit}
                disabled={isSubmitCardLoading}
                content={
                  isSubmitCardLoading && <Loader2 className="global-loader" />
                }
              />
            )}
        </>
      )}
    </div>
  );
};
