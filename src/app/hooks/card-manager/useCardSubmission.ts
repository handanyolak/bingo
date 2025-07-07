import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";

import { useContractWrite } from "@/lib/web3";
import { useContractReads } from "@/lib/web3/hooks/useContractReads";
import type { UseCardSubmissionReturn } from "@/types";

import { useTransactionToast } from "../useTransactionToast";

export const useCardSubmission = (): UseCardSubmissionReturn => {
  const t = useTranslations();
  const [waitingSubmitEvent, setWaitingSubmitEvent] = useState(false);

  const { refetch } = useContractReads();

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
      refetch();
    }
  }, [waitingSubmitEvent, showSuccessToast, refetch, t]);

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
