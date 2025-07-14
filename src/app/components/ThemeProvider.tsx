"use client";

import { memo } from "react";

import { ThemeContext } from "@/app/contexts/ThemeContext";
import { useThemeLogic } from "@/app/hooks/useThemeLogic";
import type { ThemeProviderProps } from "@/types";

export const ThemeProvider = memo(({ children }: ThemeProviderProps) => {
  const {
    mounted,
    currentColor,
    lightColor,
    darkColor,
    cycleColor,
    containerStyle,
  } = useThemeLogic();

  if (!mounted) {
    return (
      <div className="theme-provider-loading" style={{ opacity: 0 }}>
        {children}
      </div>
    );
  }

  const contextValue = {
    color: currentColor,
    lightColor,
    darkColor,
    cycleColor,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className="theme-container" style={containerStyle}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
});

ThemeProvider.displayName = "ThemeProvider";
