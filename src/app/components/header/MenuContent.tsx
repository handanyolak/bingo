import { Palette, UsersRound, Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppButton } from "@/app/components/common/Button";
import type { MenuContentProps } from "@/app/components/header";
import { useMenuContent } from "@/app/components/header";
import styles from "@/app/components/header/MenuContent.module.scss";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";

export const MenuContent = ({
  onModalOpen,
  onColorChange,
}: MenuContentProps) => {
  const t = useTranslations("controls");
  const { toggleTheme, getThemeIcon } = useMenuContent();

  return (
    <div className={styles.menuContent}>
      <button onClick={toggleTheme}>
        {getThemeIcon() === "sun" ? <Sun /> : <Moon />}
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
