import React from "react";
import { LanguageCode } from "@/i18n/config";

// LocaleContext Types
export type LocaleContextType = {
  locale: LanguageCode;
  updateLocale: (newLocale: LanguageCode) => void;
};

export type LocaleProviderProps = {
  value: LocaleContextType;
  children: React.ReactNode;
};

// Messages Type
export type Messages = {
  [K in LanguageCode]: {
    [key: string]:
      | string
      | {
          [key: string]: string;
        };
  };
};

// LocaleProvider Hook Types
export interface UseLocaleProviderProps {
  messages: Messages;
}

export interface UseLocaleProviderReturn {
  locale: LanguageCode;
  updateLocale: (newLocale: LanguageCode) => void;
  currentMessages: Messages[LanguageCode];
}

// AppProviders Component Types
export type AppProvidersProps = {
  messages: Messages;
  children: React.ReactNode;
};
