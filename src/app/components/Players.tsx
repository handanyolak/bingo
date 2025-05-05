"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useMemo } from "react";
import { Address } from "viem";

import { VirtualizedContent } from "@/app/components/common/VirtualizedContent";
import { useContractReads } from "@/lib/web3";
import styles from "@/styles/Players.module.scss";

interface PlayersProps {
  onAddressClick: (address: Address) => void;
  renderMode?: "virtualized" | "normal";
  customRender?: (addresses: readonly Address[]) => ReactNode;
  enableDynamicMeasurement?: boolean;
  debug?: boolean;
  horizontal?: boolean;
}

export const Players = ({
  onAddressClick,
  renderMode = "virtualized",
  customRender,
  enableDynamicMeasurement = false,
  debug = false,
  horizontal = false,
}: PlayersProps) => {
  const t = useTranslations();
  const { data: contractData, isLoading } = useContractReads();

  const playerAddresses = useMemo(() => {
    return contractData?.players.playerAddresses || [];
  }, [contractData?.players.playerAddresses]);

  if (isLoading) {
    return (
      <div className={styles.players__list}>
        <div className={styles.players__loading}>
          <Loader2 className="global-loader" />
        </div>
      </div>
    );
  }

  if (playerAddresses.length === 0) {
    return (
      <div className={styles.players__list}>
        <div className={styles.players__empty}>{t("controls.noPlayers")}</div>
      </div>
    );
  }

  if (customRender) {
    return (
      <div className={styles.players__list}>
        {customRender(playerAddresses)}
      </div>
    );
  }

  if (renderMode === "virtualized") {
    const renderPlayerItem = (address: Address, index: number) => {
      if (!address) return null;

      return (
        <div
          className={styles.players__item}
          onClick={() => onAddressClick(address)}
        >
          {index + 1}. {address}
        </div>
      );
    };

    return (
      <VirtualizedContent
        data={playerAddresses}
        className={styles.players__list}
        estimateSize={50}
        overscan={20}
        renderItem={renderPlayerItem}
        getItemKey={(index) => `player-${index}`}
        horizontal={horizontal}
        debug={debug}
        enableDynamicMeasurement={enableDynamicMeasurement}
      />
    );
  }

  return (
    <div className={styles.players__list}>
      {playerAddresses.map((address, index) => (
        <div
          key={`player-${index}`}
          className={styles.players__item}
          onClick={() => onAddressClick(address)}
        >
          {index + 1}. {address}
        </div>
      ))}
    </div>
  );
};
