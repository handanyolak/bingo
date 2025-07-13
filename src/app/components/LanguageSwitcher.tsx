"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { useLanguageSwitcher } from "@/app/hooks/useLanguageSwitcher";
import { LANGUAGES, LanguageCode } from "@/i18n/config";
import styles from "@/styles/LanguageSwitcher.module.scss";

export const LanguageSwitcher = () => {
  const { locale, isOpen, handleOptionClick, toggleDropdown, dropdownRef } =
    useLanguageSwitcher();

  return (
    <div className={styles.languageSwitcher} ref={dropdownRef}>
      <Button
        text={LANGUAGES[locale]}
        contentPosition="right"
        className={styles.languageSwitcher__button}
        onClick={toggleDropdown}
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
