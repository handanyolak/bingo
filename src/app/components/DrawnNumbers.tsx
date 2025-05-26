import { Loader2 } from "lucide-react";

import { useDrawnNumbersDisplay } from "@/app/hooks/useDrawnNumbersDisplay";
import styles from "@/styles/DrawnNumbers.module.scss";
import {
  DrawnNumbersProps,
  CenterNumberProps,
  NumberCellProps,
  NumberGridProps,
} from "@/types/components";

const CenterNumber = ({ number, animationKey }: CenterNumberProps) => (
  <div
    className={styles.drawnNumbers__centerNumber}
    key={`center-number-${number}-${animationKey}`}
  >
    {number}
  </div>
);

const NumberCell = ({
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

const LoadingState = () => (
  <div key="loading-indicator" className={styles.drawnNumbers__centered}>
    <Loader2 className="animate-spin" size={100} />
  </div>
);

const NumberGrid = ({
  drawnNumbers,
  latestDrawnNumber,
  pulseOnce,
  animationKey,
  isGameFinishedInUi,
  isDrawing,
  totalCells,
}: NumberGridProps) => {
  const placeholderCount =
    totalCells -
    drawnNumbers.length -
    (isDrawing && drawnNumbers.length === 0 ? 1 : 0);

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

      {isDrawing && drawnNumbers.length === 0 && <LoadingState />}

      {Array.from({ length: placeholderCount }).map((_, index) => (
        <div
          key={`placeholder-${index}`}
          className={styles.drawnNumbers__placeholder}
        />
      ))}
    </div>
  );
};

export const DrawnNumbers = ({ loading }: DrawnNumbersProps) => {
  const {
    isVisible,
    currentNumber,
    showingNumber,
    pulseOnce,
    animationKey,
    totalCells,
    latestDrawnNumber,
    drawnNumbers,
    isDrawing,
    isGameFinishedInUi,
    isConnected,
  } = useDrawnNumbersDisplay();

  if (loading && isConnected) {
    return (
      <div className={styles.drawnNumbers}>
        <div className={styles.drawnNumbers__container}>
          <Loader2 className="global-loader" size={50} color="gray" />
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className={styles.drawnNumbers}>
      {showingNumber && currentNumber && !isGameFinishedInUi && (
        <CenterNumber number={currentNumber} animationKey={animationKey} />
      )}

      <div className={styles.drawnNumbers__container}>
        <NumberGrid
          drawnNumbers={drawnNumbers}
          latestDrawnNumber={latestDrawnNumber}
          pulseOnce={pulseOnce}
          animationKey={animationKey}
          isGameFinishedInUi={isGameFinishedInUi}
          isDrawing={isDrawing}
          totalCells={totalCells}
        />
      </div>
    </div>
  );
};
