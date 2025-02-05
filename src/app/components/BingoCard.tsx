import { useEffect } from "react";

import {
  BingoCardNumbers,
  generateCardNumbers,
  selectDrawnNumbers,
  setCardNumbers,
} from "@/lib/store/features/bingo";
import { selectCardNumbers } from "@/lib/store/features/bingo";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";
import styles from "@/styles/BingoCard.module.scss";

export const BingoCard = () => {
  const { data: contractReadsData, isLoading } = useContractReads();

  const cardNumbers = useAppSelector(selectCardNumbers);
  const drawnNumbers = useAppSelector(selectDrawnNumbers);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading && contractReadsData) {
      if (contractReadsData.isPlayerExists) {
        dispatch(
          setCardNumbers(
            contractReadsData.playerDetails.cardNumbers as BingoCardNumbers
          )
        );
      } else {
        dispatch(generateCardNumbers(contractReadsData));
      }
    }
  }, [isLoading, contractReadsData, dispatch]);

  return (
    <div className={styles.bingoCard}>
      <h1 className={styles.bingoCard__bingoTitle}>BINGO</h1>
      <div className={styles.bingoCard__cardGrid}>
        {cardNumbers.map((cardNumber, index) => {
          const isDrawn = drawnNumbers.includes(cardNumber);
          return (
            <div key={index} className={styles.bingoCard__gridCell}>
              {cardNumber}
              {isDrawn && <span className={styles.bingoCard__marker} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
