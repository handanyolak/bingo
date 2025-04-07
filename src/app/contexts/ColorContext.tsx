"use client";

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

  const cycleColor = () => {
    if (!colors?.length) return;
    const nextIndex = (currentIndex + 1) % colors.length;
    setCurrentIndex(nextIndex);
    localStorage.setItem("selectedColorIndex", nextIndex.toString());
  };

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
