import { useMemo } from "react";

import { useBingoPayments } from "./useBingoPayments";

export const usePoolTooltips = () => {
  const { formattedRandomnessPayment, formattedRandomNumbersRefund } =
    useBingoPayments();

  const tooltipTexts = useMemo(() => {
    const texts: string[] = [];

    if (formattedRandomnessPayment) {
      texts.push(`Randomness Payment: ${formattedRandomnessPayment} ETH`);
    }

    if (formattedRandomNumbersRefund) {
      texts.push(`Random Numbers Refund: ${formattedRandomNumbersRefund} ETH`);
    }

    return texts;
  }, [formattedRandomnessPayment, formattedRandomNumbersRefund]);

  return {
    tooltipTexts,
  };
};
