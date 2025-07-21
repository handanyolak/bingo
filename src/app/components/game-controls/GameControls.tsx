import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { useGameSwitching } from "@/app/components/game-controls";
import styles from "@/app/components/game-controls/GameControls.module.scss";
import { Button } from "@/app/components/ui";
import { useSelectedGameId } from "@/app/hooks";

export const GameControls = () => {
  const {
    switchGame,
    goToFirstGame,
    goToCurrentGame,
    isDisabledPrevious,
    isDisabledNext,
    isLoading,
  } = useGameSwitching();
  const { selectedGameId } = useSelectedGameId();

  return (
    <div className={styles.controls}>
      <Button
        content={<ChevronsLeft size={16} />}
        onClick={goToFirstGame}
        disabled={isDisabledPrevious || isLoading}
        className={styles.controls__edgeButton}
        rounded="full"
      />
      <Button
        content={<ChevronLeft size={20} />}
        onClick={() => switchGame(-1)}
        disabled={isDisabledPrevious || isLoading}
        className={styles.controls__navButton}
        rounded="full"
      />

      <div className={styles.controls__gameId}>
        #{selectedGameId.toString()}
      </div>

      <Button
        content={<ChevronRight size={20} />}
        onClick={() => switchGame(1)}
        disabled={isDisabledNext || isLoading}
        className={styles.controls__navButton}
        rounded="full"
      />
      <Button
        content={<ChevronsRight size={16} />}
        onClick={goToCurrentGame}
        disabled={isDisabledNext || isLoading}
        className={styles.controls__edgeButton}
        rounded="full"
      />
    </div>
  );
};
