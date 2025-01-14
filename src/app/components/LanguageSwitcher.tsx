"use client";

import styles from "@/styles/LanguageSwitcher.module.scss";
import { useState } from "react";
import { useLocale } from "@/app/contexts/LocaleContext";
import { LANGUAGES, LanguageCode } from "@/i18n/config";
import { ChevronDown } from "lucide-react";

export const LanguageSwitcher = () => {
  const { locale, updateLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (code: LanguageCode) => {
    updateLocale(code);
    setIsOpen(false);
  };

  return (
    <div className={styles.languageSwitcher}>
      <button
        type="button"
        className={styles.languageSwitcher__button}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {LANGUAGES[locale]}
        <ChevronDown size={20} className={styles.languageSwitcher__icon} />
      </button>

      {isOpen && (
        <div className={styles.languageSwitcher__dropdown}>
          <div className={styles.languageSwitcher__dropdownContent}>
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <button
                key={code}
                className={styles.languageSwitcher__option}
                onClick={() => handleOptionClick(code as LanguageCode)}
                role="menuitem"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
