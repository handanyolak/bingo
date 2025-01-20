import { selectDrawnNumbers } from "@/lib/store/features/bingo";
import { useAppSelector } from "@/lib/store/hooks";
import styles from "@/styles/BingoCard.module.scss";
import { useEffect, useState } from "react";

export const BingoCard = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const drawnNumbers = useAppSelector(selectDrawnNumbers);

  useEffect(() => {
    const generateNumbers = () => {
      const numbers = new Set<number>();
      while (numbers.size < 25) {
        const num = Math.floor(Math.random() * 75) + 1;
        numbers.add(num);
      }
      return Array.from(numbers);
    };

    setNumbers(generateNumbers());
  }, []);

  return (
    <div className={styles.bingoCard}>
      <h1 className={styles.bingoCard__bingoTitle}>BINGO</h1>
      <div className={styles.bingoCard__cardGrid}>
        {numbers.map((num, index) => {
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
