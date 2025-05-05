"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/app/components/common/AppButton";
import { useLocale } from "@/app/contexts/LocaleContext";
import { useClickOutside } from "@/app/hooks/useClickOutside";
import { LANGUAGES, LanguageCode } from "@/i18n/config";
import styles from "@/styles/LanguageSwitcher.module.scss";

export const LanguageSwitcher = () => {
  const { locale, updateLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (code: LanguageCode) => {
    updateLocale(code);
    setIsOpen(false);
  };

  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  return (
    <div className={styles.languageSwitcher} ref={dropdownRef}>
      <AppButton
        text={LANGUAGES[locale]}
        contentPosition="right"
        className={styles.languageSwitcher__button}
        onClick={() => setIsOpen(!isOpen)}
        content={
          <ChevronDown
            size={20}
            strokeWidth={2.5}
            className={`${styles["languageSwitcher__icon"]} ${
              isOpen ? styles["languageSwitcher__icon--rotated"] : ""
            }`}
          />
        }
      />

      {isOpen && (
        <div className={styles.languageSwitcher__dropdown}>
          <ul className={styles.languageSwitcher__dropdownContent}>
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <li
                key={code}
                className={styles.languageSwitcher__option}
                onClick={() => handleOptionClick(code as LanguageCode)}
                role="menuitem"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
