"use client";

import { useAccount } from "wagmi";

import { useContractReads } from "@/lib/web3/hooks/useContractReads";
import { useGameState, useCardManagerState } from "@/app/hooks/cardManager";
import styles from "@/styles/CardManager.module.scss";

import { BuyCardButton } from "./BuyCardButton";
import { RequestRandomButton } from "./RequestRandomButton";
import { GameTimer } from "./GameTimer";
import { SubmitCardButton } from "./SubmitCardButton";
import { Loader2 } from "lucide-react";

export const CardManager = () => {
  const { isConnected } = useAccount();
  const { data: contractData, isLoading, refetch } = useContractReads();

  const { remainingTime } = useGameState({
    contractData,
    lottieRef: null,
    timerAnimation: null,
  });

  const {
    shouldShowBuyCard,
    shouldShowRequestRandom,
    shouldShowTimer,
    shouldShowSubmitCard,
  } = useCardManagerState({
    contractData,
    isConnected,
    remainingTime,
  });

  if (isLoading) {
    return (
      <div className={styles.cardManager__loading}>
        <Loader2 className="global-loader" color="gray" />
      </div>
    );
  }

  return (
    <div className={styles.cardManager__container}>
      {shouldShowBuyCard && <BuyCardButton refetch={refetch} />}

      {shouldShowRequestRandom && <RequestRandomButton refetch={refetch} />}

      {shouldShowTimer && <GameTimer contractData={contractData} />}

      {shouldShowSubmitCard && (
        <SubmitCardButton refetch={refetch} shouldShow={true} />
      )}
    </div>
  );
};
