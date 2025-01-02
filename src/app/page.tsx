import BingoCard from "@/app/components/BingoCard";
import styles from "@/styles/page.module.scss";
import { useState } from "react";

export default function Home() {
  const bingoNumbers = Array.from(
    { length: 25 },
    () => Math.floor(Math.random() * 75) + 1
  );

  const cardColor = "#3b82f6";

  return (
    <div className={styles.homePage}>
      <div className={styles.container}>
        <div className={styles.innerWrapper}>
          <BingoCard numbers={bingoNumbers} color={cardColor} />
        </div>
      </div>
    </div>
  );
}
