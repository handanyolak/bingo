"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useContractReads } from "@/lib/web3";

export const useSelectedGameId = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");
  const { data: contractData, isLoading } = useContractReads();

  const [selectedGameId, setSelectedGameId] = useState<bigint>(BigInt(0));

  useEffect(() => {
    if (!contractData || isLoading) return;

    const handleGameIdUpdate = () => {
      if (urlId) {
        try {
          const gameId = BigInt(urlId);
          if (gameId >= BigInt(0) && gameId <= contractData.gameId) {
            setSelectedGameId(gameId);
          } else {
            toast.error("Invalid game ID");
            setSelectedGameId(contractData.gameId);
            updateURL(contractData.gameId);
          }
        } catch (error) {
          toast.error("Invalid game ID format");
          setSelectedGameId(contractData.gameId);
          updateURL(contractData.gameId);
        }
      } else {
        setSelectedGameId(contractData.gameId);
        updateURL(contractData.gameId);
      }
    };

    handleGameIdUpdate();
  }, [urlId, contractData, isLoading]);

  const updateURL = (newValue: bigint) => {
    const address = searchParams.get("selectedAddress");
    router.replace(
      `?id=${newValue.toString()}${
        address ? `&selectedAddress=${address}` : ""
      }`
    );
  };

  const updateSelectedGameId = (newValue: bigint) => {
    if (!contractData) return;

    if (newValue >= BigInt(0) && newValue <= contractData.gameId) {
      setSelectedGameId(newValue);
      updateURL(newValue);
    } else {
      toast.error("Invalid game ID");
    }
  };

  return {
    selectedGameId,
    updateSelectedGameId,
    maxGameId: contractData?.gameId ?? BigInt(0),
    isLoading,
  };
};
