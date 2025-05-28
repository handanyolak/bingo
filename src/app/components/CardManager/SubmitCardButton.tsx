import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppButton } from "@/app/components/common/AppButton";
import { useCardSubmission } from "@/app/hooks/cardManager";
import type { SubmitCardButtonProps } from "@/types/cardManager";

export const SubmitCardButton = ({
  refetch,
  shouldShow,
}: SubmitCardButtonProps) => {
  const t = useTranslations();
  const { handleCardSubmit, isSubmitCardLoading, isSubmitCardSuccess } =
    useCardSubmission(refetch);

  if (!shouldShow || isSubmitCardSuccess) return null;

  return (
    <AppButton
      text={t("controls.submitCard")}
      animated={!isSubmitCardLoading}
      onClick={handleCardSubmit}
      disabled={isSubmitCardLoading}
      content={isSubmitCardLoading && <Loader2 className="global-loader" />}
    />
  );
};
