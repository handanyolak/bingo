export interface UseTransactionToastReturn {
  showInitiatingTransactionToast: (toastId: string) => void;
  showConfirmingTransactionToast: (toastId: string) => void;
  showSuccessToast: (toastId: string, message: string) => void;
  showErrorToast: (error: unknown) => void;
  dismissToast: (toastId: string) => void;
  showWaitingForEventToast: (toastId: string, message: string) => void;
}
