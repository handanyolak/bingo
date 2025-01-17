"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { BingoCard } from "@/app/components/BingoCard";
import { DrawnNumbers } from "@/app/components/DrawnNumbers";
import styles from "@/styles/Bingo.module.scss";
import { useTranslations } from "next-intl";
import { AppButton } from "@/app/components/AppButton";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

const generateUniqueNumbers = (
  count: number,
  min: number,
  max: number
): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }
  return Array.from(numbers);
};

export const Bingo = () => {
  const t = useTranslations("controls");

  const [bingoNumbers] = useState(() => generateUniqueNumbers(25, 1, 75));
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  const drawnNumber = useCallback(() => {
    if (drawnNumbers.length >= 75) {
      stopDrawing();
      return;
    }

    const allNumbers = new Set<number>(
      Array.from({ length: 75 }, (_, i) => i + 1)
    );
    drawnNumbers.forEach((num) => allNumbers.delete(num));

    const remainingNumbers = Array.from(allNumbers);
    const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    const newNumber = remainingNumbers[randomIndex];

    setDrawnNumbers((prevNumbers) => [...prevNumbers, newNumber]);
  }, [drawnNumbers]);

  const startDrawing = useCallback(() => {
    if (isDrawing) return;
    setIsDrawing(true);
    intervalRef.current = window.setInterval(drawnNumber, 3000);
  }, [isDrawing, drawnNumber]);

  const stopDrawing = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDrawing(false);
  }, []);

  useEffect(() => {
    if (drawnNumbers.length >= 75) {
      stopDrawing();
    }
  }, [drawnNumbers, stopDrawing]);

  useEffect(() => {
    return () => {
      stopDrawing();
    };
  }, [stopDrawing]);

  return (
    <div className={styles.bingo__page}>
      <div className={styles.bingo__container}>
        <AppButton
          text={t("drawnNumbers")}
          disabled={isDrawing || drawnNumbers.length >= 75}
          onClick={startDrawing}
        />
        <div className={styles.bingo__wrapper}>
          <div className={styles.bingo__game}>
            <BingoCard numbers={bingoNumbers} drawnNumbers={drawnNumbers} />
            <div className={styles.bingo__controls}>
              <AppButton
                text={t("previousGame")}
                contentPosition="left"
                content={<ChevronsLeft />}
                className={styles.bingo__control}
              />
              <AppButton
                text={t("nextGame")}
                contentPosition="right"
                content={<ChevronsRight />}
                className={styles.bingo__control}
              />
            </div>
          </div>
          <DrawnNumbers numbers={drawnNumbers} />
        </div>
      </div>
    </div>
  );
};
