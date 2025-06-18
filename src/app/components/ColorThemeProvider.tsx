"use client";

import React from "react";
import { ColorProvider } from "@/app/contexts/ColorContext";
import { useColorProvider } from "@/app/hooks/useColorProvider";
import type { ColorThemeProviderProps } from "@/types/contexts";

export const ColorThemeProvider: React.FC<ColorThemeProviderProps> = ({
  color,
  colors,
  currentIndex,
  setCurrentIndex,
  children,
}) => {
  const {
    color: processedColor,
    lightColor,
    darkColor,
    cycleColor,
    containerStyle,
  } = useColorProvider({
    color,
    colors,
    currentIndex,
    setCurrentIndex,
  });

  return (
    <ColorProvider
      value={{
        color: processedColor,
        lightColor,
        darkColor,
        cycleColor,
      }}
    >
      <div style={containerStyle}>{children}</div>
    </ColorProvider>
  );
};
