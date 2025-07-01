import { useTranslations } from "next-intl";
import { BingoCardCell } from "@/app/components/BingoCard/BingoCardCell";
import { useBingoCardGrid, useBingoCardData } from "@/app/hooks/bingo-card";
import { useAppSelector } from "@/lib/store/hooks";
import { selectIsGameFinishedInUi } from "@/lib/store/bingo";
import styles from "@/styles/bingo-card/BingoCardGrid.module.scss";

export const BingoCardGrid = ({
  isRefreshingCard,
}: {
  isRefreshingCard: boolean;
}) => {
  const t = useTranslations("controls");

  const { playerParticipationStatus, cardNumbers, drawnNumbers, contractData } =
    useBingoCardData();

  const isGameFinished = useAppSelector(selectIsGameFinishedInUi);

  const { emptyGridCells, cardNumbersWithDrawnStatus } = useBingoCardGrid({
    cardNumbers,
    drawnNumbers,
  });

  if (playerParticipationStatus === "active") {
    return (
      <div className={styles.bingoCardGrid__container}>
        {cardNumbersWithDrawnStatus.map(({ number, index, isNumberDrawn }) => (
          <BingoCardCell
            key={index}
            number={number}
            isNumberDrawn={isNumberDrawn}
            isPlayerExists={contractData?.isPlayerExists ?? false}
            isRefreshingCard={isRefreshingCard}
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
