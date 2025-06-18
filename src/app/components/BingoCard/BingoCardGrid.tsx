import { useTranslations } from "next-intl";
import { BingoCardCell } from "./BingoCardCell";
import { useBingoCardGrid } from "@/app/hooks/bingo-card";
import { BingoCardGridProps } from "@/types";
import styles from "@/styles/bingo-card/BingoCardGrid.module.scss";

export const BingoCardGrid = (props: BingoCardGridProps) => {
  const {
    playerParticipationStatus,
    isPlayerExists = false,
    isRefreshingCard,
    isPlayerCardComplete,
    isGameFinished,
  } = props;

  const t = useTranslations("controls");
  const { emptyGridCells, cardNumbersWithDrawnStatus } =
    useBingoCardGrid(props);

  if (playerParticipationStatus === "active") {
    return (
      <div className={styles.bingoCardGrid__container}>
        {cardNumbersWithDrawnStatus.map(({ number, index, isNumberDrawn }) => (
          <BingoCardCell
            key={index}
            number={number}
            isNumberDrawn={isNumberDrawn}
            isPlayerExists={isPlayerExists}
            isRefreshingCard={isRefreshingCard}
            isPlayerCardComplete={isPlayerCardComplete}
            isGameFinished={isGameFinished}
          />
        ))}
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
