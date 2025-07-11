import { Loader2 } from "lucide-react";

import { useDrawnNumbersDisplay } from "@/app/components/drawn-numbers";
import styles from "@/app/components/drawn-numbers/DrawnNumbers.module.scss";

import { CenterNumber } from "./CenterNumber";
import { NumberGrid } from "./NumberGrid";

export const DrawnNumbers = ({ loading }: { loading?: boolean }) => {
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
