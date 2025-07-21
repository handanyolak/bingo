import type { NumberCellProps } from "@/app/components/drawn-numbers";
import styles from "@/app/components/drawn-numbers/NumberCell.module.scss";

export const NumberCell = ({
  number,
  isLatest,
  animationKey,
  index,
  isInUserCard,
}: NumberCellProps) => (
  <div
    className={`${styles.numberCell} ${
      isLatest && isInUserCard ? styles.numberCellLatest : ""
    }`}
    key={`cell-${number}-${isLatest ? animationKey : index}`}
  >
    {number}
  </div>
);
