import styles from "@/styles/DrawnNumbers.module.scss";

type DrawnNumbersProps = {
  numbers: number[];
};

export const DrawnNumbers: React.FC<DrawnNumbersProps> = ({ numbers }) => {
  const totalCells = 15 * 5;
  return (
    <div className={styles.drawnNumbers}>
      <div className={styles.drawnNumbers__container}>
        <div className={styles.drawnNumbers__grid}>
          {numbers.map((number, index) => (
            <div key={index}>
              <div className={styles.drawnNumbers__cell}>{number}</div>
              <span className={styles.drawnNumbers__marker}>{number}</span>
            </div>
          ))}

          {Array.from({ length: totalCells - numbers.length }).map(
            (_, index) => (
              <div key={index} className={styles.drawnNumbers__placeholder} />
            )
          )}
        </div>
      </div>
    </div>
  );
};
