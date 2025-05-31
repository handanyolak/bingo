import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppButton } from "@/app/components/common/AppButton";
import { useRandomNumbers } from "@/app/hooks/card-manager";
import type { RequestRandomButtonProps } from "@/types/card-manager";

export const RequestRandomButton = ({ refetch }: RequestRandomButtonProps) => {
  const t = useTranslations();
  const { handleRequestRandomNumbers, isRequestRandomLoading } =
    useRandomNumbers(refetch);

  return (
    <AppButton
      text={t("controls.requestRandomNumbers")}
      animated={!isRequestRandomLoading}
      onClick={handleRequestRandomNumbers}
      disabled={isRequestRandomLoading}
      content={isRequestRandomLoading && <Loader2 className="global-loader" />}
    />
  );
};
