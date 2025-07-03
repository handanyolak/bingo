"use client";

import React, { createContext, useContext } from "react";

import type { ColorContextType, ColorProviderProps } from "@/types/contexts";

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

export const ColorProvider: React.FC<ColorProviderProps> = ({
  value,
  children,
}) => {
  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
};
