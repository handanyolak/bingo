import { useState, useEffect } from "react";

import type { UseColorIndexReturn } from "@/types";
import { STORAGE_KEYS } from "@/utils/theme";

export const useColorIndex = (
  isViewingOtherPlayer: boolean,
  colors: string[]
): UseColorIndexReturn => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isViewingOtherPlayer) {
        setCurrentIndex(0);
      } else {
        const savedIndex = localStorage.getItem(STORAGE_KEYS.COLOR_INDEX);
        setCurrentIndex(savedIndex ? Number(savedIndex) : 0);
      }
    }
  }, [isViewingOtherPlayer]);

  const cycleColor = () => {
    if (!colors?.length) return;
    const nextIndex = (currentIndex + 1) % colors.length;
    setCurrentIndex(nextIndex);
    if (typeof window !== "undefined" && !isViewingOtherPlayer) {
      localStorage.setItem(STORAGE_KEYS.COLOR_INDEX, nextIndex.toString());
    }
  };

  return { currentIndex, cycleColor };
};
