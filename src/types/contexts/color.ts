import React from "react";

// ColorContext Types
export type ColorContextType = {
  color: string;
  lightColor: string;
  darkColor: string;
  cycleColor: () => void;
};

export type ColorProviderProps = {
  value: ColorContextType;
  children: React.ReactNode;
};

// ColorProvider Hook Types
export interface UseColorProviderProps {
  color: string;
  colors: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export interface UseColorProviderReturn {
  processedColor: string;
  lightColor: string;
  darkColor: string;
  cycleColor: () => void;
  containerStyle: React.CSSProperties;
}

// ColorThemeProvider Component Types
export type ColorThemeProviderProps = {
  color: string;
  colors: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  children: React.ReactNode;
};
