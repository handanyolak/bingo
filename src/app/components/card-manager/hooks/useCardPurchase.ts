import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";

import type { UseCardPurchaseReturn } from "@/app/components/card-manager";
import { useTransactionToast } from "@/app/hooks";
import { useContractWrite } from "@/lib/web3";
import { useContractEvents } from "@/lib/web3";
import { useContractReads } from "@/lib/web3";

export const useCardPurchase = (): UseCardPurchaseReturn => {
  const t = useTranslations();
  const [waitingCardEvent, setWaitingCardEvent] = useState(false);

  const { refetch } = useContractReads();

  const {
    showInitiatingTransactionToast,
    showConfirmingTransactionToast,
    showSuccessToast,
    showErrorToast,
    dismissToast,
  } = useTransactionToast();

  const {
    buyBingoCard,
    isBuyCardPending,
    isBuyCardConfirming,
    isBuyCardSuccess,
  } = useContractWrite();

  const handleBuyCard = useCallback(async () => {
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
  }, [
    buyBingoCard,
    showInitiatingTransactionToast,
    dismissToast,
    showErrorToast,
  ]);

  const handleCardPurchased = useCallback(() => {
    if (waitingCardEvent) {
      dismissToast("waitingCardEvent");
      setWaitingCardEvent(false);
      showSuccessToast("waitingCardEvent", t("toast.cardPurchased"));
    }
    refetch();
  }, [refetch, waitingCardEvent, dismissToast, showSuccessToast, t]);

  const handleBuyCardSuccess = useCallback(() => {
    if (waitingCardEvent) {
      setWaitingCardEvent(false);
      showSuccessToast("waitingCardEvent", t("toast.cardPurchased"));
      refetch();
    }
  }, [waitingCardEvent, showSuccessToast, refetch, t]);

  useContractEvents({
    onCardPurchased: handleCardPurchased,
    refetchData: refetch,
  });

  useEffect(() => {
    if (waitingCardEvent && isBuyCardConfirming) {
      showConfirmingTransactionToast("waitingCardEvent");
    }
  }, [waitingCardEvent, isBuyCardConfirming, showConfirmingTransactionToast]);

  useEffect(() => {
    if (isBuyCardSuccess) {
      handleBuyCardSuccess();
    }
  }, [isBuyCardSuccess, handleBuyCardSuccess]);

  const isBuyCardLoading =
    isBuyCardPending || isBuyCardConfirming || waitingCardEvent;

  return {
    handleBuyCard,
    isBuyCardLoading,
  };
};
