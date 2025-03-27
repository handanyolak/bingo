import { useEffect, useState, useMemo } from "react";
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
  const { data: contractData, isLoading: isContractDataLoading } =
    useContractReads();

  const [isRefreshingCard, setIsRefreshingCard] = useState(false);

  const cardNumbers = useAppSelector(selectCardNumbers);
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const { isPlayerCardComplete } = useBingoDrawing();
  const dispatch = useAppDispatch();

  const getCardConfig = useMemo(() => {
    if (!contractData) return null;

    return {
      BINGO_MIN_NUMBER: contractData.BINGO_MIN_NUMBER,
      BINGO_MAX_NUMBER: contractData.BINGO_MAX_NUMBER,
      BINGO_CARD_NUMBERS_COUNT: contractData.BINGO_CARD_NUMBERS_COUNT,
    };
  }, [contractData]);

  useEffect(() => {
    if (isContractDataLoading || !contractData) return;

    if (
      contractData.isPlayerExists &&
      contractData.playerDetails?.cardNumbers
    ) {
      dispatch(
        setCardNumbers(
          contractData.playerDetails.cardNumbers as BingoCardNumbers
        )
      );
    } else if (getCardConfig) {
      dispatch(generateCardNumbers(getCardConfig));
    }
  }, [isContractDataLoading, contractData, dispatch, getCardConfig]);

  const handleCardRefresh = () => {
    if (!getCardConfig) return;

    setIsRefreshingCard(true);

    dispatch(generateCardNumbers(getCardConfig));

    setTimeout(() => {
      setIsRefreshingCard(false);
    }, 400);
  };

  const getCardCellClassName = (isAnimating: boolean, isCompleted: boolean) => {
    return `${styles.bingoCard__gridCell} 
      ${isAnimating ? styles.changed : ""} 
      ${isCompleted ? styles.bingoCard__winner : ""}`;
  };

  return (
    <div className={styles.bingoCardWrapper}>
      {!contractData?.isPlayerExists && (
        <RefreshCcw
          className={`${styles.refreshIcon} ${
            isRefreshingCard ? styles.spinning : ""
          }`}
          onClick={handleCardRefresh}
        />
      )}

      <div className={styles.bingoCard}>
        <h1 className={styles.bingoCard__bingoTitle}>BINGO</h1>

        <div className={styles.bingoCard__cardGrid}>
          {cardNumbers.map((number, index) => {
            const isNumberDrawn = drawnNumbers.includes(number);
            const cellClassName = getCardCellClassName(
              isRefreshingCard,
              isPlayerCardComplete()
            );

            return (
              <div key={index} className={cellClassName}>
                <span>{number}</span>
                {isNumberDrawn && contractData?.isPlayerExists && (
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
