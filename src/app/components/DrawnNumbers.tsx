import styles from "@/styles/DrawnNumbers.module.scss";
import { useAppSelector } from "@/lib/store/hooks";
import { selectDrawnNumbers, selectIsDrawing } from "@/lib/store/bingo";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DrawnNumbersProps {
  loading?: boolean;
}

export const DrawnNumbers = ({ loading }: DrawnNumbersProps) => {
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const isDrawing = useAppSelector(selectIsDrawing);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (drawnNumbers.length > 0 || isDrawing) {
      setIsVisible(true);
    }
  }, [drawnNumbers.length, isDrawing]);

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
      <div className={styles.drawnNumbers__container}>
        <div className={styles.drawnNumbers__grid}>
          {drawnNumbers.map((drawnNumber, index) => (
            <div key={index}>
              <div className={styles.drawnNumbers__cell}>{drawnNumber}</div>
              <span className={styles.drawnNumbers__marker}>{drawnNumber}</span>
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
