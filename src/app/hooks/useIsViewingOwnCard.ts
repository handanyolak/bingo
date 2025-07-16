import { useAccount } from "wagmi";

import { useSelectedAddress } from "@/app/hooks";

export const useIsViewingOwnCard = () => {
  const { address: connectedAddress } = useAccount();
  const { selectedAddress } = useSelectedAddress();

  const isViewingOwnCard =
    connectedAddress && selectedAddress
      ? connectedAddress.toLowerCase() === selectedAddress.toLowerCase()
      : false;

  return { isViewingOwnCard };
};
