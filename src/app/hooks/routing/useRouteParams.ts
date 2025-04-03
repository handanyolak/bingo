"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useContractReads } from "@/lib/web3";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";

export const useRouteParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: contractData, isLoading: isContractLoading } =
    useContractReads();
  const { address: connectedAddress, isConnected } = useAccount();

  const urlId = searchParams.get("id");
  const [selectedGameId, setSelectedGameId] = useState<bigint>(BigInt(0));

  const [selectedAddress, setSelectedAddress] = useState<string>(zeroAddress);

  const updateURL = (params: { gameId?: bigint; address?: string }) => {
    const currentGameId = params.gameId?.toString() || searchParams.get("id");
    const currentAddress =
      params.address || searchParams.get("selectedAddress");

    router.replace(
      `?${currentGameId ? `id=${currentGameId}` : ""}${
        currentGameId && currentAddress ? "&" : ""
      }${currentAddress ? `selectedAddress=${currentAddress}` : ""}`
    );
  };

  const updateAddressURL = (address: string) => {
    const currentGameId = searchParams.get("id");
    router.replace(
      `?${
        currentGameId ? `id=${currentGameId}&` : ""
      }selectedAddress=${address}`
    );
  };

  useEffect(() => {
    if (!contractData || isContractLoading) return;

    const handleGameIdUpdate = () => {
      if (urlId) {
        try {
          const gameId = BigInt(urlId);
          if (gameId >= BigInt(0) && gameId <= contractData.gameId) {
            setSelectedGameId(gameId);
          } else {
            toast.error("Invalid game ID");
            setSelectedGameId(contractData.gameId);
            updateURL({ gameId: contractData.gameId });
          }
        } catch (error) {
          toast.error("Invalid game ID format");
          setSelectedGameId(contractData.gameId);
          updateURL({ gameId: contractData.gameId });
        }
      } else {
        setSelectedGameId(contractData.gameId);
        updateURL({ gameId: contractData.gameId });
      }
    };

    handleGameIdUpdate();
  }, [urlId, contractData, isContractLoading]);

  const updateSelectedGameId = (newValue: bigint) => {
    if (!contractData) return;

    if (newValue >= BigInt(0) && newValue <= contractData.gameId) {
      setSelectedGameId(newValue);
      updateURL({ gameId: newValue });
    } else {
      toast.error("Invalid game ID");
    }
  };

  useEffect(() => {
    if (isConnected && connectedAddress) {
      updateAddressURL(connectedAddress);
      setSelectedAddress(connectedAddress);
    } else {
      updateAddressURL(zeroAddress);
      setSelectedAddress(zeroAddress);
    }
  }, [connectedAddress, isConnected]);

  const updateSelectedAddress = (address: string) => {
    setSelectedAddress(address);
    updateAddressURL(address);
  };

  return {
    selectedGameId,
    updateSelectedGameId,
    maxGameId: contractData?.gameId ?? BigInt(0),
    isContractLoading,

    selectedAddress,
    updateSelectedAddress,
    updateAddressURL,

    updateURL,
  };
};

export const useSelectedGameId = () => {
  const { selectedGameId, updateSelectedGameId, maxGameId, isContractLoading } =
    useRouteParams();

  return {
    selectedGameId,
    updateSelectedGameId,
    maxGameId,
    isLoading: isContractLoading,
  };
};

export const useSelectedAddress = () => {
  const { selectedAddress, updateAddressURL } = useRouteParams();

  return {
    selectedAddress,
    updateURL: updateAddressURL,
  };
};
