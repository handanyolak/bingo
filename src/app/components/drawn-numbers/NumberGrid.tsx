import { Loader2 } from "lucide-react";

import type { NumberGridProps } from "@/app/components/drawn-numbers";
import { useNumberGrid } from "@/app/components/drawn-numbers/hooks";
import styles from "@/app/components/drawn-numbers/NumberGrid.module.scss";

import { NumberCell } from "./NumberCell";

const LoadingState = () => (
  <div key="loading-indicator" className={styles.numberGrid__centered}>
    <Loader2 className={styles.numberGrid__spinLoader} size={100} />
  </div>
);

export const NumberGrid = (props: NumberGridProps) => {
  const {
    drawnNumbers,
    latestDrawnNumber,
    pulseOnce,
    animationKey,
    isGameFinishedInUi,
  } = props;

  const { placeholderArray, shouldShowLoading } = useNumberGrid(props);

  return (
    <div className={styles.numberGrid}>
      {drawnNumbers.map((drawnNumber, index) => {
        const isLatestNumber =
          pulseOnce && drawnNumber === latestDrawnNumber && !isGameFinishedInUi;
        return (
          <NumberCell
            key={`number-${drawnNumber}-${index}`}
            number={drawnNumber}
            isLatest={isLatestNumber}
            animationKey={animationKey}
            index={index}
          />
        );
      })}

      {shouldShowLoading && <LoadingState />}

      {placeholderArray.map((_, index) => (
        <div
          key={`placeholder-${index}`}
          className={styles.numberGrid__placeholder}
        />
      ))}
    </div>
  );
};
