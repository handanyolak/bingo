"use client";

import { Loader2, Trophy, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";

import { AppModal } from "@/app/components/common/AppModal";
import { Tab, TabItem } from "@/app/components/common/Tab";
import { ConnectButton } from "@/app/components/ConnectButton";
import { BingoLogo } from "@/app/components/BingoLogo";
import { MenuContent } from "@/app/components/MenuContent";
import { MobileMenu } from "@/app/components/MobileMenu";
import { Players } from "@/app/components/Players";
import { Winners } from "@/app/components/Winners";
import { useHeader } from "@/app/hooks/useHeader";
import { useContractReads } from "@/lib/web3/";
import styles from "@/styles/Header.module.scss";

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

  const { isConnected } = useAccount();
  const { data: contractData, isLoading: gameLoading } = useContractReads();

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
          {gameLoading && isConnected && <Loader2 className="global-loader" />}
          <div className={styles.header__gameIdContainer}>
            {contractData?.targetGameId && (
              <div className={styles.header__gameId}>
                #{contractData.targetGameId}
              </div>
            )}
          </div>
        </div>
      </div>

      <AppModal title="Bingo" isOpen={isModalOpen} onClose={handleModalClose}>
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
      </AppModal>
    </header>
  );
};
