import { useMemo } from "react";
import { formatEther } from "viem";

import { useContractReads } from "@/lib/web3";

export const useBingoPayments = () => {
  const { data: contractData, isLoading } = useContractReads();

  const paymentsData = useMemo(() => {
    const requestRandomnessPayment = contractData?.requestRandomnessPayment;
    const requestRandomNumbersRefund = contractData?.requestRandomNumbersRefund;
    const prizePoolBalance = contractData?.prizePoolBalance ?? BigInt(0);

    return {
      formattedRandomnessPayment: requestRandomnessPayment
        ? formatEther(requestRandomnessPayment)
        : null,
      formattedRandomNumbersRefund: requestRandomNumbersRefund
        ? formatEther(requestRandomNumbersRefund)
        : null,
      formattedPrizePoolBalance: formatEther(prizePoolBalance),
    };
  }, [contractData]);

  return {
    ...paymentsData,
    isLoading,
  };
};
