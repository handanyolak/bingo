import styles from "@/styles/Loader.module.scss";

export const Loader = () => {
  return (
    <div className={styles.loading} aria-label="Loading">
      Loading&hellip;
    </div>
  );
};
