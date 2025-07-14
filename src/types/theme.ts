import React from "react";

export interface ThemeContextType {
  color: string;
  lightColor: string;
  darkColor: string;
  cycleColor: () => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface UseThemeLogicReturn {
  mounted: boolean;
  currentColor: string;
  lightColor: string;
  darkColor: string;
  cycleColor: () => void;
  containerStyle: React.CSSProperties;
}

export interface UseColorIndexReturn {
  currentIndex: number;
  cycleColor: () => void;
}
