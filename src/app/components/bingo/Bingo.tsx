"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useBingoGameState } from "@/app/components/bingo";
import styles from "@/app/components/bingo/Bingo.module.scss";
import { BingoCard } from "@/app/components/bingo-card";
import { CardManager } from "@/app/components/card-manager";
import { DrawnNumbers } from "@/app/components/drawn-numbers";
import { GameControls } from "@/app/components/game-controls";
import { PoolInfo } from "@/app/components/pool-info";
import { Loader } from "@/app/components/ui";

import confettiAnimation from "../../../../public/animations/confetti.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

export const Bingo = () => {
  const [mounted, setMounted] = useState(false);
  const {
    key,
    contractLoading,
    showConfetti,
    shouldShowLoader,
    handleConfettiComplete,
  } = useBingoGameState();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || shouldShowLoader) {
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
