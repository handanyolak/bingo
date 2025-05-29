import { Info } from "lucide-react";
import { useAccount } from "wagmi";

import { AppButton } from "@/app/components/common/AppButton";
import { Tooltip } from "@/app/components/common/Tooltip";
import { useBingoPayments } from "@/app/hooks/useBingoPayments";
import { usePoolTooltips } from "@/app/hooks/usePoolTooltips";

export const PoolInfo = () => {
  const { isConnected } = useAccount();
  const { formattedPrizePoolBalance } = useBingoPayments();
  const { tooltipTexts } = usePoolTooltips();

  return (
    <Tooltip texts={tooltipTexts} position="top">
      {isConnected && (
        <AppButton
          text={`Total Pool Balance: ${formattedPrizePoolBalance} ETH`}
          rounded="lg"
          contentPosition="left"
          content={<Info size={20} strokeWidth={2.5} />}
        />
      )}
    </Tooltip>
  );
};
