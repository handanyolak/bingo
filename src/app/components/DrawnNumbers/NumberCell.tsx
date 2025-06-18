import styles from "@/styles/DrawnNumbers.module.scss";
import type { NumberCellProps } from "@/types/drawn-numbers";

export const NumberCell = ({
  number,
  isLatest,
  animationKey,
  index,
}: NumberCellProps) => (
  <div
    key={`container-${number}-${index}`}
    className={styles.drawnNumbers__cellContainer}
  >
    <div
      className={`${styles.drawnNumbers__cell} ${
        isLatest ? styles.drawnNumbers__cell_latest : ""
      }`}
      key={`cell-${number}-${isLatest ? animationKey : index}`}
    >
      {number}
    </div>
  </div>
);
