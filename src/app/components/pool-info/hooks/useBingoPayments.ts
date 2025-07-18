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
        ? formatEther(data.requestRandomnessPayment)
        : null,
    [data?.requestRandomnessPayment]
  );

  const formattedRandomNumbersRefund = useMemo(
    () =>
      data?.requestRandomNumbersRefund
        ? formatEther(data.requestRandomNumbersRefund)
        : null,
    [data?.requestRandomNumbersRefund]
  );

  const formattedPrizePoolBalance = useMemo(
    () => formatEther(data?.prizePoolBalance ?? BigInt(0)),
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
