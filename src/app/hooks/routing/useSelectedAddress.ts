"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { isAddress, zeroAddress } from "viem";

export function useSelectedAddress() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address: connectedAddress, isConnected } = useAccount();
  const selectedAddressParam = searchParams.get("selectedAddress");
  const [selectedAddress, setSelectedAddress] = useState<string>(zeroAddress);

  useEffect(() => {
    if (selectedAddressParam && isAddress(selectedAddressParam)) {
      setSelectedAddress(selectedAddressParam);
    } else {
      if (isConnected && connectedAddress) {
        toast.info("Redirecting to your connected address...");
        updateURL(connectedAddress);
        setSelectedAddress(connectedAddress);
      } else {
        setSelectedAddress(zeroAddress);
      }
    }
  }, [selectedAddressParam, connectedAddress, isConnected]);

  const updateURL = (address: string) => {
    const currentGameId = searchParams.get("id");
    router.replace(
      `?${
        currentGameId ? `id=${currentGameId}&` : ""
      }selectedAddress=${address}`
    );
  };

  return { selectedAddress };
}
