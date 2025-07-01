import { useEffect, useState } from "react";
import { useIsViewingOwnCard } from "@/app/hooks/useIsViewingOwnCard";

type UseConfettiProps = {
  isGameFinished: boolean;
  isWinner: boolean | undefined;
};

export const useConfetti = ({ isGameFinished, isWinner }: UseConfettiProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { isViewingOwnCard } = useIsViewingOwnCard();

  useEffect(() => {
    if (isGameFinished && isWinner) {
      setShowConfetti(true);
    }
  }, [isGameFinished, isWinner]);

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  return {
    showConfetti:
      showConfetti && isGameFinished && Boolean(isWinner) && isViewingOwnCard,
    handleConfettiComplete,
  };
};
