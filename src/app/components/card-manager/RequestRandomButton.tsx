import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRandomNumbers } from "@/app/components/card-manager";
import { Button } from "@/app/components/ui/button";

export const RequestRandomButton = () => {
  const t = useTranslations();
  const { handleRequestRandomNumbers, isRequestRandomLoading } =
    useRandomNumbers();

  return (
    <Button
      text={t("controls.requestRandomNumbers")}
      animated={!isRequestRandomLoading}
      onClick={handleRequestRandomNumbers}
      disabled={isRequestRandomLoading}
      content={isRequestRandomLoading && <Loader2 className="global-loader" />}
    />
  );
};
