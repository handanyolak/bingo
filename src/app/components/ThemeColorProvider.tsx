"use client";

import { ThemeProvider } from "next-themes";

import { ColorProvider } from "@/app/contexts/ColorContext";
import { useThemeColorProvider } from "@/app/hooks/useThemeColorProvider";

export function ThemeColorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mounted, currentColor, colors, currentIndex, setCurrentIndex } =
    useThemeColorProvider();

  if (!mounted) return null;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ColorProvider
        color={currentColor}
        colors={colors}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      >
        {children}
      </ColorProvider>
    </ThemeProvider>
  );
}
