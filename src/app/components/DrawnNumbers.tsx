import styles from "@/styles/DrawnNumbers.module.scss";

type DrawnNumbersProps = {
  numbers: number[];
};

const DrawnNumbers: React.FC<DrawnNumbersProps> = ({ numbers }) => {
  const totalCells = 15 * 5;
  return (
    <div className={styles.drawnNumbers}>
      <div className={styles.drawnNumbersGrid}>
        {numbers.map((number, index) => (
          <div key={index} className={styles.drawnNumbersCell}>
            {number}
          </div>
        ))}

        {Array.from({ length: totalCells - numbers.length }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className={styles.placeholderCell}
          />
        ))}
      </div>
    </div>
  );
};

export default DrawnNumbers;
