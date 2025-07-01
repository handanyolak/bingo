"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { VirtualizedContent } from "@/app/components/common/VirtualizedContent";
import { useWinners } from "@/app/hooks/useWinners";
import { useWinnersClaimLogic } from "@/app/hooks/useWinnersClaimLogic";
import { useContractReads } from "@/lib/web3";
import styles from "@/styles/Winners.module.scss";
import type { WinnersProps } from "@/types/participants";

// Winner item render function
const renderWinnerItem = (
  address: Address,
  index: number,
  onAddressClick: (address: Address) => void
) => {
  if (!address) return null;

  return (
    <button
      type="button"
      className={styles.winners__item}
      onClick={() => onAddressClick(address)}
    >
      {index + 1}. {address}
    </button>
  );
};

export const Winners = ({
  onAddressClick,
  renderMode = "virtualized",
  customRender,
  enableDynamicMeasurement = false,
  debug = false,
  horizontal = false,
}: WinnersProps) => {
  const t = useTranslations();
  const { isConnected } = useAccount();
  const { data: contractData, isLoading } = useContractReads();

  const {
    handleClaimReward,
    isClaimButtonDisabled,
    hasClaimableReward,
    isGameFinishedInUi,
    isWinner,
    address,
    isViewingOwnCard,
  } = useWinnersClaimLogic({
    isLoading,
  });

  const { winnerAddresses, isVisible } = useWinners({
    contractData,
    isGameFinishedInUi,
    isLoading,
  });

  const shouldShowClaimSection =
    isWinner &&
    isGameFinishedInUi &&
    address &&
    isViewingOwnCard &&
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

  // Winner item render function
  const renderWinner = (winnerAddress: Address, index: number) => {
    return renderWinnerItem(winnerAddress, index, onAddressClick);
  };

  const renderClaimControls = () => {
    if (!shouldShowClaimSection) return null;

    return (
      <div className="w-full">
        {hasClaimableReward ? (
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

  const claimSection = (
    <>
      {shouldShowClaimSection && !isLoading && hasClaimableReward && (
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
        {claimSection}
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
        {claimSection}
        <VirtualizedContent
          data={winnerAddresses}
          className={styles.winners__list}
          estimateSize={60}
          overscan={20}
          renderItem={renderWinner}
          getItemKey={(index) => `winner-${winnerAddresses[index]}`}
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
      {claimSection}
      <div className={styles.winners__list}>
        {winnerAddresses.map((winnerAddress, index) => (
          <button
            key={`winner-${winnerAddress}-${index}`}
            type="button"
            className={styles.winners__item}
            onClick={() => onAddressClick(winnerAddress)}
          >
            {index + 1}. {winnerAddress}
          </button>
        ))}
      </div>
    </>
  );
};
