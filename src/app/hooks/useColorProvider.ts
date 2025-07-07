import { useTheme } from "next-themes";
import { lighten, darken } from "polished";
import { useEffect, useMemo } from "react";

import type { UseColorProviderProps, UseColorProviderReturn } from "@/types";

export const useColorProvider = ({
  color,
  colors,
  currentIndex,
  setCurrentIndex,
}: UseColorProviderProps): UseColorProviderReturn => {
  const { theme } = useTheme();

  // Color calculations
  const lightColor = useMemo(() => lighten(0.1, color), [color]);
  const darkColor = useMemo(() => darken(0.1, color), [color]);

  // Cycle color function
  const cycleColor = () => {
    if (!colors?.length) return;
    const nextIndex = (currentIndex + 1) % colors.length;
    setCurrentIndex(nextIndex);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedColorIndex", nextIndex.toString());
    }
  };

  // RGB conversion utility
  const getRGBValues = (color: string): [number, number, number] => {
    if (color.startsWith("rgb")) {
      const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      return rgbMatch
        ? (rgbMatch.slice(1).map(Number) as [number, number, number])
        : [158, 102, 171];
    }
    if (color.startsWith("#")) {
      const hex = color.replace("#", "");
      if (hex.length === 6) {
        return [
          parseInt(hex.substring(0, 2), 16),
          parseInt(hex.substring(2, 4), 16),
          parseInt(hex.substring(4, 6), 16),
        ];
      }
    }
    return [158, 102, 171];
  };

  // Style object for component
  const containerStyle = useMemo(
    () =>
      ({
        "--theme-color": color,
        "--theme-color-light": lightColor,
        "--theme-color-dark": darkColor,
      } as React.CSSProperties),
    [color, lightColor, darkColor]
  );

  // DOM manipulation side effects
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const [r, g, b] = getRGBValues(color);

    const blobOpacity = theme === "dark" ? 0.9 : 0.98;
    const borderOpacity = theme === "dark" ? 0.7 : 0.6;
    const letterOpacity = theme === "dark" ? 0.45 : 0.4;

    const setCSSVariables = () => {
      // Background blob colors
      root.style.setProperty(
        "--blob-color-1",
        `rgba(${r}, ${g}, ${b}, ${blobOpacity})`
      );
      root.style.setProperty(
        "--blob-color-2",
        `rgba(${r}, ${g}, ${b}, ${blobOpacity * 0.85})`
      );
      root.style.setProperty(
        "--blob-color-3",
        `rgba(${r}, ${g}, ${b}, ${blobOpacity * 0.7})`
      );

      // Theme colors
      root.style.setProperty("--theme-color", color);
      root.style.setProperty("--theme-color-light", lightColor);
      root.style.setProperty("--theme-color-dark", darkColor);
      root.style.setProperty("--theme-color-rgb", `${r}, ${g}, ${b}`);

      // Letter colors
      root.style.setProperty(
        "--letter-color-1",
        `rgba(${r}, ${g}, ${b}, ${letterOpacity})`
      );
      root.style.setProperty(
        "--letter-color-2",
        `rgba(${r}, ${g}, ${b}, ${letterOpacity * 0.95})`
      );
      root.style.setProperty(
        "--letter-color-3",
        `rgba(${r}, ${g}, ${b}, ${letterOpacity * 0.9})`
      );
    };

    setCSSVariables();

    // Update themed backgrounds
    document.querySelectorAll(".bingo-themed-bg").forEach((el) => {
      (
        el as HTMLElement
      ).style.borderColor = `rgba(${r}, ${g}, ${b}, ${borderOpacity})`;
    });
  }, [color, lightColor, darkColor, theme]);

  return {
    processedColor: color,
    lightColor,
    darkColor,
    cycleColor,
    containerStyle,
  };
};
