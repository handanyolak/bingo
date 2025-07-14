import { useAppKitAccount } from "@reown/appkit/react";
import { useSearchParams } from "next/navigation";
import { useTheme as useNextTheme } from "next-themes";
import { useState, useEffect, useMemo, useRef } from "react";
import { zeroAddress } from "viem";

import { DEFAULT_COLOR } from "@/constants";
import type { UseThemeLogicReturn } from "@/contexts";
import {
  generateColorsFromAddress,
  isValidColor,
  ThemeStyleManager,
  calculateColorVariants,
} from "@/utils/theme";

import { useColorIndex } from "./useColorIndex";

export const useThemeLogic = (): UseThemeLogicReturn => {
  const { theme } = useNextTheme();
  const { address } = useAppKitAccount();
  const searchParams = useSearchParams();
  const selectedAddress = searchParams.get("selectedAddress") || zeroAddress;
  const [mounted, setMounted] = useState(false);
  const styleManagerRef = useRef<ThemeStyleManager | null>(null);

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

  // Initialize theme system on client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      styleManagerRef.current = new ThemeStyleManager();
    }
  }, []);

  // Select current color from generated palette with fallback
  const currentColor = isValidColor(colors?.[currentIndex])
    ? colors[currentIndex]
    : DEFAULT_COLOR;

  // Generate light/dark variants for current theme color
  const { light: lightColor, dark: darkColor } =
    calculateColorVariants(currentColor);

  // CSS custom properties for inline styling (component-level)
  const containerStyle = useMemo(
    () =>
      ({
        "--theme-color": currentColor,
        "--theme-color-light": lightColor,
        "--theme-color-dark": darkColor,
      } as React.CSSProperties),
    [currentColor, lightColor, darkColor]
  );

  // Apply theme colors to global CSS variables (document-level)
  useEffect(() => {
    if (typeof window === "undefined" || !styleManagerRef.current) return;

    styleManagerRef.current.updateThemeVariables(
      currentColor,
      lightColor,
      darkColor,
      theme || "light"
    );
  }, [currentColor, lightColor, darkColor, theme]);

  return {
    mounted,
    currentColor,
    lightColor,
    darkColor,
    cycleColor,
    containerStyle,
  };
};
