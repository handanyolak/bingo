import { useBingoCardCell } from "@/app/hooks/bingo-card";
import { BingoCardCellProps } from "@/types";
import styles from "@/styles/bingo-card/BingoCardCell.module.scss";

export const BingoCardCell = ({
  number,
  isNumberDrawn,
  isPlayerExists,
  isRefreshingCard,
  isGameFinished,
}: BingoCardCellProps) => {
  const { cellClassName } = useBingoCardCell({
    isRefreshingCard,
    isGameFinished,
  });

  return (
    <div className={cellClassName}>
      <span>{number}</span>
      {isNumberDrawn && isPlayerExists && (
        <span className={styles.bingoCardCell__marker} />
      )}
    </div>
  );
};
