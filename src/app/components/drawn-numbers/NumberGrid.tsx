import { Loader2 } from "lucide-react";

import {
  NumberGridProps,
  useNumberGrid,
  NumberCell,
} from "@/app/components/drawn-numbers";
import styles from "@/app/components/drawn-numbers/NumberGrid.module.scss";

export const NumberGrid = ({ pulseOnce, animationKey }: NumberGridProps) => {
  const {
    drawnNumbers,
    latestDrawnNumber,
    isGameFinishedInUi,
    userCardNumbers,
    placeholderArray,
    shouldShowLoading,
  } = useNumberGrid();

  return (
    <div className={styles.numberGrid} role="grid">
      {drawnNumbers.map((drawnNumber, index) => {
        const isLatest =
          pulseOnce && drawnNumber === latestDrawnNumber && !isGameFinishedInUi;
        const isInUserCard = userCardNumbers.includes(drawnNumber);
        return (
          <NumberCell
            key={`number-${drawnNumber}-${index}`}
            number={drawnNumber}
            isLatest={isLatest}
            animationKey={animationKey}
            index={index}
            isInUserCard={isInUserCard}
          />
        );
      })}

      {shouldShowLoading && (
        <div key="loading-indicator" className={styles.numberGrid__centered}>
          <Loader2 className={styles.numberGrid__spinLoader} size={100} />
        </div>
      )}

      {placeholderArray.map((_, index) => (
        <div
          key={`placeholder-${index}`}
          className={styles.numberGrid__placeholder}
          role="gridcell"
        />
      ))}
    </div>
  );
};
