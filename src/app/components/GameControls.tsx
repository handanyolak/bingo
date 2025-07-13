import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/app/components/ui/button";
import { useGameSwitching } from "@/app/hooks/useGameSwitching";
import styles from "@/styles/GameControls.module.scss";

export const GameControls = () => {
  const t = useTranslations("controls");
  const { switchGame, isDisabledPrevious, isDisabledNext, isLoading } =
    useGameSwitching();

  return (
    <div className={styles.controls}>
      <Button
        text={t("previousGame")}
        contentPosition="left"
        content={<ChevronsLeft />}
        className={styles.controls__button}
        onClick={() => switchGame(-1)}
        disabled={isDisabledPrevious || isLoading}
      />
      <Button
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
