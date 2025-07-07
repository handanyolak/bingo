"use client";

import { useTranslations } from "next-intl";

import { AddressList } from "@/app/components/common/AddressList";
import { usePlayersData } from "@/app/hooks/usePlayers";
import type { PlayersProps } from "@/types";

export const Players = ({
  onAddressClick,
  renderMode = "virtualized",
}: PlayersProps) => {
  const t = useTranslations();
  const { playerAddresses, isVisible, showLoading } = usePlayersData();

  return (
    <AddressList
      addresses={playerAddresses}
      onAddressClick={onAddressClick}
      renderMode={renderMode}
      isLoading={showLoading}
      isVisible={isVisible}
      emptyText={t("controls.noPlayers")}
      keyPrefix="player"
      estimateSize={55}
    />
  );
};
