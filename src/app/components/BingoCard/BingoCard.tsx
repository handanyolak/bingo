import { useBingoCardData, useBingoCardRefresh } from "@/app/hooks/bingo-card";
import { RefreshButton } from "./RefreshButton";
import { BingoCardGrid } from "./BingoCardGrid";
import styles from "@/styles/bingo-card/BingoCard.module.scss";

export const BingoCard = () => {
  const {
    cardNumbers,
    drawnNumbers,
    contractData,
    isCurrentGame,
    playerParticipationStatus,
    cardConfig,
    isGameFinishedInUi,
  } = useBingoCardData();

  const { isRefreshingCard, handleCardRefresh } =
    useBingoCardRefresh(cardConfig);

  const shouldShowRefreshButton =
    isCurrentGame && !contractData?.isPlayerExists;

  return (
    <div className={styles.bingoCard__wrapper}>
      {shouldShowRefreshButton && (
        <RefreshButton
          isRefreshingCard={isRefreshingCard}
          onRefresh={handleCardRefresh}
        />
      )}

      <div className={styles.bingoCard__container}>
        <h1 className={styles.bingoCard__title}>BINGO</h1>

        <BingoCardGrid
          playerParticipationStatus={playerParticipationStatus}
          cardNumbers={cardNumbers}
          drawnNumbers={drawnNumbers}
          isPlayerExists={contractData?.isPlayerExists}
          isRefreshingCard={isRefreshingCard}
          isGameFinished={isGameFinishedInUi}
        />
      </div>
    </div>
  );
};
