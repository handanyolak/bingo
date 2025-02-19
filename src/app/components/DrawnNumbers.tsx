import styles from "@/styles/DrawnNumbers.module.scss";
import { useAppSelector } from "@/lib/store/hooks";
import {
  selectDrawnNumbers,
  selectIsDrawing,
} from "@/lib/store/features/bingo";
import { Loader2 } from "lucide-react";

interface DrawnNumbersProps {
  loading?: boolean;
}

export const DrawnNumbers = ({ loading }: DrawnNumbersProps) => {
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const isDrawing = useAppSelector(selectIsDrawing);

  if (loading) {
    return (
      <div className={styles.drawnNumbers}>
        <div className={styles.drawnNumbers__container}>
          <Loader2 className="global-loader" size={50} color="gray" />
        </div>
      </div>
    );
  }

  const hasContent = drawnNumbers.length > 0 || isDrawing;
  if (!hasContent) return null;

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

          {Array.from({ length: totalCells - drawnNumbers.length }).map(
            (_, index) => (
              <div key={index} className={styles.drawnNumbers__placeholder} />
            )
          )}
        </div>
      </div>
    </div>
  );
};
