"use client";

import { useTheme } from "next-themes";
import { lighten, darken } from "polished";
import React, { createContext, useContext } from "react";

type ColorContextType = {
  color: string;
  lightColor: string;
  darkColor: string;
  cycleColor: () => void;
};

export const ColorContext = createContext<ColorContextType | undefined>(
  undefined
);

export const useColor = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("useColor must be used within ColorProvider");
  }
  return context;
};

type ColorProviderProps = {
  color: string;
  colors: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  children: React.ReactNode;
};

export const ColorProvider: React.FC<ColorProviderProps> = ({
  color,
  colors,
  currentIndex,
  setCurrentIndex,
  children,
}) => {
  const lightColor = lighten(0.1, color);
  const darkColor = darken(0.1, color);
  const { theme } = useTheme();

  const cycleColor = () => {
    if (!colors?.length) return;
    const nextIndex = (currentIndex + 1) % colors.length;
    setCurrentIndex(nextIndex);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedColorIndex", nextIndex.toString());
    }
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;

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

      const [r, g, b] = getRGBValues(color);

      const waveOpacity = theme === "dark" ? 0.9 : 0.98;
      const borderOpacity = theme === "dark" ? 0.7 : 0.6;
      const letterOpacity = theme === "dark" ? 0.45 : 0.4;

      const setCSSVariables = () => {
        root.style.setProperty(
          "--wave-color-1",
          `rgba(${r}, ${g}, ${b}, ${waveOpacity})`
        );
        root.style.setProperty(
          "--wave-color-2",
          `rgba(${r}, ${g}, ${b}, ${waveOpacity * 0.85})`
        );
        root.style.setProperty(
          "--wave-color-3",
          `rgba(${r}, ${g}, ${b}, ${waveOpacity * 0.7})`
        );

        root.style.setProperty("--card-color", color);
        root.style.setProperty("--card-light-color", lightColor);
        root.style.setProperty("--card-dark-color", darkColor);

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

      document.querySelectorAll(".bingo-themed-bg").forEach((el) => {
        (
          el as HTMLElement
        ).style.borderColor = `rgba(${r}, ${g}, ${b}, ${borderOpacity})`;
      });
    }
  }, [color, lightColor, darkColor, theme]);

  return (
    <ColorContext.Provider value={{ color, lightColor, darkColor, cycleColor }}>
      <div
        style={
          {
            "--card-color": color,
            "--card-light-color": lightColor,
            "--card-dark-color": darkColor,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ColorContext.Provider>
  );
};
