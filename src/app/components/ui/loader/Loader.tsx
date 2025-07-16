import { type LoaderProps } from "@/app/components/ui";
import styles from "@/app/components/ui/loader/Loader.module.scss";

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
