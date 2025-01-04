"use client";

import styles from "@/styles/Header.module.scss";
import { ConnectButton } from "./ConnectButton";

export const Header = () => {
  return (
    <header className={styles.header}>
      <ConnectButton />
    </header>
  );
};
