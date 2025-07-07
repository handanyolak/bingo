"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";

import { AddressList } from "@/app/components/common/AddressList";
import { useWinners } from "@/app/hooks/useWinners";
import { useWinnersClaimLogic } from "@/app/hooks/useWinnersClaimLogic";
import { useContractReads } from "@/lib/web3";
import styles from "@/styles/Winners.module.scss";
import type { WinnersProps } from "@/types";

export const Winners = ({
  onAddressClick,
  renderMode = "virtualized",
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

  const renderClaimControls = () => {
    if (!shouldShowClaimSection) return null;

    return (
      <div className={styles.winners__fullWidth}>
        {hasClaimableReward ? (
          <button
            className={styles.winners__claimButton}
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
          <div className={styles.winners__claimedStatus}>
            {t("controls.rewardClaimed")}
          </div>
        )}
      </div>
    );
  };

  const claimSection = (
    <>
      {shouldShowClaimSection && !isLoading && hasClaimableReward && (
        <div className={styles.winners__infoBox}>{t("controls.claimInfo")}</div>
      )}
      {renderClaimControls()}
    </>
  );

  return (
    <AddressList
      addresses={winnerAddresses}
      onAddressClick={onAddressClick}
      renderMode={renderMode}
      isLoading={isLoading && isConnected}
      isVisible={isVisible}
      emptyText={t("controls.noWinners")}
      keyPrefix="winner"
      estimateSize={55}
      additionalContent={claimSection}
    />
  );
};
