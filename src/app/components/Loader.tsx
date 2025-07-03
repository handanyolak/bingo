import styles from "@/styles/Loader.module.scss";
import { LoaderProps } from "@/types/common/components";

export const Loader = ({
  role = "status",
  "aria-label": ariaLabel = "Loading",
}: LoaderProps) => {
  return (
    <div className={styles.pageLoader} role={role} aria-label={ariaLabel}>
      Loading&hellip;
    </div>
  );
};
