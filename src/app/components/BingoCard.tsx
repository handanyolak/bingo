import { useEffect, useState } from "react";
import {
  BingoCardNumbers,
  generateCardNumbers,
  selectDrawnNumbers,
  setCardNumbers,
  useBingoDrawing,
} from "@/lib/store/bingo";
import { selectCardNumbers } from "@/lib/store/bingo";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";
import styles from "@/styles/BingoCard.module.scss";
import { RefreshCcw } from "lucide-react";

export const BingoCard = () => {
  const { data: contractReadsData, isLoading } = useContractReads();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const playerCardNumbers = useAppSelector(selectCardNumbers);
  const announcedNumbers = useAppSelector(selectDrawnNumbers);
  const { isPlayerCardComplete } = useBingoDrawing();

  const dispatch = useAppDispatch();

  const getCardConfig = () => {
    if (!contractReadsData) return null;

    return {
      BINGO_MIN_NUMBER: contractReadsData.BINGO_MIN_NUMBER,
      BINGO_MAX_NUMBER: contractReadsData.BINGO_MAX_NUMBER,
      BINGO_CARD_NUMBERS_COUNT: contractReadsData.BINGO_CARD_NUMBERS_COUNT,
    };
  };

  useEffect(() => {
    if (!isLoading && contractReadsData) {
      if (contractReadsData.isPlayerExists) {
        dispatch(
          setCardNumbers(
            contractReadsData.playerDetails?.cardNumbers as BingoCardNumbers
          )
        );
      } else {
        const cardConfig = getCardConfig();
        if (cardConfig) {
          dispatch(generateCardNumbers(cardConfig));
        }
      }
    }
  }, [isLoading, contractReadsData, dispatch]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setShowAnimation(true);
    const cardConfig = getCardConfig();
    if (cardConfig) {
      dispatch(generateCardNumbers(cardConfig));
      setTimeout(() => {
        setIsRefreshing(false);
        setShowAnimation(false);
      }, 400);
    }
  };

  return (
    <div className={styles.bingoCardWrapper}>
      {!contractReadsData?.isPlayerExists && (
        <RefreshCcw
          className={`${styles.refreshIcon} ${
            isRefreshing ? styles.spinning : ""
          }`}
          onClick={handleRefresh}
        />
      )}
      <div className={styles.bingoCard}>
        <h1 className={styles.bingoCard__bingoTitle}>BINGO</h1>
        <div className={styles.bingoCard__cardGrid}>
          {playerCardNumbers.map((cardNumber, index) => {
            const isNumberAnnounced = announcedNumbers.includes(cardNumber);
            return (
              <div
                key={index}
                className={`${styles.bingoCard__gridCell} ${
                  showAnimation ? styles.changed : ""
                } ${isPlayerCardComplete() ? styles.bingoCard__winner : ""}`}
              >
                <span>{cardNumber}</span>
                {isNumberAnnounced && (
                  <span className={styles.bingoCard__marker} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
