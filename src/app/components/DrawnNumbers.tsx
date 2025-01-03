import styles from "@/styles/DrawnNumbers.module.scss";
import { lighten, darken } from "polished";

type DrawnNumbersProps = {
  numbers: number[];
  color?: string;
};

const DrawnNumbers: React.FC<DrawnNumbersProps> = ({
  numbers,
  color = "#6b7280",
}) => {
  const totalCells = 15 * 5;
  const lightColor = lighten(0.1, color);
  const darkColor = darken(0.1, color);
  return (
    <div
      className={styles.drawnNumbers}
      style={
        {
          "--card-color": color,
          "--card-light-color": lightColor,
          "--card-dark-color": darkColor,
        } as React.CSSProperties
      }
    >
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
          ></div>
        ))}
      </div>
    </div>
  );
};

export default DrawnNumbers;
