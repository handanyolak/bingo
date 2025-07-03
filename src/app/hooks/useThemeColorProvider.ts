import { useAppKitAccount } from "@reown/appkit/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { zeroAddress } from "viem";

import useCardColors from "@/app/hooks/useCardColors";

const DEFAULT_COLOR = "rgb(209, 213, 219)";

const isValidColor = (color?: string): color is string =>
  typeof color === "string" && !color.includes("NaN");

export const useThemeColorProvider = () => {
  const { address } = useAppKitAccount();
  const searchParams = useSearchParams();
  const selectedAddress = searchParams.get("selectedAddress") || zeroAddress;

  const addressForTheme =
    selectedAddress && selectedAddress !== address ? selectedAddress : address;

  const isViewingOtherPlayer = addressForTheme !== address;

  const { colors } = useCardColors(addressForTheme || undefined);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isViewingOtherPlayer) {
        setCurrentIndex(0);
      } else {
        const savedIndex = localStorage.getItem("selectedColorIndex");
        setCurrentIndex(savedIndex ? Number(savedIndex) : 0);
      }
    }
    setMounted(true);
  }, [isViewingOtherPlayer]);

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
