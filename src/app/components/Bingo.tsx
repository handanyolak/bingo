"use client";

import Lottie from "lottie-react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { BingoCard } from "@/app/components/BingoCard";
import { CardManager } from "@/app/components/CardManager";
import { AppButton } from "@/app/components/common/AppButton";
import { DrawnNumbers } from "@/app/components/DrawnNumbers";
import { Loader } from "@/app/components/Loader";
import { PoolInfo } from "@/app/components/PoolInfo";
import { useAccountChange } from "@/app/contexts/AccountChangeContext";
import { useSelectedGameId } from "@/app/hooks/routing/useRouteParams";
import { useGameToasts } from "@/app/hooks/toast/useGameToasts";
import {
  resetStateForNewGame,
  selectIsGameFinishedInUi,
} from "@/lib/store/bingo";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";
import styles from "@/styles/Bingo.module.scss";

import confettiAnimation from "../../../public/animations/confetti.json";

export const Bingo = () => {
  const t = useTranslations("controls");
  const { address, isConnected } = useAccount();
  const dispatch = useAppDispatch();
  const { key } = useAccountChange();
  const [showConfetti, setShowConfetti] = useState(true);

  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);

  const {
    data: contractData,
    isLoading: contractLoading,
    refetch,
  } = useContractReads();
  const { selectedGameId, updateSelectedGameId, maxGameId } =
    useSelectedGameId();

  const { dismissAllToasts } = useGameToasts(contractData);

  const isWinner = useMemo(() => {
    return (
      address &&
      contractData?.winners.winnerAddresses.includes(address as Address)
    );
  }, [contractData?.winners.winnerAddresses, address]);

  const handleSwitchGame = async (offset: number) => {
    const newGameId = selectedGameId + BigInt(offset);
    dismissAllToasts();
    dispatch(resetStateForNewGame());
    updateSelectedGameId(newGameId);
    await refetch();
  };

  useEffect(() => {
    const loadData = async () => {
      if (!contractLoading) {
        await refetch();
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGameId]);

  useEffect(() => {
    if (isGameFinishedInUi && isWinner) {
      setShowConfetti(true);
    }
  }, [isGameFinishedInUi, isWinner]);

  if (contractLoading && isConnected) {
    return <Loader />;
  }

  return (
    <div key={key} className={styles.bingo__page}>
      <div className={styles.bingo__container}>
        <div className={styles.bingo__wrapper}>
          <PoolInfo
            prizePoolBalance={contractData?.prizePoolBalance ?? BigInt(0)}
            requestRandomnessPayment={contractData?.requestRandomnessPayment}
            requestRandomNumbersRefund={
              contractData?.requestRandomNumbersRefund
            }
          />
          <CardManager />
          <div className={styles.bingo__game}>
            <BingoCard />
            <div className={styles.bingo__controls}>
              <AppButton
                text={t("previousGame")}
                contentPosition="left"
                content={<ChevronsLeft />}
                className={styles.bingo__control}
                onClick={() => handleSwitchGame(-1)}
                disabled={selectedGameId === BigInt(0) || contractLoading}
              />
              <AppButton
                text={t("nextGame")}
                contentPosition="right"
                content={<ChevronsRight />}
                className={styles.bingo__control}
                onClick={() => handleSwitchGame(1)}
                disabled={selectedGameId === maxGameId || contractLoading}
              />
            </div>
          </div>

          <DrawnNumbers loading={contractLoading} />
          {isGameFinishedInUi && isWinner && showConfetti && (
            <Lottie
              animationData={confettiAnimation}
              loop={false}
              className={styles.bingo__confetti}
              onComplete={() => setShowConfetti(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
