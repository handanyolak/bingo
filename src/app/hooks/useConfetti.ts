import { useEffect, useState } from "react";

type UseConfettiProps = {
  isGameFinished: boolean;
  isWinner: boolean | undefined;
};

export const useConfetti = ({ isGameFinished, isWinner }: UseConfettiProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (isGameFinished && isWinner) {
      setShowConfetti(true);
    }
  }, [isGameFinished, isWinner]);

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  return {
    showConfetti: showConfetti && isGameFinished && Boolean(isWinner),
    handleConfettiComplete,
  };
};
