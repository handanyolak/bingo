import { useMemo } from "react";
import styles from "@/styles/bingo-card/BingoCardCell.module.scss";

export const useBingoCardCell = ({
  isRefreshingCard,
  isGameFinished,
}: {
  isRefreshingCard: boolean;
  isGameFinished: boolean;
}) => {
  const cellClassName = useMemo(() => {
    return `${styles.bingoCardCell__grid} 
      ${isRefreshingCard ? styles["bingoCardCell__grid--changed"] : ""} 
      ${isGameFinished ? styles["bingoCardCell__grid--complete"] : ""}`;
  }, [isRefreshingCard, isGameFinished]);

  return {
    cellClassName,
  };
};
