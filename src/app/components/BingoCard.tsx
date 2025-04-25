import { RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";

import { useSelectedGameId } from "@/app/hooks/routing/useRouteParams";
import { useBingoDrawing } from "@/app/hooks/useBingoDrawing";
import {
  BingoCardNumbers,
  generateCardNumbers,
  selectDrawnNumbers,
  setCardNumbers,
} from "@/lib/store/bingo";
import { selectCardNumbers } from "@/lib/store/bingo";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";
import styles from "@/styles/BingoCard.module.scss";

export const BingoCard = () => {
  const t = useTranslations("controls");
  const {
    data: contractData,
    isLoading: isContractDataLoading,
    refetch,
  } = useContractReads();

  const [isRefreshingCard, setIsRefreshingCard] = useState(false);
  const { selectedGameId, maxGameId } = useSelectedGameId();

  const cardNumbers = useAppSelector(selectCardNumbers);
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const { isPlayerCardComplete } = useBingoDrawing();
  const dispatch = useAppDispatch();

  const isCurrentGame = useMemo(() => {
    if (!maxGameId || !selectedGameId) return true;
    return selectedGameId === maxGameId;
  }, [selectedGameId, maxGameId]);

  const playerParticipationStatus = useMemo(() => {
    if (isCurrentGame || contractData?.isPlayerExists) {
      return "active";
    }
    return "notPlayed";
  }, [isCurrentGame, contractData?.isPlayerExists]);

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

    const areCardsEmpty = cardNumbers.every((num) => num === 0);
    const hasValidPlayerCards =
      contractData.isPlayerExists &&
      contractData.playerDetails &&
      contractData.playerDetails.cardNumbers &&
      Array.isArray(contractData.playerDetails.cardNumbers) &&
      contractData.playerDetails.cardNumbers.some((n) => n > 0);

    if (hasValidPlayerCards) {
      dispatch(
        setCardNumbers(
          contractData.playerDetails!.cardNumbers as BingoCardNumbers
        )
      );
    } else if (getCardConfig && areCardsEmpty) {
      dispatch(generateCardNumbers(getCardConfig));
    }
  }, [
    isContractDataLoading,
    contractData,
    dispatch,
    getCardConfig,
    cardNumbers,
  ]);

  useEffect(() => {
    if (!isContractDataLoading) {
      refetch();
    }
  }, [selectedGameId, refetch, isContractDataLoading]);

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

  const emptyGridCells = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => i);
  }, []);

  return (
    <div className={styles.bingoCardWrapper}>
      {isCurrentGame && !contractData?.isPlayerExists && (
        <RefreshCcw
          className={`${styles.refreshIcon} ${
            isRefreshingCard ? styles.spinning : ""
          }`}
          onClick={handleCardRefresh}
        />
      )}

      <div className={styles.bingoCard}>
        <h1 className={styles.bingoCard__bingoTitle}>BINGO</h1>

        {playerParticipationStatus === "active" ? (
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
        ) : (
          <div className={styles.bingoCard__cardGrid}>
            {emptyGridCells.map((index) => (
              <div key={index} className={styles.bingoCard__emptyCell} />
            ))}
            <div className={styles.bingoCard__notPlayedText}>
              {t("notParticipated")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
