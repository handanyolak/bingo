"use client";

import { useCardManagerStep } from "@/app/components/card-manager";
import {
  BuyCardButton,
  GameTimer,
  RequestRandomButton,
  SubmitCardButton,
} from "@/app/components/card-manager";

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

  return <div>{renderCurrentStep()}</div>;
};
