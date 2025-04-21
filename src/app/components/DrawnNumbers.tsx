import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { selectDrawnNumbers, selectIsDrawing } from "@/lib/store/bingo";
import { useAppSelector } from "@/lib/store/hooks";
import styles from "@/styles/DrawnNumbers.module.scss";

interface DrawnNumbersProps {
  loading?: boolean;
}

export const DrawnNumbers = ({ loading }: DrawnNumbersProps) => {
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const isDrawing = useAppSelector(selectIsDrawing);
  const [isVisible, setIsVisible] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [showingNumber, setShowingNumber] = useState(false);
  const [pulseOnce, setPulseOnce] = useState(false);
  const prevDrawnLength = useRef<number>(0);

  useEffect(() => {
    if (drawnNumbers.length > 0 || isDrawing) {
      setIsVisible(true);
    }
  }, [drawnNumbers.length, isDrawing]);

  useEffect(() => {
    if (
      drawnNumbers.length > 0 &&
      drawnNumbers.length > prevDrawnLength.current
    ) {
      const lastDrawnNumber = drawnNumbers[drawnNumbers.length - 1];
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

  if (loading) {
    return (
      <div className={styles.drawnNumbers}>
        <div className={styles.drawnNumbers__container}>
          <Loader2 className="global-loader" size={50} color="gray" />
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  const totalCells = 15 * 5;

  return (
    <div className={styles.drawnNumbers}>
      {showingNumber && currentNumber && (
        <div
          className={styles.drawnNumbers__centerNumber}
          key={`center-number-${currentNumber}`}
        >
          {currentNumber}
        </div>
      )}

      <div className={styles.drawnNumbers__container}>
        <div className={styles.drawnNumbers__grid}>
          {drawnNumbers.map((drawnNumber, index) => (
            <div key={index} className={styles.drawnNumbers__cellContainer}>
              <div
                className={`${styles.drawnNumbers__cell} ${
                  pulseOnce ? styles.drawnNumbers__cell_latest : ""
                }`}
                key={`cell-${drawnNumber}`}
              >
                {drawnNumber}
              </div>
            </div>
          ))}

          {isDrawing && drawnNumbers.length === 0 && (
            <div key="loading-indicator">
              <div className={styles.drawnNumbers__cell}>
                <Loader2 className="animate-spin" size={20} />
              </div>
            </div>
          )}

          {Array.from({
            length:
              totalCells -
              drawnNumbers.length -
              (isDrawing && drawnNumbers.length === 0 ? 1 : 0),
          }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className={styles.drawnNumbers__placeholder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
