"use client";

import { createContext, useContext } from "react";

import type { LocaleContextType, LocaleProviderProps } from "@/types/contexts";

const LocaleContext = createContext<LocaleContextType>({} as LocaleContextType);

export const useLocale = () => useContext(LocaleContext);

export const LocaleProvider = ({ value, children }: LocaleProviderProps) => {
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};
