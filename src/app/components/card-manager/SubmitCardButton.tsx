import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCardSubmission } from "@/app/components/card-manager";
import { AppButton } from "@/app/components/common/Button";
import { useIsViewingOwnCard } from "@/app/hooks/useIsViewingOwnCard";

export const SubmitCardButton = ({ shouldShow }: { shouldShow: boolean }) => {
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
