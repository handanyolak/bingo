import { Palette, UsersRound } from "lucide-react";
import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { AppButton } from "@/app/components/common/AppButton";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import styles from "@/styles/MenuContent.module.scss";
import type { MenuContentProps } from "@/types/layout";

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
