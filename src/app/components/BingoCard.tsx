import styles from "@/styles/BingoCard.module.scss";

type BingoCardProps = {
  numbers: number[];
};

const BingoCard: React.FC<BingoCardProps> = ({ numbers }) => {
  return (
    <div className={styles.bingoCard}>
      <h1 className={styles.bingoTitle}>BINGO</h1>
      <div className={styles.cardGrid}>
        {numbers.map((num, index) => (
          <div key={index} className={styles.gridCell}>
            {num}
            <span className={styles.marker} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingoCard;
