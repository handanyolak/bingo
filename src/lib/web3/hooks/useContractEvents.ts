import { useEffect, useCallback } from "react";
import { Address, Log, decodeEventLog } from "viem";

import { env } from "@/config/env";
import { publicClient } from "@/lib/web3";
import { abi } from "@/lib/web3";

interface ContractEventsParams {
  onCardPurchased?: (logs: Log[]) => void;
  onDrawnNumbersFilled?: (logs: Log[]) => void;
  refetchData: () => void;
}

type ContractEventName =
  | "CardPurchased"
  | "DrawnNumbersFilled"
  | "RequestRandomness"
  | "RewardClaimed";

const CONTRACT_EVENT_CONFIG = {
  address: env.bingoContractAddress as Address,
  abi,
  strict: true,
  batch: true,
  pollingInterval: 10_000,
  onError: (error: Error) => console.error("Contract event error:", error),
} as const;

const deduplicateLogs = (logs: Log[]): Log[] => {
  const uniqueLogMap = new Map<string, Log>();
  logs.forEach((log) => {
    const eventKey = `${log.transactionHash}-${log.logIndex}`;
    if (!uniqueLogMap.has(eventKey)) {
      uniqueLogMap.set(eventKey, log);
    }
  });
  return Array.from(uniqueLogMap.values());
};

const decodeEventData = ({
  eventName,
  log,
}: {
  eventName: ContractEventName;
  log: Log;
}) => {
  return decodeEventLog({
    abi,
    data: log.data,
    topics: log.topics,
    eventName,
  });
};

export const useContractEvents = ({
  onCardPurchased,
  onDrawnNumbersFilled,
  refetchData,
}: ContractEventsParams) => {
  const processEventLogs = useCallback(
    async (
      logs: Log[],
      eventName: ContractEventName,
      callback?: (logs: Log[]) => void,
      delayMs?: number
    ) => {
      const uniqueLogs = deduplicateLogs(logs);
      for (const log of uniqueLogs) {
        try {
          decodeEventData({ eventName, log });
          if (delayMs) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
          refetchData();
          callback?.(uniqueLogs);
        } catch (error) {
          console.error(`Failed to process ${eventName} event:`, error);
        }
      }
    },
    [refetchData]
  );

  const handleCardPurchase = useCallback(
    (logs: Log[]) => {
      processEventLogs(logs, "CardPurchased", onCardPurchased);
    },
    [processEventLogs, onCardPurchased]
  );

  const handleDrawnNumbers = useCallback(
    (logs: Log[]) => {
      processEventLogs(logs, "DrawnNumbersFilled", onDrawnNumbersFilled, 2000);
    },
    [processEventLogs, onDrawnNumbersFilled]
  );

  const handleRequestRandomness = useCallback(
    (logs: Log[]) => {
      processEventLogs(logs, "RequestRandomness", undefined);
    },
    [processEventLogs]
  );

  useEffect(() => {
    if (!env.bingoContractAddress) {
      console.error("Bingo contract address is not defined");
      return;
    }

    const cleanupFunctions: (() => void)[] = [];

    try {
      const unsubscribeCardPurchase = publicClient.watchContractEvent({
        ...CONTRACT_EVENT_CONFIG,
        eventName: "CardPurchased",
        onLogs: handleCardPurchase,
      });
      cleanupFunctions.push(unsubscribeCardPurchase);

      const unsubscribeDrawnNumbers = publicClient.watchContractEvent({
        ...CONTRACT_EVENT_CONFIG,
        eventName: "DrawnNumbersFilled",
        onLogs: handleDrawnNumbers,
      });
      cleanupFunctions.push(unsubscribeDrawnNumbers);

      const unsubscribeRequestRandomness = publicClient.watchContractEvent({
        ...CONTRACT_EVENT_CONFIG,
        eventName: "RequestRandomness",
        onLogs: handleRequestRandomness,
      });
      cleanupFunctions.push(unsubscribeRequestRandomness);
    } catch (error) {
      console.error("Failed to setup contract event listeners:", error);
    }

    return () => {
      cleanupFunctions.forEach((cleanup) => {
        try {
          cleanup();
        } catch (error) {
          console.error("Failed to cleanup event listener:", error);
        }
      });
    };
  }, [handleCardPurchase, handleDrawnNumbers, handleRequestRandomness]);
};
