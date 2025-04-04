"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useSelectedGameId } from "@/app/hooks/routing/useRouteParams";
import {
  stopDrawing,
  selectIsDrawing,
  selectCardNumbers,
  selectDrawnNumbers,
  setGameFinishedInUi,
  selectIsGameFinishedInUi,
  selectDrawnNumbersWithTimestamp,
} from "@/lib/store/bingo";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ContractReads } from "@/lib/web3";

export const useGameToasts = (contractData: ContractReads | undefined) => {
  const t = useTranslations("toast");
  const dispatch = useAppDispatch();
  const displayedDrawnNumbers = useAppSelector(selectDrawnNumbers);
  const playerCardNumbers = useAppSelector(selectCardNumbers);
  const drawnNumbersWithTimestamp = useAppSelector(
    selectDrawnNumbersWithTimestamp
  );
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);
  const isDrawing = useAppSelector(selectIsDrawing);
  const { selectedGameId } = useSelectedGameId();

  const [currentlyTrackedGameId, setCurrentlyTrackedGameId] = useState<
    bigint | null
  >(null);
  const [hasShownWinToast, setHasShownWinToast] = useState(false);
  const [hasShownLoseToast, setHasShownLoseToast] = useState(false);

  useEffect(() => {
    if (
      contractData &&
      selectedGameId !== undefined &&
      selectedGameId !== currentlyTrackedGameId
    ) {
      toast.dismiss();

      setCurrentlyTrackedGameId(selectedGameId);
      setHasShownWinToast(false);
      setHasShownLoseToast(false);
    }
  }, [selectedGameId, contractData, currentlyTrackedGameId]);

  const isPlayerCardComplete = useCallback(() => {
    if (!playerCardNumbers.length || !displayedDrawnNumbers.length)
      return false;
    return playerCardNumbers.every((number) =>
      displayedDrawnNumbers.includes(number)
    );
  }, [playerCardNumbers, displayedDrawnNumbers]);

  const stopDrawingProcess = useCallback(() => {
    dispatch(stopDrawing());
  }, [dispatch]);

  const hasUserParticipatedInGame = useCallback(() => {
    if (!contractData) return false;

    if (
      contractData.gameId === contractData.targetGameId &&
      contractData.isPlayerExists
    ) {
      return true;
    }

    if (
      contractData.gameId !== contractData.targetGameId &&
      contractData.playerDetails &&
      contractData.playerDetails.cardNumbers &&
      contractData.playerDetails.cardNumbers.some((n) => n > 0)
    ) {
      return true;
    }

    return false;
  }, [contractData]);

  useEffect(() => {
    if (!contractData || !drawnNumbersWithTimestamp.length) return;

    if (
      contractData.gameId === contractData.targetGameId &&
      !contractData.isDrawnNumbersFilled
    )
      return;

    if (!hasUserParticipatedInGame()) return;

    const gameFinished =
      displayedDrawnNumbers.length === drawnNumbersWithTimestamp.length &&
      displayedDrawnNumbers.length > 0;

    if (gameFinished && !isGameFinishedInUi) {
      dispatch(setGameFinishedInUi(true));
      stopDrawingProcess();

      if (isPlayerCardComplete() && !hasShownWinToast) {
        toast.success(t("gameWon"));
        setHasShownWinToast(true);
      } else if (!isPlayerCardComplete() && !hasShownLoseToast) {
        toast.error(t("gameLost"));
        setHasShownLoseToast(true);
      }
    } else if (gameFinished && isGameFinishedInUi) {
      if (isPlayerCardComplete() && !hasShownWinToast) {
        toast.success(t("gameWon"));
        setHasShownWinToast(true);
      } else if (!isPlayerCardComplete() && !hasShownLoseToast) {
        toast.error(t("gameLost"));
        setHasShownLoseToast(true);
      }
    }
  }, [
    contractData,
    displayedDrawnNumbers.length,
    drawnNumbersWithTimestamp.length,
    isGameFinishedInUi,
    isPlayerCardComplete,
    hasShownWinToast,
    hasShownLoseToast,
    dispatch,
    stopDrawingProcess,
    t,
    hasUserParticipatedInGame,
  ]);

  useEffect(() => {
    if (!contractData) return;

    if (
      contractData.gameId === contractData.targetGameId &&
      !contractData.isDrawnNumbersFilled
    )
      return;

    if (!hasUserParticipatedInGame()) return;

    if (isDrawing && isPlayerCardComplete() && !hasShownWinToast) {
      toast.success(t("gameWon"));
      setHasShownWinToast(true);
      dispatch(setGameFinishedInUi(true));
      stopDrawingProcess();
    }
  }, [
    contractData,
    isPlayerCardComplete,
    hasShownWinToast,
    isDrawing,
    dispatch,
    stopDrawingProcess,
    t,
    hasUserParticipatedInGame,
  ]);

  const dismissAllToasts = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    isPlayerCardComplete,
    dismissAllToasts,
    hasUserParticipatedInGame,
  };
};

export default useGameToasts;
