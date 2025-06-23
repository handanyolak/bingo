import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppButton } from "@/app/components/common/AppButton";
import { useCardPurchase } from "@/app/hooks/card-manager";

export const BuyCardButton = () => {
  const t = useTranslations();
  const { handleBuyCard, isBuyCardLoading } = useCardPurchase();

  return (
    <AppButton
      text={t("controls.buyTheCard")}
      animated={!isBuyCardLoading}
      onClick={handleBuyCard}
      contentPosition="right"
      content={isBuyCardLoading && <Loader2 className="global-loader" />}
      disabled={isBuyCardLoading}
    />
  );
};
