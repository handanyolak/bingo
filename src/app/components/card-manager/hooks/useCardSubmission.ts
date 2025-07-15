import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";

import type { UseCardSubmissionReturn } from "@/app/components/card-manager";
import { useTransactionToast } from "@/app/hooks";
import { useContractWrite } from "@/lib/web3";

export const useCardSubmission = (): UseCardSubmissionReturn => {
  const t = useTranslations();
  const [waitingSubmitEvent, setWaitingSubmitEvent] = useState(false);

  const {
    showInitiatingTransactionToast,
    showConfirmingTransactionToast,
    showSuccessToast,
    showErrorToast,
    dismissToast,
  } = useTransactionToast();

  const {
    submitCard,
    isSubmitCardPending,
    isSubmitCardConfirming,
    isSubmitCardSuccess,
  } = useContractWrite();

  const handleCardSubmit = useCallback(async () => {
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
  }, [
    submitCard,
    showInitiatingTransactionToast,
    dismissToast,
    showErrorToast,
  ]);

  const handleCardSubmitSuccess = useCallback(() => {
    if (waitingSubmitEvent) {
      setWaitingSubmitEvent(false);
      showSuccessToast("waitingSubmitEvent", t("toast.cardSubmitted"));
    }
  }, [waitingSubmitEvent, showSuccessToast, t]);

  useEffect(() => {
    if (waitingSubmitEvent && isSubmitCardConfirming) {
      showConfirmingTransactionToast("waitingSubmitEvent");
    }
  }, [
    waitingSubmitEvent,
    isSubmitCardConfirming,
    showConfirmingTransactionToast,
  ]);

  useEffect(() => {
    if (isSubmitCardSuccess) {
      handleCardSubmitSuccess();
    }
  }, [isSubmitCardSuccess, handleCardSubmitSuccess]);

  const isSubmitCardLoading =
    isSubmitCardPending || isSubmitCardConfirming || waitingSubmitEvent;

  return {
    handleCardSubmit,
    isSubmitCardLoading,
    isSubmitCardSuccess,
  };
};
