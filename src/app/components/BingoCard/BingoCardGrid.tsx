import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { BingoCardCell } from "./BingoCardCell";
import { BingoCardGridProps } from "@/types";
import styles from "@/styles/bingo-card/BingoCardGrid.module.scss";

export const BingoCardGrid = ({
  playerParticipationStatus,
  cardNumbers,
  drawnNumbers,
  isPlayerExists = false,
  isRefreshingCard,
  isPlayerCardComplete,
  isGameFinished,
}: BingoCardGridProps) => {
  const t = useTranslations("controls");

  const emptyGridCells = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => i);
  }, []);

  if (playerParticipationStatus === "active") {
    return (
      <div className={styles.bingoCardGrid__container}>
        {cardNumbers.map((number, index) => {
          const isNumberDrawn = drawnNumbers.includes(number);

          return (
            <BingoCardCell
              key={index}
              number={number}
              isNumberDrawn={isNumberDrawn}
              isPlayerExists={isPlayerExists}
              isRefreshingCard={isRefreshingCard}
              isPlayerCardComplete={isPlayerCardComplete}
              isGameFinished={isGameFinished}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.bingoCardGrid__container}>
      {emptyGridCells.map((index) => (
        <div key={index} className={styles.bingoCardGrid__emptyCell} />
      ))}
      <div className={styles.bingoCardGrid__notPlayedText}>
        {t("notParticipated")}
      </div>
    </div>
  );
};
