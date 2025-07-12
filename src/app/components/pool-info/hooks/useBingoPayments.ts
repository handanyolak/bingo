import { useMemo } from "react";
import { formatEther } from "viem";

import { useContractReads } from "@/lib/web3";

export const useBingoPayments = () => {
  const { data: contractData, isLoading } = useContractReads();

  const formattedRandomnessPayment = useMemo(() => {
    return contractData?.requestRandomnessPayment
      ? formatEther(contractData.requestRandomnessPayment)
      : null;
  }, [contractData?.requestRandomnessPayment]);

  const formattedRandomNumbersRefund = useMemo(() => {
    return contractData?.requestRandomNumbersRefund
      ? formatEther(contractData.requestRandomNumbersRefund)
      : null;
  }, [contractData?.requestRandomNumbersRefund]);

  const formattedPrizePoolBalance = useMemo(() => {
    const prizePoolBalance = contractData?.prizePoolBalance ?? BigInt(0);
    return formatEther(prizePoolBalance);
  }, [contractData?.prizePoolBalance]);

  return {
    formattedRandomnessPayment,
    formattedRandomNumbersRefund,
    formattedPrizePoolBalance,
    isLoading,
  };
};
