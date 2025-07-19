"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useSearchParams } from "next/navigation";
import { useTheme as useNextTheme } from "next-themes";
import { useState, useEffect, useMemo } from "react";
import { zeroAddress } from "viem";

import { DEFAULT_COLOR } from "@/constants";
import { useColorIndex, type UseThemeLogicReturn } from "@/contexts";
import {
  generateColorsFromAddress,
  isValidColor,
  calculateColorVariants,
  updateThemeColors,
} from "@/utils";

export const useThemeLogic = (): UseThemeLogicReturn => {
  const { theme } = useNextTheme();
  const { address } = useAppKitAccount();
  const searchParams = useSearchParams();
  const selectedAddress = searchParams.get("selectedAddress") || zeroAddress;
  const [mounted, setMounted] = useState(false);

  const addressForTheme =
    selectedAddress && selectedAddress !== address ? selectedAddress : address;

  const isViewingOtherPlayer = addressForTheme !== address;

  const colors = useMemo(
    () => generateColorsFromAddress(addressForTheme || undefined),
    [addressForTheme]
  );

  const { currentIndex, cycleColor } = useColorIndex(
    isViewingOtherPlayer,
    colors
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentColor = isValidColor(colors?.[currentIndex])
    ? colors[currentIndex]
    : DEFAULT_COLOR;

  const { light: lightColor, dark: darkColor } =
    calculateColorVariants(currentColor);

  const containerStyle = useMemo(
    () =>
      ({
        "--theme-color": currentColor,
        "--theme-color-light": lightColor,
        "--theme-color-dark": darkColor,
      } as React.CSSProperties),
    [currentColor, lightColor, darkColor]
  );

  useEffect(() => {
    if (!mounted) return;

    updateThemeColors(
      currentColor,
      lightColor,
      darkColor,
      theme as "light" | "dark"
    );
  }, [currentColor, lightColor, darkColor, theme, mounted]);

  return {
    mounted,
    currentColor,
    lightColor,
    darkColor,
    cycleColor,
    containerStyle,
  };
};
