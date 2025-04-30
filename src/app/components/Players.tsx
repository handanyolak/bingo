"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Address } from "viem";

import { useContractReads } from "@/lib/web3";
import styles from "@/styles/Players.module.scss";

interface PlayersProps {
  onAddressClick: (address: Address) => void;
}

export const Players = ({ onAddressClick }: PlayersProps) => {
  const t = useTranslations();
  const { data: contractData, isLoading } = useContractReads();

  return (
    <div className={styles.players__list}>
      {isLoading ? (
        <div className={styles.players__loading}>
          <Loader2 className="global-loader" />
        </div>
      ) : contractData?.players.playerAddresses.length === 0 ? (
        <div className={styles.players__empty}>{t("controls.noPlayers")}</div>
      ) : (
        contractData?.players.playerAddresses.map((address) => (
          <div
            key={address}
            className={styles.players__item}
            onClick={() => onAddressClick(address)}
          >
            {address}
          </div>
        ))
      )}
    </div>
  );
};
