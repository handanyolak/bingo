"use client";

import { Trophy, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { MenuContent, MobileMenu, useHeader } from "@/app/components/header";
import { BingoLogo } from "@/app/components/header/BingoLogo";
import { ConnectButton } from "@/app/components/header/ConnectButton";
import styles from "@/app/components/header/Header.module.scss";
import { Players, Winners } from "@/app/components/participants";
import { Modal, Tab, TabItem } from "@/app/components/ui";

export const Header = () => {
  const t = useTranslations();
  const {
    isModalOpen,
    isMobileMenuOpen,
    handleModalOpen,
    handleModalClose,
    toggleMobileMenu,
    handleColorChange,
    handleAddressClick,
  } = useHeader();

  return (
    <header className={styles.header}>
      <div className={styles.header__top}>
        <BingoLogo />

        <div className={styles.header__settings}>
          <div className={styles.desktopView}>
            <MenuContent
              onModalOpen={handleModalOpen}
              onColorChange={handleColorChange}
            />
          </div>
          <div className={styles.mobileView}>
            <MobileMenu isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu}>
              <MenuContent
                onModalOpen={handleModalOpen}
                onColorChange={handleColorChange}
              />
            </MobileMenu>
          </div>
        </div>
      </div>

      <div className={styles.header__bottom}>
        <div className={styles.header__content}>
          <ConnectButton />
        </div>
      </div>

      <Modal title="Bingo" isOpen={isModalOpen} onClose={handleModalClose}>
        <Tab>
          <TabItem
            title={t("controls.players")}
            icon={<Users size={20} strokeWidth={2.5} />}
          >
            <Players onAddressClick={handleAddressClick} />
          </TabItem>
          <TabItem
            title={t("controls.winners")}
            icon={<Trophy size={20} strokeWidth={2.5} />}
          >
            <Winners onAddressClick={handleAddressClick} />
          </TabItem>
        </Tab>
      </Modal>
    </header>
  );
};
