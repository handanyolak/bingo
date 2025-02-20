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
import { useColor } from "@/app/contexts/ColorContext";
import { useSelectedAddress } from "@/app/hooks/routing/useSelectedAddress";
import { useContractReads } from "@/lib/web3/";
import styles from "@/styles/Header.module.scss";

export const Header = () => {
  const t = useTranslations("controls");
  const { cycleColor } = useColor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: contractReadsData, isLoading: gameLoading } =
    useContractReads();

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
          {contractReadsData && (
            <span className={styles.header__gameId}>
              #{contractReadsData.targetGameId}
            </span>
          )}
        </div>
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
            {gameLoading ? (
              <Loader2 className="global-loader" />
            ) : (
              <div className={styles.addressList}>
                {contractReadsData?.players.playerAddresses.map((address) => (
                  <div
                    key={address}
                    className={styles.addressItem}
                    onClick={() => handleAddressClick(address)}
                  >
                    {address}
                  </div>
                ))}
                {contractReadsData?.players.playerAddresses.length === 0 && (
                  <div className={styles.emptyState}>{t("noPlayers")}</div>
                )}
              </div>
            )}
          </TabItem>
          <TabItem
            title={t("winners")}
            icon={<Trophy size={20} strokeWidth={2.5} />}
          >
            {gameLoading ? (
              <Loader2 className="global-loader" />
            ) : (
              <div className={styles.addressList}>
                {contractReadsData?.winners.winnerAddresses.map((address) => (
                  <div
                    key={address}
                    className={styles.addressItem}
                    onClick={() => handleAddressClick(address)}
                  >
                    {address}
                  </div>
                ))}
                {contractReadsData?.winners.winnerAddresses.length === 0 && (
                  <div className={styles.emptyState}>{t("noWinners")}</div>
                )}
              </div>
            )}
          </TabItem>
        </Tab>
      </AppModal>
    </header>
  );
};
