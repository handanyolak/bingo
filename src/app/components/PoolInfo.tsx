import { Info } from "lucide-react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

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
  const { isConnected } = useAccount();

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
      {isConnected && (
        <AppButton
          text={`Total Pool Balance: ${formatEther(prizePoolBalance)} ETH`}
          rounded="lg"
          contentPosition="left"
          content={<Info size={20} strokeWidth={2.5} />}
        />
      )}
    </Tooltip>
  );
};
