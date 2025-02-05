import styles from "@/styles/DrawnNumbers.module.scss";
import { useAppSelector } from "@/lib/store/hooks";
import { selectDrawnNumbers } from "@/lib/store/features/bingo";

export const DrawnNumbers = () => {
  const drawnNumbers = useAppSelector(selectDrawnNumbers);

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
