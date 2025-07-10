import {
  useBingoCardData,
  useBingoCardRefresh,
} from "@/app/components/bingo-card";
import { BingoCardGrid } from "@/app/components/bingo-card";
import { RefreshButton } from "@/app/components/bingo-card";
import styles from "@/app/components/bingo-card/BingoCard.module.scss";

export const BingoCard = () => {
  const { contractData, isCurrentGame, cardConfig } = useBingoCardData();

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

        <BingoCardGrid isRefreshingCard={isRefreshingCard} />
      </div>
    </div>
  );
};
