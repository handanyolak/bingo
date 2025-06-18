import { useMemo } from "react";
import styles from "@/styles/bingo-card/BingoCardCell.module.scss";
import type { UseBingoCardCellProps } from "@/types/bingo-card";

export const useBingoCardCell = ({
  isRefreshingCard,
  isGameFinished,
}: UseBingoCardCellProps) => {
  const cellClassName = useMemo(() => {
    return `${styles.bingoCardCell__grid} 
      ${isRefreshingCard ? styles["bingoCardCell__grid--changed"] : ""} 
      ${isGameFinished ? styles["bingoCardCell__grid--complete"] : ""}`;
  }, [isRefreshingCard, isGameFinished]);

  return {
    cellClassName,
  };
};
