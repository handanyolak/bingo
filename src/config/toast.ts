export const toastConfig = {
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  theme: "dark" as const,
  toastStyle: {
    backgroundColor: "transparent",
    color: "var(--text)",
  },
} as const;
