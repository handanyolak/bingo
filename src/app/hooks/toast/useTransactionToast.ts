import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "react-toastify";

import { UseTransactionToastReturn } from "@/app/hooks";

export const useTransactionToast = (): UseTransactionToastReturn => {
  const t = useTranslations();

  const showInitiatingTransactionToast = useCallback(
    (toastId: string) => {
      toast.loading(t("toast.initiating"), { toastId });
    },
    [t]
  );

  const showConfirmingTransactionToast = useCallback(
    (toastId: string) => {
      toast.update(toastId, {
        render: t("toast.confirming"),
        type: "info",
        isLoading: true,
      });
    },
    [t]
  );

  const showSuccessToast = useCallback((toastId: string, message: string) => {
    toast.dismiss(toastId);
    toast.success(message);
  }, []);

  const showErrorToast = useCallback(
    (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message.split("Contract Call:")[0].trim().split("\n")[0]
          : t("toast.unknownError");
      toast.error(t("toast.error", { errorMessage }));
    },
    [t]
  );

  const dismissToast = useCallback((toastId: string) => {
    toast.dismiss(toastId);
  }, []);

  const showWaitingForEventToast = useCallback(
    (toastId: string, message: string) => {
      const isWaitingRandomEvent = toastId === "waitingRandomEvent";

      toast.update(toastId, {
        render: message,
        type: "info",
        isLoading: true,
        ...(isWaitingRandomEvent && {
          style: {
            backgroundColor: "var(--theme-color-dark)",
            color: "white",
          },
        }),
      });
    },
    []
  );

  return {
    showInitiatingTransactionToast,
    showConfirmingTransactionToast,
    showSuccessToast,
    showErrorToast,
    dismissToast,
    showWaitingForEventToast,
  };
};
