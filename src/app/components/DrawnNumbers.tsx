import styles from "@/styles/DrawnNumbers.module.scss";

type DrawnNumbersProps = {
  numbers: number[];
};

export const DrawnNumbers: React.FC<DrawnNumbersProps> = ({ numbers }) => {
  const totalCells = 15 * 5;
  return (
    <div className={styles.drawnNumbersContainer}>
      <div className={styles.drawnNumbers}>
        <div className={styles.drawnNumbersGrid}>
          {numbers.map((number, index) => (
            <div>
              <div key={index} className={styles.drawnNumbersCell}>
                {number}
              </div>
              <span className={styles.risingMarker}>{number}</span>
            </div>
          ))}

          {Array.from({ length: totalCells - numbers.length }).map(
            (_, index) => (
              <div
                key={`placeholder-${index}`}
                className={styles.placeholderCell}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};
