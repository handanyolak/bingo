"use client";

import Lottie from "lottie-react";

import { BingoCard } from "@/app/components/BingoCard";
import { CardManager } from "@/app/components/CardManager";
import { DrawnNumbers } from "@/app/components/DrawnNumbers";
import { GameControls } from "@/app/components/GameControls";
import { Loader } from "@/app/components/Loader";
import { PoolInfo } from "@/app/components/PoolInfo";
import { useBingoGameState } from "@/app/hooks/useBingoGameState";
import styles from "@/styles/Bingo.module.scss";

import confettiAnimation from "../../../public/animations/confetti.json";

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
