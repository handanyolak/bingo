"use client";

import BingoCard from "@/app/components/BingoCard";
import DrawnNumbers from "@/app/components/DrawnNumbers";
import styles from "@/styles/page.module.scss";
import { useEffect, useState, useRef } from "react";
import { ColorProvider } from "@/app/contexts/ColorContext";

export default function Home() {
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

  const [bingoNumbers] = useState<number[]>(generateUniqueNumbers(25, 1, 75));

  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);

  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const intervalRef = useRef<number | null>(null);

  const color = "#ff99ff";

  const drawNumber = () => {
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
  };

  const startDrawing = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    intervalRef.current = window.setInterval(() => {
      drawNumber();
    }, 1000);
  };

  const stopDrawing = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDrawing(false);
  };

  useEffect(() => {
    if (drawnNumbers.length >= 75) {
      stopDrawing();
    }
  }, [drawnNumbers]);

  useEffect(() => {
    return () => {
      stopDrawing();
    };
  }, []);

  return (
    <ColorProvider color={color}>
      <div className={styles.homePage}>
        <div className={styles.container}>
          <div className={styles.innerWrapper}>
            <BingoCard numbers={bingoNumbers} />
            <button
              onClick={startDrawing}
              disabled={isDrawing || drawnNumbers.length >= 75}
            >
              {isDrawing ? "Drawing..." : "Draw numbers"}
            </button>
            <DrawnNumbers numbers={drawnNumbers} />
          </div>
        </div>
      </div>
    </ColorProvider>
  );
}
