import styles from "@/styles/BingoCard.module.scss";

type BingoCardProps = {
  numbers: number[];
  color?: string;
};

const BingoCard: React.FC<BingoCardProps> = ({
  numbers,
  color = "#ef4444",
}) => {
  return (
    <div
      className={styles.bingoCard}
      style={{ "--card-color": color } as React.CSSProperties}
    >
      <h1 className={styles.bingoTitle}>BINGO</h1>
      <div className={styles.cardGrid}>
        {numbers.map((num, index) => (
          <div key={index} className={styles.gridCell}>
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingoCard;
