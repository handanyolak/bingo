import styles from "@/styles/BingoCard.module.scss";
import { lighten, darken } from "polished";

type BingoCardProps = {
  numbers: number[];
  color?: string;
};

const BingoCard: React.FC<BingoCardProps> = ({
  numbers,
  color = "#6b7280",
}) => {
  const lightColor = lighten(0.2, color);
  const darkColor = darken(0.2, color);

  return (
    <div
      className={styles.bingoCard}
      style={
        {
          "--card-color": color,
          "--card-light-color": lightColor,
          "--card-dark-color": darkColor,
        } as React.CSSProperties
      }
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
