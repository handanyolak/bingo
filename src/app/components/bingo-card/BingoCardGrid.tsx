import { useTranslations } from "next-intl";

import {
  useBingoCardGrid,
  useBingoCardData,
} from "@/app/components/bingo-card";
import { BingoCardCell } from "@/app/components/bingo-card";
import styles from "@/app/components/bingo-card/BingoCardGrid.module.scss";
import { selectIsGameFinishedInUi } from "@/lib/store/bingo";
import { useAppSelector } from "@/lib/store/hooks";

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
