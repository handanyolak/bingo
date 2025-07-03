"use client";

import { ThemeProvider } from "next-themes";

import { ColorThemeProvider } from "@/app/components/ColorThemeProvider";
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
      <ColorThemeProvider
        color={currentColor}
        colors={colors}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      >
        {children}
      </ColorThemeProvider>
    </ThemeProvider>
  );
}
