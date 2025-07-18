import { useAccount } from "wagmi";

import { useContractReads } from "@/lib/web3";

export const usePlayersData = () => {
  const { isConnected } = useAccount();

  const { data: playerAddresses = [], isLoading } = useContractReads({
    select: (fulldata) => fulldata?.players?.playerAddresses ?? [],
  });

  const isVisible = playerAddresses.length > 0;
  const showLoading = isLoading && isConnected;

  return {
    playerAddresses,
    isVisible,
    showLoading,
  };
};
