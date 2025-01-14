"use server";

import { cookies } from "next/headers";
import { COOKIE_NAME, DEFAULT_LOCALE } from "@/i18n/config";

export const setLocale = async (locale: string): Promise<void> => {
  (await cookies()).set(COOKIE_NAME, locale, {
    path: "/",
  });
};

export const getLocale = async (): Promise<string> => {
  return (await cookies()).get(COOKIE_NAME)?.value ?? DEFAULT_LOCALE;
};
