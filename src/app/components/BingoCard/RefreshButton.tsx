import { RefreshCcw } from "lucide-react";
import { RefreshButtonProps } from "@/types";
import styles from "@/styles/bingo-card/RefreshButton.module.scss";

export const RefreshButton = ({
  isRefreshingCard,
  onRefresh,
}: RefreshButtonProps) => {
  return (
    <button className={styles.refreshButton__wrapper} onClick={onRefresh}>
      <RefreshCcw
        size={30}
        className={`${styles.refreshButton__icon} ${
          isRefreshingCard ? styles["refreshButton__icon--spinning"] : ""
        }`}
      />
    </button>
  );
};
