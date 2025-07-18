import {
  BingoCardGrid,
  RefreshButton,
  useBingoCardData,
  useBingoCardRefresh,
} from "@/app/components/bingo-card";
import styles from "@/app/components/bingo-card/BingoCard.module.scss";

export const BingoCard = () => {
  const { shouldShowRefreshButton, cardConfig } = useBingoCardData();

  const { isRefreshingCard, handleCardRefresh } =
    useBingoCardRefresh(cardConfig);

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
