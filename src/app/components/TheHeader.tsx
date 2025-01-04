import styles from "@/styles/Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      {/* @ts-ignore */}
      <appkit-button />
    </header>
  );
};

export default Header;
