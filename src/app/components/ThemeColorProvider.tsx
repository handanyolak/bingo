"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

import { ColorProvider } from "@/app/contexts/ColorContext";
import useCardColors from "@/app/hooks/useCardColors";

export function ThemeColorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { address } = useAppKitAccount();
  const { colors } = useCardColors(address || undefined);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedIndex = localStorage.getItem("selectedColorIndex");
      setCurrentIndex(savedIndex ? Number(savedIndex) : 0);
    }
    setMounted(true);
  }, []);

  const DEFAULT_COLOR = "rgb(209, 213, 219)";
  const isValidColor = (color?: string): color is string =>
    typeof color === "string" && !color.includes("NaN");
  const color = isValidColor(colors?.[currentIndex])
    ? colors[currentIndex]
    : DEFAULT_COLOR;

  if (!mounted) return null;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ColorProvider
        color={color}
        colors={colors || []}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      >
        {children}
      </ColorProvider>
    </ThemeProvider>
  );
}
