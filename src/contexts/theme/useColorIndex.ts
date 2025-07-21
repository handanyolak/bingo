"use client";

import { useState, useEffect, useCallback } from "react";

import { useLocalStorage, type UseColorIndexReturn } from "@/contexts";
import { STORAGE_KEYS } from "@/utils";

export const useColorIndex = (
  isViewingOtherPlayer: boolean,
  colors: string[]
): UseColorIndexReturn => {
  const [storedIndex, setStoredIndex] = useLocalStorage<number>(
    STORAGE_KEYS.COLOR_INDEX,
    0
  );

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return isViewingOtherPlayer ? 0 : storedIndex;
  });

  useEffect(() => {
    if (isViewingOtherPlayer) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(storedIndex);
    }
  }, [isViewingOtherPlayer, storedIndex]);

  const cycleColor = useCallback(() => {
    if (colors.length === 0) return;
    const next = (currentIndex + 1) % colors.length;
    setCurrentIndex(next);
    if (!isViewingOtherPlayer) {
      setStoredIndex(next);
    }
  }, [colors.length, currentIndex, isViewingOtherPlayer, setStoredIndex]);

  return { currentIndex, cycleColor };
};
