"use client";

import styles from "@/styles/Header.module.scss";
import { ConnectButton } from "@/app/components/ConnectButton";
import { useColor } from "@/app/contexts/ColorContext";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { AppButton } from "@/app/components/AppButton";
import { Award, Palette, Users } from "lucide-react";

export const Header = () => {
  const t = useTranslations("controls");
  const { cycleColor } = useColor();

  return (
    <header className={styles.header}>
      <div className={styles.header__top}>
        <h1 className={styles.header__title}>Bingo</h1>
        <div className={styles.header__settings}>
          <AppButton
            text="Winners"
            contentPosition="left"
            content={
              <Award
                size={20}
                strokeWidth={2.5}
                className={styles.header__title}
              />
            }
          />
          <AppButton
            text="Players"
            contentPosition="left"
            content={
              <Users
                size={20}
                strokeWidth={2.5}
                className={styles.header__title}
              />
            }
          />
          <LanguageSwitcher />
          <AppButton
            text={t("changeCardColor")}
            onClick={cycleColor}
            contentPosition="left"
            content={
              <Palette
                size={20}
                strokeWidth={2.5}
                className={styles.header__title}
              />
            }
          />
        </div>
      </div>

      <div className={styles.header__bottom}>
        <ConnectButton />
      </div>
    </header>
  );
};
