"use client";

import styles from "@/styles/Header.module.scss";
import { ConnectButton } from "@/app/components/ConnectButton";
import { useColor } from "@/app/contexts/ColorContext";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { AppButton } from "@/app/components/common/AppButton";
import { Palette, Trophy, Users, UsersRound } from "lucide-react";
import { AppModal } from "@/app/components/common/AppModal";
import { Tab, TabItem } from "@/app/components/common/Tab";
import { useState } from "react";

export const Header = () => {
  const t = useTranslations("controls");
  const { cycleColor } = useColor();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.header__top}>
        <h1 className={styles.header__title}>Bingo</h1>
        <div className={styles.header__settings}>
          <AppButton
            text={t("participants")}
            onClick={() => setIsModalOpen(true)}
            contentPosition="left"
            content={
              <UsersRound
                size={20}
                strokeWidth={2.5}
                className={styles.header__title}
              />
            }
          />
          <AppModal
            title="Bingo"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <Tab>
              <TabItem
                title={t("players")}
                icon={<Users size={20} strokeWidth={2.5} />}
              >
                <div>Players</div>
              </TabItem>

              <TabItem
                title={t("winners")}
                icon={<Trophy size={20} strokeWidth={2.5} />}
              >
                <div>Winners</div>
              </TabItem>
            </Tab>
          </AppModal>
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
