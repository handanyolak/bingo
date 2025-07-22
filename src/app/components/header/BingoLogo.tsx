"use client";

import styles from "@/app/components/header/BingoLogo.module.scss";

export const BingoLogo = () => {
  return (
    <div className={styles.bingoLogo}>
      <div className={styles.bingoLogo__container}>
        <span className={styles.bingoLogo__bingText}>BING</span>
        <div className={styles.bingoLogo__oCell}></div>
        <span className={styles.bingoLogo__fiText}>Fi</span>
      </div>
    </div>
  );
};
