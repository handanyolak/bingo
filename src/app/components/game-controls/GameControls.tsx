import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { useGameSwitching } from "@/app/components/game-controls";
import styles from "@/app/components/game-controls/GameControls.module.scss";
import { Button } from "@/app/components/ui/button";

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
