import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";

import { useBingoPayments, usePoolTooltips } from "@/app/components/pool-info";
import { Button, Tooltip } from "@/app/components/ui";

export const PoolInfo = () => {
  const { isConnected } = useAccount();
  const { formattedPrizePoolBalance } = useBingoPayments();
  const { tooltipTexts } = usePoolTooltips();
  const t = useTranslations("controls");

  return (
    <Tooltip texts={tooltipTexts} position="bottom">
      {isConnected && (
        <Button
          text={t("totalPoolBalance", { amount: formattedPrizePoolBalance })}
          rounded="lg"
          contentPosition="left"
          content={<Info size={20} strokeWidth={2.5} />}
        />
      )}
    </Tooltip>
  );
};
