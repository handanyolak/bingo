"use client";

import Lottie from "lottie-react";
import { useAccountChange } from "@/app/contexts/AccountChangeContext";
import { useAccount } from "wagmi";

import { BingoCard } from "@/app/components/BingoCard";
import { CardManager } from "@/app/components/CardManager";
import { DrawnNumbers } from "@/app/components/DrawnNumbers";
import { GameControls } from "@/app/components/GameControls";
import { Loader } from "@/app/components/Loader";
import { PoolInfo } from "@/app/components/PoolInfo";
import { useConfetti } from "@/app/hooks/useConfetti";
import { useWinnerStatus } from "@/app/hooks/useWinnerStatus";
import { useContractReads } from "@/lib/web3";
import { useAppSelector } from "@/lib/store/hooks";
import { selectIsGameFinishedInUi } from "@/lib/store/bingo";
import styles from "@/styles/Bingo.module.scss";

import confettiAnimation from "../../../public/animations/confetti.json";

export const Bingo = () => {
  const { key } = useAccountChange();
  const { isConnected } = useAccount();
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);
  const { isLoading: contractLoading } = useContractReads();
  const { isWinner } = useWinnerStatus();

  const { showConfetti, handleConfettiComplete } = useConfetti({
    isGameFinished: isGameFinishedInUi,
    isWinner,
  });

  if (contractLoading && isConnected) {
    return <Loader />;
  }

  return (
    <div key={key} className={styles.bingo__page}>
      <div className={styles.bingo__container}>
        <div className={styles.bingo__wrapper}>
          <PoolInfo />
          <CardManager />
          <div className={styles.bingo__game}>
            <BingoCard />
            <GameControls />
          </div>

          <DrawnNumbers loading={contractLoading} />
          {showConfetti && (
            <Lottie
              animationData={confettiAnimation}
              loop={false}
              className={styles.bingo__confetti}
              onComplete={handleConfettiComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};
