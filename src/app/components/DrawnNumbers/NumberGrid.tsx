import { Loader2 } from "lucide-react";
import { useNumberGrid } from "@/app/hooks/drawn-numbers";
import { NumberCell } from "./NumberCell";
import styles from "@/styles/DrawnNumbers.module.scss";
import type { NumberGridProps } from "@/types/drawn-numbers";

const LoadingState = () => (
  <div key="loading-indicator" className={styles.drawnNumbers__centered}>
    <Loader2 className={styles.drawnNumbers__spinLoader} size={100} />
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
    <div className={styles.drawnNumbers__grid}>
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
          className={styles.drawnNumbers__placeholder}
        />
      ))}
    </div>
  );
};
