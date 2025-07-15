import { useState, useMemo } from "react";

import type { LocaleProviderOptions, LocaleProviderState } from "@/contexts";
import { LanguageCode } from "@/i18n/config";
import { getLocale, setLocale } from "@/utils";

export const useLocaleProvider = ({
  messages,
}: LocaleProviderOptions): LocaleProviderState => {
  const [locale, setLoc] = useState<LanguageCode>(
    () => getLocale() as LanguageCode
  );

  const updateLocale = (next: LanguageCode) => {
    setLoc(next);
    setLocale(next);
  };

  const currentMessages = useMemo(() => messages[locale], [messages, locale]);

  return { locale, updateLocale, messages: currentMessages };
};
