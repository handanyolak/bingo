"use client";

import { Loader2, Trophy, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { AppModal } from "@/app/components/common/AppModal";
import { Tab, TabItem } from "@/app/components/common/Tab";
import { ConnectButton } from "@/app/components/ConnectButton";
import { MenuContent } from "@/app/components/MenuContent";
import { MobileMenu } from "@/app/components/MobileMenu";
import { useColor } from "@/app/contexts/ColorContext";
import { useSelectedAddress } from "@/app/hooks/routing/useRouteParams";
import { useTransactionToast } from "@/app/hooks/useTransactionToast";
import { useContractReads, useContractWrite } from "@/lib/web3/";
import styles from "@/styles/Header.module.scss";

export const Header = () => {
  const t = useTranslations("controls");
  const { cycleColor } = useColor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  const { data: contractData, isLoading: gameLoading } = useContractReads();
  const { address } = useAccount();
  const {
    claimReward,
    isClaimRewardPending,
    isClaimRewardConfirming,
    isClaimRewardSuccess,
  } = useContractWrite();

  const { updateURL } = useSelectedAddress();
  const {
    showInitiatingTransactionToast,
    showConfirmingTransactionToast,
    showSuccessToast,
    showErrorToast,
    dismissToast,
  } = useTransactionToast();

  const [claimingInProgress, setClaimingInProgress] = useState(false);

  useEffect(() => {
    setHasClaimedReward(false);
  }, [contractData?.targetGameId, address]);

  useEffect(() => {
    const toastId = "claimRewardToast";
    if (claimingInProgress) {
      if (isClaimRewardConfirming) {
        showConfirmingTransactionToast(toastId);
      }

      if (isClaimRewardSuccess) {
        setClaimingInProgress(false);
        showSuccessToast(toastId, t("rewardClaimedMessage"));
        setHasClaimedReward(true);
      }
    }
  }, [
    isClaimRewardConfirming,
    isClaimRewardSuccess,
    claimingInProgress,
    showConfirmingTransactionToast,
    showSuccessToast,
    t,
  ]);

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

  const handleClaimReward = async () => {
    const toastId = "claimRewardToast";
    try {
      if (!contractData?.targetGameId) {
        toast.error(t("gameIdNotAvailable"));
        return;
      }

      setClaimingInProgress(true);
      showInitiatingTransactionToast(toastId);

      try {
        await claimReward(contractData.targetGameId);
      } catch (txError) {
        setClaimingInProgress(false);
        dismissToast(toastId);
        showErrorToast(txError);
        console.error("Transaction error:", txError);
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      setClaimingInProgress(false);
      dismissToast(toastId);
      showErrorToast(error);
    }
  };

  const isClaimButtonDisabled = isClaimRewardPending || isClaimRewardConfirming;
  const isWinner = useMemo(() => {
    return (
      address &&
      contractData?.winners.winnerAddresses.includes(address as Address)
    );
  }, [contractData?.winners.winnerAddresses, address]);

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
            title={t("players")}
            icon={<Users size={20} strokeWidth={2.5} />}
          >
            {gameLoading ? (
              <Loader2 className="global-loader" />
            ) : (
              <div className={styles.addressList}>
                {contractData?.players.playerAddresses.map((address) => (
                  <div
                    key={address}
                    className={styles.addressItem}
                    onClick={() => handleAddressClick(address)}
                  >
                    {address}
                  </div>
                ))}
                {contractData?.players.playerAddresses.length === 0 && (
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
                {contractData?.winners.winnerAddresses.map((winnerAddress) => (
                  <div key={winnerAddress} className={styles.addressItem}>
                    <span onClick={() => handleAddressClick(winnerAddress)}>
                      {winnerAddress}
                    </span>
                    {address === winnerAddress && !hasClaimedReward && (
                      <button
                        className={styles.claimButton}
                        onClick={handleClaimReward}
                        disabled={isClaimButtonDisabled}
                      >
                        {isClaimButtonDisabled
                          ? t("claiming")
                          : t("claimReward")}
                      </button>
                    )}
                    {address === winnerAddress && hasClaimedReward && (
                      <div className={styles.claimedStatus}>
                        {t("rewardClaimed")}
                      </div>
                    )}
                  </div>
                ))}
                {contractData?.winners.winnerAddresses.length === 0 && (
                  <div className={styles.emptyState}>{t("noWinners")}</div>
                )}
                {isWinner && !hasClaimedReward && (
                  <div className={styles.claimInfoBox}>{t("claimInfo")}</div>
                )}
              </div>
            )}
          </TabItem>
        </Tab>
      </AppModal>
    </header>
  );
};
