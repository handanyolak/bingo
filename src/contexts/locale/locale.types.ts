import React from "react";

import { LanguageCode } from "@/i18n/config";

export type MessageMap = Record<
  LanguageCode,
  Record<string, string | Record<string, string>>
>;

export interface LocaleProviderProps {
  messages: MessageMap;
  children: React.ReactNode;
}

export interface LocaleProviderOptions {
  messages: MessageMap;
}

export interface LocaleProviderState {
  locale: LanguageCode;
  updateLocale: (locale: LanguageCode) => void;
  messages: MessageMap[LanguageCode];
}

export interface LocaleContextValue {
  locale: LanguageCode;
  updateLocale: (locale: LanguageCode) => void;
}

export interface AppProvidersProps {
  messages: MessageMap;
  children: React.ReactNode;
}
