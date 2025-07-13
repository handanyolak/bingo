import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppButton } from "@/app/components/common/Button";
import { useGameSwitching } from "@/app/hooks/useGameSwitching";
import styles from "@/styles/GameControls.module.scss";

export const GameControls = () => {
  const t = useTranslations("controls");
  const { switchGame, isDisabledPrevious, isDisabledNext, isLoading } =
    useGameSwitching();

  return (
    <div className={styles.controls}>
      <AppButton
        text={t("previousGame")}
        contentPosition="left"
        content={<ChevronsLeft />}
        className={styles.controls__button}
        onClick={() => switchGame(-1)}
        disabled={isDisabledPrevious || isLoading}
      />
      <AppButton
        text={t("nextGame")}
        contentPosition="right"
        content={<ChevronsRight />}
        className={styles.controls__button}
        onClick={() => switchGame(1)}
        disabled={isDisabledNext || isLoading}
      />
    </div>
  );
};
