import { createContext, useContext } from "react";

import type { LocaleContextValue } from "@/contexts";

export const LocaleContext = createContext<LocaleContextValue | undefined>(
  undefined
);

export const useLocale = (): LocaleContextValue => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
};
