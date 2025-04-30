"use client";

import { Loader2, Trophy, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Address } from "viem";

import { AppModal } from "@/app/components/common/AppModal";
import { Tab, TabItem } from "@/app/components/common/Tab";
import { ConnectButton } from "@/app/components/ConnectButton";
import { MenuContent } from "@/app/components/MenuContent";
import { MobileMenu } from "@/app/components/MobileMenu";
import { Players } from "@/app/components/Players";
import { Winners } from "@/app/components/Winners";
import { useColor } from "@/app/contexts/ColorContext";
import { useSelectedAddress } from "@/app/hooks/routing/useRouteParams";
import { useContractReads } from "@/lib/web3/";
import styles from "@/styles/Header.module.scss";

export const Header = () => {
  const t = useTranslations();
  const { cycleColor } = useColor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: contractData, isLoading: gameLoading } = useContractReads();
  const { updateURL } = useSelectedAddress();

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleColorChange = () => {
    cycleColor();
    setIsMobileMenuOpen(false);
  };

  const handleAddressClick = (address: Address) => {
    updateURL(address);
    setIsModalOpen(false);
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
          <div className={styles.mobileView}>
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
      </div>

      <div className={styles.header__bottom}>
        <div className={styles.header__content}>
          <ConnectButton />
          {gameLoading && <Loader2 className="global-loader" />}
          <div className={styles.header__gameIdContainer}>
            {contractData && (
              <div className={styles.header__gameId}>
                #{contractData.targetGameId}
              </div>
            )}
          </div>
        </div>
      </div>

      <AppModal
        title="Bingo"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
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
