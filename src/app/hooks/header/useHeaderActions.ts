import { Address } from "viem";
import { useColor } from "@/app/contexts/ColorContext";
import { useSelectedAddress } from "@/app/hooks/routing/useRouteParams";

export const useHeaderActions = (onModalClose: () => void) => {
  const { cycleColor } = useColor();
  const { updateURL } = useSelectedAddress();

  const handleColorChange = () => {
    cycleColor();
  };

  const handleAddressClick = (address: Address) => {
    updateURL(address);
    onModalClose();
  };

  return {
    handleColorChange,
    handleAddressClick,
  };
};
