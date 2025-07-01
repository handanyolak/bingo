import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppButton } from "@/app/components/common/AppButton";
import { useCardSubmission } from "@/app/hooks/card-manager";
import { useIsViewingOwnCard } from "@/app/hooks/useIsViewingOwnCard";
import type { SubmitCardButtonProps } from "@/types/card-manager";

export const SubmitCardButton = ({ shouldShow }: SubmitCardButtonProps) => {
  const t = useTranslations();
  const { isViewingOwnCard } = useIsViewingOwnCard();
  const { handleCardSubmit, isSubmitCardLoading, isSubmitCardSuccess } =
    useCardSubmission();

  if (!shouldShow || isSubmitCardSuccess || !isViewingOwnCard) return null;

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
