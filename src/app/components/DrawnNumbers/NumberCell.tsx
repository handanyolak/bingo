import styles from "@/styles/NumberCell.module.scss";
import type { NumberCellProps } from "@/types/drawn-numbers";

export const NumberCell = ({
  number,
  isLatest,
  animationKey,
  index,
}: NumberCellProps) => (
  <div
    className={`${styles.numberCell} ${
      isLatest ? styles.numberCell_latest : ""
    }`}
    key={`cell-${number}-${isLatest ? animationKey : index}`}
  >
    {number}
  </div>
);
