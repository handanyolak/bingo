import { useState } from "react";

import { useClickOutside } from "@/app/hooks/useClickOutside";
import { useLocale } from "@/contexts";
import { LanguageCode } from "@/i18n/config";

export const useLanguageSwitcher = () => {
  const { locale, updateLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (code: LanguageCode) => {
    updateLocale(code);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const dropdownRef = useClickOutside<HTMLDivElement>(closeDropdown);

  return {
    locale,
    isOpen,
    handleOptionClick,
    toggleDropdown,
    dropdownRef,
  };
};
