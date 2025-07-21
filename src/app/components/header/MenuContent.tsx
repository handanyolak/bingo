import { Palette, UsersRound, Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  useMenuContent,
  LanguageSwitcher,
  type MenuContentProps,
} from "@/app/components/header";
import styles from "@/app/components/header/MenuContent.module.scss";
import { Button } from "@/app/components/ui";

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
      <Button
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
      <Button
        text={t("theme")}
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
