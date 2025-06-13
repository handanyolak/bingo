import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";

import { AppButton } from "@/app/components/common/AppButton";
import { Tooltip } from "@/app/components/common/Tooltip";
import { useBingoPayments } from "@/app/hooks/useBingoPayments";
import { usePoolTooltips } from "@/app/hooks/usePoolTooltips";

export const PoolInfo = () => {
  const { isConnected } = useAccount();
  const { formattedPrizePoolBalance } = useBingoPayments();
  const { tooltipTexts } = usePoolTooltips();
  const t = useTranslations("controls");

  return (
    <Tooltip texts={tooltipTexts} position="top">
      {isConnected && (
        <AppButton
          text={t("totalPoolBalance", { amount: formattedPrizePoolBalance })}
          rounded="lg"
          contentPosition="left"
          content={<Info size={20} strokeWidth={2.5} />}
        />
      )}
    </Tooltip>
  );
};
