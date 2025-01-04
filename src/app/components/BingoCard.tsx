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
      <h1 className={styles.bingoTitle}>BINGO</h1>
      <div className={styles.cardGrid}>
        {numbers.map((num, index) => {
          const isDrawn = drawnNumbers.includes(num);
          return (
            <div key={index} className={styles.gridCell}>
              {num}
              {isDrawn && <span className={styles.marker} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
