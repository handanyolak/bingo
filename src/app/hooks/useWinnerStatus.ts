import { Address } from "viem";
import { useAccount } from "wagmi";
import { useContractReads } from "@/lib/web3";

export const useWinnerStatus = () => {
  const { address } = useAccount();
  const { data: contractData } = useContractReads();

  const isWinner = address
    ? contractData?.winners?.winnerAddresses?.includes?.(address as Address) ??
      false
    : false;

  return { isWinner };
};
