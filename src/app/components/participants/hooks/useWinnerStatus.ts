import { Address } from "viem";
import { useAccount } from "wagmi";

import { useContractReads } from "@/lib/web3";

export const useWinnerStatus = () => {
  const { address } = useAccount();

  const { data: isWinner = false } = useContractReads({
    select: (data) => {
      if (!address || !data?.winners?.winnerAddresses) return false;
      return data.winners.winnerAddresses.includes(address as Address);
    },
  });

  return { isWinner };
};
