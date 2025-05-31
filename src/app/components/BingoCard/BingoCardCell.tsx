import { BingoCardCellProps } from "@/types";
import styles from "@/styles/components/bingo-card/BingoCardCell.module.scss";

export const BingoCardCell = ({
  number,
  isNumberDrawn,
  isPlayerExists,
  isRefreshingCard,
  isGameFinished,
}: BingoCardCellProps) => {
  const getCellClassName = () => {
    return `${styles.bingoCardCell__grid} 
      ${isRefreshingCard ? styles["bingoCardCell__grid--changed"] : ""} 
      ${isGameFinished ? styles["bingoCardCell__grid--complete"] : ""}`;
  };

  return (
    <div className={getCellClassName()}>
      <span>{number}</span>
      {isNumberDrawn && isPlayerExists && (
        <span className={styles.bingoCardCell__marker} />
      )}
    </div>
  );
};
