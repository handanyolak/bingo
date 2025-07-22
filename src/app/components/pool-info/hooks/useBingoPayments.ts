import { useMemo } from "react";
import { formatEther } from "viem";

import { useContractReads } from "@/lib/web3";

export const useBingoPayments = () => {
  const { data, isLoading, error } = useContractReads({
    select: (fullData) => ({
      requestRandomnessPayment: fullData.requestRandomnessPayment,
      requestRandomNumbersRefund: fullData.requestRandomNumbersRefund,
      prizePoolBalance: fullData.prizePoolBalance ?? BigInt(0),
    }),
  });

  const formattedRandomnessPayment = useMemo(
    () =>
      data?.requestRandomnessPayment
        ? Number(formatEther(data.requestRandomnessPayment)).toFixed(8)
        : null,
    [data?.requestRandomnessPayment]
  );

  const formattedRandomNumbersRefund = useMemo(
    () =>
      data?.requestRandomNumbersRefund
        ? Number(formatEther(data.requestRandomNumbersRefund)).toFixed(8)
        : null,
    [data?.requestRandomNumbersRefund]
  );

  const formattedPrizePoolBalance = useMemo(
    () => Number(formatEther(data?.prizePoolBalance ?? BigInt(0))).toFixed(8),
    [data?.prizePoolBalance]
  );

  return {
    formattedRandomnessPayment,
    formattedRandomNumbersRefund,
    formattedPrizePoolBalance,
    isLoading,
    error,
  };
};
