"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { VirtualizedContent } from "@/app/components/common/VirtualizedContent";
import { useWinners } from "@/app/hooks/useWinners";
import { useClaimReward } from "@/app/hooks/useClaimReward";
import { useTransactionToast } from "@/app/hooks/useTransactionToast";
import { selectIsGameFinishedInUi } from "@/lib/store/bingo";
import { useAppSelector } from "@/lib/store/hooks";
import { useContractReads, useContractWrite } from "@/lib/web3";
import { useWinnerStatus } from "@/app/hooks/useWinnerStatus";
import styles from "@/styles/Winners.module.scss";
import type { WinnersProps } from "@/types/participants";

export const Winners = ({
  onAddressClick,
  renderMode = "virtualized",
  customRender,
  enableDynamicMeasurement = false,
  debug = false,
  horizontal = false,
}: WinnersProps) => {
  const t = useTranslations();

  const { address, isConnected } = useAccount();
  const { data: contractData, isLoading } = useContractReads();
  const { isWinner } = useWinnerStatus();
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);

  const {
    claimReward,
    isClaimRewardPending,
    isClaimRewardConfirming,
    isClaimRewardSuccess,
  } = useContractWrite();

  const {
    showInitiatingTransactionToast,
    showSuccessToast,
    showErrorToast,
    dismissToast,
  } = useTransactionToast();

  const { winnerAddresses, isVisible } = useWinners({
    contractData,
    isGameFinishedInUi,
    isLoading,
  });

  const {
    handleClaimReward,
    hasUserClaimedGame,
    isClaimButtonDisabled,
    isLoadingClaimStatus,
  } = useClaimReward({
    address,
    contractData,
    isWinner,
    claimReward,
    isClaimRewardPending,
    isClaimRewardConfirming,
    isClaimRewardSuccess,
    showInitiatingTransactionToast,
    showSuccessToast,
    showErrorToast,
    dismissToast,
    rewardClaimedMessage: t("controls.rewardClaimedMessage"),
  });

  const shouldShowClaimInfo =
    !isLoading &&
    isWinner &&
    isGameFinishedInUi &&
    !hasUserClaimedGame(contractData?.targetGameId || BigInt(0));

  const shouldShowClaimControls =
    isWinner &&
    isGameFinishedInUi &&
    address &&
    winnerAddresses.findIndex((addr) => addr === address) !== -1;

  if (isLoading && isConnected) {
    return (
      <div className={styles.winners__list}>
        <div className={styles.winners__loading}>
          <Loader2 className="global-loader" />
        </div>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <div className={styles.winners__list}>
        <div className={styles.winners__empty}>{t("controls.noWinners")}</div>
      </div>
    );
  }

  // Helper functions for rendering
  const renderWinner = (winnerAddress: Address, index: number) => {
    if (!winnerAddress) return null;

    return (
      <div className={styles.winners__item}>
        <span onClick={() => onAddressClick(winnerAddress)}>
          {index + 1}. {winnerAddress}
        </span>
      </div>
    );
  };

  const renderClaimControls = () => {
    if (!shouldShowClaimControls) return null;

    return (
      <div className="w-full">
        {isLoadingClaimStatus ? (
          <div className={styles.winners__claim_loading}>
            <Loader2 className="global-loader" size={18} />
          </div>
        ) : !hasUserClaimedGame(contractData?.targetGameId || BigInt(0)) ? (
          <button
            className={styles.winners__claim_button}
            onClick={handleClaimReward}
            disabled={isClaimButtonDisabled}
          >
            {isClaimButtonDisabled ? (
              <>
                <Loader2 className="global-loader" size={14} />
                {t("controls.claiming")}
              </>
            ) : (
              t("controls.claimReward")
            )}
          </button>
        ) : (
          <div className={styles.winners__claimed_status}>
            {t("controls.rewardClaimed")}
          </div>
        )}
      </div>
    );
  };

  const renderClaimSection = () => (
    <>
      {shouldShowClaimInfo && (
        <div className={styles.winners__info_box}>
          {t("controls.claimInfo")}
        </div>
      )}
      {renderClaimControls()}
    </>
  );

  // Custom render mode
  if (customRender) {
    return (
      <>
        {renderClaimSection()}
        <div className={styles.winners__list}>
          {customRender(winnerAddresses, renderWinner)}
        </div>
      </>
    );
  }

  // Virtualized render mode
  if (renderMode === "virtualized") {
    return (
      <>
        {renderClaimSection()}
        <VirtualizedContent
          data={winnerAddresses}
          className={styles.winners__list}
          estimateSize={60}
          overscan={20}
          renderItem={renderWinner}
          getItemKey={(index) => `winner-${index}`}
          horizontal={horizontal}
          debug={debug}
          enableDynamicMeasurement={enableDynamicMeasurement}
        />
      </>
    );
  }

  // Default render mode
  return (
    <>
      {renderClaimSection()}
      <div
        className={styles.winners__list}
        style={{
          maxHeight: "500px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        {winnerAddresses.map((winnerAddress, index) => (
          <div
            key={`winner-${winnerAddress}-${index}`}
            className={styles.winners__item}
          >
            <span onClick={() => onAddressClick(winnerAddress)}>
              {index + 1}. {winnerAddress}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};
