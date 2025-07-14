import { useState } from "react";
import { Address } from "viem";

import { useColorTheme } from "@/app/contexts/ThemeContext";
import { useSelectedAddress } from "@/app/hooks/routing/useRouteParams";

export const useHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cycleColor } = useColorTheme();
  const { updateURL } = useSelectedAddress();

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleColorChange = () => {
    cycleColor();
  };

  const handleAddressClick = (address: Address) => {
    updateURL(address);
    handleModalClose();
  };

  return {
    isModalOpen,
    isMobileMenuOpen,
    handleModalOpen,
    handleModalClose,
    toggleMobileMenu,
    handleColorChange,
    handleAddressClick,
  };
};
