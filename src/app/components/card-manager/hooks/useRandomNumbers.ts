import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";

import type { UseRandomNumbersReturn } from "@/app/components/card-manager";
import { useTransactionToast } from "@/app/hooks";
import { useContractWrite } from "@/lib/web3";
import { useContractEvents } from "@/lib/web3";
import { useContractReads } from "@/lib/web3";

export const useRandomNumbers = (): UseRandomNumbersReturn => {
  const t = useTranslations();
  const [waitingRandomEvent, setWaitingRandomEvent] = useState(false);

  const { refetch } = useContractReads();

  const {
    showInitiatingTransactionToast,
    showConfirmingTransactionToast,
    showSuccessToast,
    showErrorToast,
    dismissToast,
    showWaitingForEventToast,
  } = useTransactionToast();

  const {
    requestRandomNumbers,
    isRequestRandomPending,
    isRequestRandomConfirming,
    isRequestRandomSuccess,
  } = useContractWrite();

  const handleRequestRandomNumbers = useCallback(async () => {
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
  }, [
    requestRandomNumbers,
    showInitiatingTransactionToast,
    dismissToast,
    showErrorToast,
  ]);

  const handleDrawnNumbersFilled = useCallback(() => {
    if (waitingRandomEvent) {
      dismissToast("waitingRandomEvent");
      setWaitingRandomEvent(false);
      showSuccessToast("waitingRandomEvent", t("toast.randomNumbersReceived"));
    }
    refetch();
  }, [refetch, waitingRandomEvent, dismissToast, showSuccessToast, t]);

  const handleRequestRandomSuccess = useCallback(() => {
    if (waitingRandomEvent) {
      showWaitingForEventToast(
        "waitingRandomEvent",
        t("toast.waitingRandomNumbers")
      );
    }
  }, [waitingRandomEvent, showWaitingForEventToast, t]);

  useContractEvents({
    onDrawnNumbersFilled: handleDrawnNumbersFilled,
    refetchData: refetch,
  });

  useEffect(() => {
    if (waitingRandomEvent && isRequestRandomConfirming) {
      showConfirmingTransactionToast("waitingRandomEvent");
    }
  }, [
    waitingRandomEvent,
    isRequestRandomConfirming,
    showConfirmingTransactionToast,
  ]);

  useEffect(() => {
    if (isRequestRandomSuccess) {
      handleRequestRandomSuccess();
    }
  }, [isRequestRandomSuccess, handleRequestRandomSuccess]);

  const isRequestRandomLoading =
    isRequestRandomPending || isRequestRandomConfirming || waitingRandomEvent;

  return {
    handleRequestRandomNumbers,
    isRequestRandomLoading,
  };
};
