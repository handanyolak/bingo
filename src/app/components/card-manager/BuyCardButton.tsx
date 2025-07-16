import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCardPurchase } from "@/app/components/card-manager";
import { Button } from "@/app/components/ui";

export const BuyCardButton = () => {
  const t = useTranslations();
  const { handleBuyCard, isBuyCardLoading } = useCardPurchase();

  return (
    <Button
      text={t("controls.buyTheCard")}
      animated={!isBuyCardLoading}
      onClick={handleBuyCard}
      contentPosition="right"
      content={isBuyCardLoading && <Loader2 className="global-loader" />}
      disabled={isBuyCardLoading}
    />
  );
};
