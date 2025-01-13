"use client";

import styles from "@/styles/Header.module.scss";
import { ConnectButton } from "@/app/components/ConnectButton";
import { useColor } from "@/app/contexts/ColorContext";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";

export const Header = () => {
  const t = useTranslations("controls");

  const { cycleColor } = useColor();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Bingo</h1>
      <ConnectButton />
      <LanguageSwitcher />
      <button className={styles.changeColorButton} onClick={cycleColor}>
        <div className={styles.colorBall}></div>
        <span>{t("changeCardColor")}</span>
      </button>
    </header>
  );
};
