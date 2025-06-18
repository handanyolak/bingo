import styles from "@/styles/DrawnNumbers.module.scss";
import type { CenterNumberProps } from "@/types/drawn-numbers";

export const CenterNumber = ({ number, animationKey }: CenterNumberProps) => (
  <div
    className={styles.drawnNumbers__centerNumber}
    key={`center-number-${number}-${animationKey}`}
  >
    {number}
  </div>
);
