"use client";

import styles from "@/styles/Header.module.scss";
import { ConnectButton } from "@/app/components/ConnectButton";
import { useColor } from "@/app/contexts/ColorContext";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { AppButton } from "@/app/components/AppButton";

export const Header = () => {
  const t = useTranslations("controls");
  const { cycleColor } = useColor();

  return (
    <header className={styles.header}>
      <div className={styles.header__top}>
        <h1 className={styles.header__title}>Bingo</h1>
        <div className={styles.header__settings}>
          <LanguageSwitcher />
          <AppButton
            text={t("changeCardColor")}
            content={<div className={styles.header__colorIndicator}></div>}
            contentPosition="left"
            onClick={cycleColor}
          />
        </div>
      </div>

      <div className={styles.header__bottom}>
        <ConnectButton />
      </div>
    </header>
  );
};
