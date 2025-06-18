import { useState, useMemo } from "react";
import { LanguageCode } from "@/i18n/config";
import { setLocale, getLocale } from "@/lib/actions";
import type {
  UseLocaleProviderProps,
  UseLocaleProviderReturn,
} from "@/types/contexts";

export const useLocaleProvider = ({
  messages,
}: UseLocaleProviderProps): UseLocaleProviderReturn => {
  // State management
  const [currentLocale, setCurrentLocale] = useState<LanguageCode>(() => {
    return getLocale() as LanguageCode;
  });

  // Update locale function with side effects
  const updateLocale = (newLocale: LanguageCode) => {
    setCurrentLocale(newLocale);
    setLocale(newLocale);
  };

  // Current messages computation
  const currentMessages = useMemo(() => {
    return messages[currentLocale];
  }, [messages, currentLocale]);

  return {
    locale: currentLocale,
    updateLocale,
    currentMessages,
  };
};
