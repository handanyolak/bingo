"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { useWallet } from "@/lib/store/features/wallet";
import useCardColors from "@/app/hooks/useCardColors";
import { Loader } from "@/app/components/Loader";
import { ColorProvider } from "@/app/contexts/ColorContext";

export function ThemeColorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { address } = useWallet();
  const { colors, isLoading } = useCardColors(address || undefined);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const savedIndex = localStorage?.getItem("selectedColorIndex");
    setCurrentIndex(savedIndex ? Number(savedIndex) : 0);
    setMounted(true);
  }, []);

  const DEFAULT_COLOR = "rgb(209, 213, 219)";
  const isValidColor = (color?: string): color is string =>
    typeof color === "string" && !color.includes("NaN");
  const color = isValidColor(colors?.[currentIndex])
    ? colors[currentIndex]
    : DEFAULT_COLOR;

  if (!mounted) return null;
  if (isLoading) return <Loader />;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
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
