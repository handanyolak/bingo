import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppButton } from "@/app/components/common/AppButton";
import { useCardSubmission } from "@/app/hooks/card-manager";
import type { SubmitCardButtonProps } from "@/types/card-manager";

export const SubmitCardButton = ({ shouldShow }: SubmitCardButtonProps) => {
  const t = useTranslations();
  const { handleCardSubmit, isSubmitCardLoading, isSubmitCardSuccess } =
    useCardSubmission();

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
