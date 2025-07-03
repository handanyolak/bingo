"use client";

import { useCardManagerStep } from "@/app/hooks/card-manager";
import styles from "@/styles/CardManager.module.scss";

import { BuyCardButton } from "./BuyCardButton";
import { GameTimer } from "./GameTimer";
import { RequestRandomButton } from "./RequestRandomButton";
import { SubmitCardButton } from "./SubmitCardButton";

export const CardManager = () => {
  const renderComponent = useCardManagerStep();

  const renderCurrentStep = () => {
    switch (renderComponent) {
      case "buyCard":
        return <BuyCardButton />;

      case "requestRandom":
        return <RequestRandomButton />;

      case "timer":
        return <GameTimer />;

      case "submitCard":
        return (
          <>
            <GameTimer />
            <SubmitCardButton shouldShow={true} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.cardManager__container}>{renderCurrentStep()}</div>
  );
};
