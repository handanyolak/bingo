"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Address } from "viem";

import { VirtualizedContent } from "@/app/components/common/VirtualizedContent";
import { usePlayersData } from "@/app/hooks/usePlayersData";
import styles from "@/styles/Players.module.scss";
import type { PlayersProps } from "@/types/participants";

// Player item render function
const renderPlayerItem = (
  address: Address,
  index: number,
  onAddressClick: (address: Address) => void
) => {
  if (!address) return null;

  return (
    <button
      type="button"
      className={styles.players__item}
      onClick={() => onAddressClick(address)}
    >
      {index + 1}. {address}
    </button>
  );
};

export const Players = ({
  onAddressClick,
  renderMode = "virtualized",
  customRender,
  enableDynamicMeasurement = false,
  debug = false,
  horizontal = false,
}: PlayersProps) => {
  const t = useTranslations();
  const { playerAddresses, isVisible, showLoading } = usePlayersData();

  if (showLoading) {
    return (
      <div className={styles.players__list}>
        <div className={styles.players__loading}>
          <Loader2 className="global-loader" />
        </div>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <div className={styles.players__list}>
        <div className={styles.players__empty}>{t("controls.noPlayers")}</div>
      </div>
    );
  }

  // Custom render mode
  if (customRender) {
    return (
      <div className={styles.players__list}>
        {customRender(playerAddresses)}
      </div>
    );
  }

  // Player item render function
  const renderPlayer = (address: Address, index: number) => {
    return renderPlayerItem(address, index, onAddressClick);
  };

  // Virtualized render mode
  if (renderMode === "virtualized") {
    return (
      <VirtualizedContent
        data={playerAddresses}
        className={styles.players__list}
        estimateSize={50}
        overscan={20}
        renderItem={renderPlayer}
        getItemKey={(index) => `player-${playerAddresses[index]}`}
        horizontal={horizontal}
        debug={debug}
        enableDynamicMeasurement={enableDynamicMeasurement}
      />
    );
  }

  // Default render mode
  return (
    <div className={styles.players__list}>
      {playerAddresses.map((address, index) => (
        <button
          key={`player-${address}`}
          type="button"
          className={styles.players__item}
          onClick={() => onAddressClick(address)}
        >
          {index + 1}. {address}
        </button>
      ))}
    </div>
  );
};
