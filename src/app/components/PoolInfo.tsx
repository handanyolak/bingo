import { formatEther } from "viem";

import { AppButton } from "@/app/components/common/AppButton";
import { Tooltip } from "@/app/components/common/Tooltip";

interface PoolInfoProps {
  prizePoolBalance: bigint;
  requestRandomnessPayment?: bigint;
  requestRandomNumbersRefund?: bigint;
}

export const PoolInfo = ({
  prizePoolBalance,
  requestRandomnessPayment,
  requestRandomNumbersRefund,
}: PoolInfoProps) => {
  const tooltipTexts = [];

  if (requestRandomnessPayment) {
    tooltipTexts.push(
      `Randomness Payment: ${formatEther(requestRandomnessPayment)} ETH`
    );
  }

  if (requestRandomNumbersRefund) {
    tooltipTexts.push(
      `Random Numbers Refund: ${formatEther(requestRandomNumbersRefund)} ETH`
    );
  }

  return (
    <Tooltip texts={tooltipTexts} position="top">
      <AppButton
        text={`Total Pool Balance: ${formatEther(prizePoolBalance)} ETH`}
        rounded="lg"
      />
    </Tooltip>
  );
};
