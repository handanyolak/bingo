import { useTranslations } from "next-intl";
import { AppButton } from "@/app/components/common/AppButton";
import { Palette, UsersRound } from "lucide-react";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import styles from "@/styles/MenuContent.module.scss";

interface MenuContentProps {
  onModalOpen: () => void;
  onColorChange: () => void;
}

export const MenuContent = ({
  onModalOpen,
  onColorChange,
}: MenuContentProps) => {
  const t = useTranslations("controls");

  return (
    <div className={styles.menuContent}>
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
