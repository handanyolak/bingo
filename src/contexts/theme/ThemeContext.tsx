"use client";

import { createContext, useContext } from "react";

import type { ThemeContextType } from "@/contexts";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useColorTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useColorTheme must be used within ThemeProvider. " +
        "Make sure your component is wrapped with <ThemeProvider>."
    );
  }
  return context;
};

export { ThemeContext };
