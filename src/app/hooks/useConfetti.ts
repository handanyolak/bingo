import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSelectedAddress } from "@/app/hooks/routing/useRouteParams";

type UseConfettiProps = {
  isGameFinished: boolean;
  isWinner: boolean | undefined;
};

export const useConfetti = ({ isGameFinished, isWinner }: UseConfettiProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { address: connectedAddress } = useAccount();
  const { selectedAddress } = useSelectedAddress();

  useEffect(() => {
    if (isGameFinished && isWinner) {
      setShowConfetti(true);
    }
  }, [isGameFinished, isWinner]);

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  const isViewingOwnCard =
    connectedAddress && selectedAddress
      ? connectedAddress.toLowerCase() === selectedAddress.toLowerCase()
      : false;

  return {
    showConfetti:
      showConfetti && isGameFinished && Boolean(isWinner) && isViewingOwnCard,
    handleConfettiComplete,
  };
};
