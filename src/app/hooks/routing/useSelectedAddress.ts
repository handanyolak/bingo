"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";

export function useSelectedAddress() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address: connectedAddress, isConnected } = useAccount();
  const [selectedAddress, setSelectedAddress] = useState<string>(zeroAddress);

  const updateURL = (address: string) => {
    const currentGameId = searchParams.get("id");
    router.replace(
      `?${
        currentGameId ? `id=${currentGameId}&` : ""
      }selectedAddress=${address}`
    );
  };

  useEffect(() => {
    if (isConnected && connectedAddress) {
      updateURL(connectedAddress);
      setSelectedAddress(connectedAddress);
    } else {
      updateURL(zeroAddress);
      setSelectedAddress(zeroAddress);
    }
  }, [connectedAddress, isConnected]);

  return { selectedAddress, updateURL };
}
