import {
  generateCardNumbers,
  selectDrawnNumbers,
} from "@/lib/store/features/bingo";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import styles from "@/styles/BingoCard.module.scss";
import { selectCardNumbers } from "@/lib/store/features/bingo";
import { useContractReads } from "@/lib/web3";
import { useEffect } from "react";

export const BingoCard = () => {
  const { data: contractData, isLoading } = useContractReads();

  const cardNumbers = useAppSelector(selectCardNumbers);
  const drawnNumbers = useAppSelector(selectDrawnNumbers);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading && contractData) {
      dispatch(generateCardNumbers(contractData));
    }
  }, [isLoading, contractData, dispatch]);

  return (
    <div className={styles.bingoCard}>
      <h1 className={styles.bingoCard__bingoTitle}>BINGO</h1>
      <div className={styles.bingoCard__cardGrid}>
        {cardNumbers.map((num, index) => {
          const isDrawn = drawnNumbers.includes(num);
          return (
            <div key={index} className={styles.bingoCard__gridCell}>
              {num}
              {isDrawn && <span className={styles.bingoCard__marker} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
