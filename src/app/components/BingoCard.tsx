import styles from "@/styles/BingoCard.module.scss";

type BingoCardProps = {
  numbers: number[];
  drawnNumbers: number[];
};

export const BingoCard: React.FC<BingoCardProps> = ({
  numbers,
  drawnNumbers,
}) => {
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
