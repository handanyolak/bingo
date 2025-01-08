"use client";

import styles from "@/styles/Header.module.scss";
import { ConnectButton } from "@/app/components/ConnectButton";
import { useColor } from "@/app/contexts/ColorContext";

export const Header = () => {
  const { cycleColor } = useColor();
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Bingo</h1>
      <ConnectButton />
      <button className={styles.changeColorButton} onClick={cycleColor}>
        <div className={styles.colorBall}></div>
        <span>Change card color</span>
      </button>
    </header>
  );
};
