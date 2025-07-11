import type { CenterNumberProps } from "@/app/components/drawn-numbers";
import styles from "@/app/components/drawn-numbers/DrawnNumbers.module.scss";

export const CenterNumber = ({ number, animationKey }: CenterNumberProps) => (
  <div
    className={styles.drawnNumbers__centerNumber}
    key={`center-number-${number}-${animationKey}`}
  >
    {number}
  </div>
);
