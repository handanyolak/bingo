"use client";

import Lottie from "lottie-react";

import { useBingoGameState } from "@/app/components/bingo";
import styles from "@/app/components/bingo/Bingo.module.scss";
import { BingoCard } from "@/app/components/bingo-card";
import { CardManager } from "@/app/components/card-manager";
import { DrawnNumbers } from "@/app/components/drawn-numbers";
import { GameControls } from "@/app/components/game-controls";
import { PoolInfo } from "@/app/components/pool-info";
import { Loader } from "@/app/components/ui";

import confettiAnimation from "../../../../public/animations/confetti.json";

export const Bingo = () => {
  const {
    key,
    contractLoading,
    showConfetti,
    shouldShowLoader,
    handleConfettiComplete,
  } = useBingoGameState();

  if (shouldShowLoader) {
    return <Loader role="status" aria-label="Loading game data" />;
  }

  return (
    <div key={key} className={styles.bingo__page}>
      <div className={styles.bingo__container}>
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
  );
};
