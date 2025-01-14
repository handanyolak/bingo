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
      <div className={styles.header__top}>
        <h1 className={styles.header__title}>Bingo</h1>
        <div className={styles.header__settings}>
          <LanguageSwitcher />
          <button className={styles.header__colorButton} onClick={cycleColor}>
            <div className={styles.header__colorIndicator}></div>
            <span>{t("changeCardColor")}</span>
          </button>
        </div>
      </div>

      <div className={styles.header__bottom}>
        <ConnectButton />
      </div>
    </header>
  );
};
