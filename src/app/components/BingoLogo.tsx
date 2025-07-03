"use client";

import styles from "@/styles/BingoLogo.module.scss";

export const BingoLogo = () => {
  return (
    <div className={styles.bingoLogo}>
      <div className={styles.bingoLogo__container}>
        <span className={styles.bingoLogo__bingText}>BING</span>
        <div className={styles.bingoLogo__oCell}></div>
      </div>
    </div>
  );
};
