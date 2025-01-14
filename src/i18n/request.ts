import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE } from "@/i18n/config";

const getMessages = async (locale: string) => {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return (await import(`../../messages/${DEFAULT_LOCALE}.json`)).default;
  }
};

export default getRequestConfig(async () => {
  const locale =
    (await cookies()).get("preferred-locale")?.value ?? DEFAULT_LOCALE;
  const messages = await getMessages(locale);

  return { locale, messages };
});
