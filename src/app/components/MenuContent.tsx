import { useTranslations } from "next-intl";
import { AppButton } from "@/app/components/common/AppButton";
import { Palette, UsersRound } from "lucide-react";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import styles from "@/styles/MenuContent.module.scss";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

interface MenuContentProps {
  onModalOpen: () => void;
  onColorChange: () => void;
}

export const MenuContent = ({
  onModalOpen,
  onColorChange,
}: MenuContentProps) => {
  const t = useTranslations("controls");

  const { theme, setTheme } = useTheme();
  return (
    <div className={styles.menuContent}>
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? <Sun /> : <Moon />}
      </button>
      <AppButton
        text={t("participants")}
        onClick={onModalOpen}
        contentPosition="left"
        className={styles.menuContent__button}
        content={
          <UsersRound
            size={20}
            strokeWidth={2.5}
            className={styles.menuContent__icon}
          />
        }
      />
      <LanguageSwitcher />
      <AppButton
        text={t("changeCardColor")}
        onClick={onColorChange}
        contentPosition="left"
        className={styles.menuContent__button}
        content={
          <Palette
            size={20}
            strokeWidth={2.5}
            className={styles.menuContent__icon}
          />
        }
      />
    </div>
  );
};
