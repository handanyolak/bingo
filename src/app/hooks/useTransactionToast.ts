import { useCallback } from "react";
import { toast } from "react-toastify";

interface UseTransactionToastReturn {
  showInitiatingTransactionToast: (toastId: string) => void;
  showConfirmingTransactionToast: (toastId: string) => void;
  showSuccessToast: (toastId: string, message: string) => void;
  showErrorToast: (error: unknown) => void;
  dismissToast: (toastId: string) => void;
  showWaitingForEventToast: (toastId: string, message: string) => void;
}

export const useTransactionToast = (): UseTransactionToastReturn => {
  const showInitiatingTransactionToast = useCallback((toastId: string) => {
    toast.loading("Initiating blockchain transaction...", { toastId });
  }, []);

  const showConfirmingTransactionToast = useCallback((toastId: string) => {
    toast.update(toastId, {
      render: "Confirming transaction on blockchain...",
      type: "info",
      isLoading: true,
    });
  }, []);

  const showSuccessToast = useCallback((toastId: string, message: string) => {
    toast.dismiss(toastId);
    toast.success(message);
  }, []);

  const showErrorToast = useCallback((error: unknown) => {
    const errorMessage =
      error instanceof Error
        ? error.message.split("Contract Call:")[0].trim().split("\n")[0]
        : "Unknown error";
    toast.error(errorMessage);
  }, []);

  const dismissToast = useCallback((toastId: string) => {
    toast.dismiss(toastId);
  }, []);

  const showWaitingForEventToast = useCallback(
    (toastId: string, message: string) => {
      toast.update(toastId, {
        render: message,
        type: "info",
        isLoading: true,
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
