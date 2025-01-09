import { getRequestConfig } from "next-intl/server";

const locales = ["en", "de", "tr"];

export default getRequestConfig(async () => {
  const locale = "en";

  const validLocale = locales.includes(locale) ? locale : "en";

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default,
  };
});
