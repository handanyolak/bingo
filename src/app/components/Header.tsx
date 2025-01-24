"use client";

import styles from "@/styles/Header.module.scss";
import { ConnectButton } from "@/app/components/ConnectButton";
import { useColor } from "@/app/contexts/ColorContext";
import { useTranslations } from "next-intl";
import { Trophy, Users } from "lucide-react";
import { AppModal } from "@/app/components/common/AppModal";
import { Tab, TabItem } from "@/app/components/common/Tab";
import { useState } from "react";
import { MenuContent } from "@/app/components/MenuContent";
import { MobileMenu } from "@/app/components/MobileMenu";

export const Header = () => {
  const t = useTranslations("controls");
  const { cycleColor } = useColor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleColorChange = () => {
    cycleColor();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__top}>
        <h1 className={styles.header__title}>Bingo</h1>

        <div className={styles.header__settings}>
          <div className={styles.desktopView}>
            <MenuContent
              onModalOpen={handleModalOpen}
              onColorChange={handleColorChange}
            />
          </div>
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuContent
              onModalOpen={handleModalOpen}
              onColorChange={handleColorChange}
            />
          </MobileMenu>
        </div>
      </div>

      <div className={styles.header__bottom}>
        <ConnectButton />
      </div>

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
    </header>
  );
};
