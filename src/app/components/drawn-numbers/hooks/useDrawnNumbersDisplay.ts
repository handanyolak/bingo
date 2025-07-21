import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";

import type { UseDrawnNumbersDisplayReturn } from "@/app/components/drawn-numbers";
import {
  selectDrawnNumbers,
  selectIsDrawing,
  selectIsGameFinishedInUi,
} from "@/lib/store/bingo";
import { useAppSelector } from "@/lib/store/hooks";

export const useDrawnNumbersDisplay = (): UseDrawnNumbersDisplayReturn => {
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const isDrawing = useAppSelector(selectIsDrawing);
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);
  const { isConnected } = useAccount();

  const [isVisible, setIsVisible] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [showingNumber, setShowingNumber] = useState(false);
  const [pulseOnce, setPulseOnce] = useState(false);
  const prevDrawnLength = useRef<number>(0);
  const animationKey = useRef<number>(0);

  useEffect(() => {
    if (drawnNumbers.length > 0) {
      setIsVisible(true);
    }
  }, [drawnNumbers.length]);

  useEffect(() => {
    if (drawnNumbers.length === 0 && !isDrawing) {
      setIsVisible(false);
      prevDrawnLength.current = 0;
    }
  }, [drawnNumbers.length, isDrawing]);

  useEffect(() => {
    if (drawnNumbers.length === 0) {
      setCurrentNumber(null);
      setShowingNumber(false);
      setPulseOnce(false);
    }
  }, [drawnNumbers.length]);

  useEffect(() => {
    if (drawnNumbers.length > prevDrawnLength.current) {
      const lastDrawnNumber = drawnNumbers[drawnNumbers.length - 1];

      animationKey.current += 1;

      setCurrentNumber(lastDrawnNumber);
      setShowingNumber(true);
      setPulseOnce(true);

      const timer = setTimeout(() => {
        setShowingNumber(false);

        setTimeout(() => {
          setPulseOnce(false);
        }, 1000);
      }, 2000);

      prevDrawnLength.current = drawnNumbers.length;

      return () => clearTimeout(timer);
    }

    if (prevDrawnLength.current === 0 && drawnNumbers.length > 0) {
      prevDrawnLength.current = drawnNumbers.length;
    }
  }, [drawnNumbers]);

  return {
    isVisible,
    currentNumber,
    showingNumber,
    pulseOnce,
    animationKey: animationKey.current,
    isGameFinishedInUi,
    isConnected,
  };
};
