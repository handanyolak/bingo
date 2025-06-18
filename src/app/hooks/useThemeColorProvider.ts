import { useAppKitAccount } from "@reown/appkit/react";
import { useState, useEffect } from "react";

import useCardColors from "@/app/hooks/useCardColors";

const DEFAULT_COLOR = "rgb(209, 213, 219)";

const isValidColor = (color?: string): color is string =>
  typeof color === "string" && !color.includes("NaN");

export const useThemeColorProvider = () => {
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

  const currentColor = isValidColor(colors?.[currentIndex])
    ? colors[currentIndex]
    : DEFAULT_COLOR;

  return {
    mounted,
    currentColor,
    colors: colors || [],
    currentIndex,
    setCurrentIndex,
  };
};
