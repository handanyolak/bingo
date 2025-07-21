import { Loader2 } from "lucide-react";

import {
  NumberGrid,
  CenterNumber,
  useDrawnNumbersDisplay,
} from "@/app/components/drawn-numbers";
import styles from "@/app/components/drawn-numbers/DrawnNumbers.module.scss";

export const DrawnNumbers = ({ loading }: { loading?: boolean }) => {
  const {
    isVisible,
    currentNumber,
    showingNumber,
    pulseOnce,
    animationKey,
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
        <NumberGrid pulseOnce={pulseOnce} animationKey={animationKey} />
      </div>
    </div>
  );
};
