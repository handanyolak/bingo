import { useEffect, useRef, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectDrawnNumbers,
  selectIsDrawing,
  selectCardNumbers,
} from "./bingoSelector";
import { addDrawnNumber, stopDrawing, resetDrawnNumbers } from "./bingoSlice";
import { useContractReads } from "@/lib/web3";
import { getUnixTimestamp, MS_IN_SECOND } from "@/lib/utils/time";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const DRAW_INTERVAL_MS = 3000;

interface DrawnNumbersConfig {
  drawnNumbers: readonly number[];
  drawnNumbersTimestamp: bigint;
  finalizationCooldown: bigint;
}

interface UseBingoDrawingReturn {
  drawnNumbers: number[];
  isDrawing: boolean;
  isPlayerCardComplete: () => boolean;
  isGameOver: boolean;
}

const calculateDrawingStartTime = (config: DrawnNumbersConfig): number =>
  parseInt(config.drawnNumbersTimestamp.toString()) +
  parseInt(config.finalizationCooldown.toString());

const calculateExpectedDrawnCount = (drawingStartTime: number): number => {
  const elapsedTime = Math.max(0, getUnixTimestamp() - drawingStartTime);
  return Math.floor(elapsedTime / (DRAW_INTERVAL_MS / MS_IN_SECOND));
};

export const useBingoDrawing = (): UseBingoDrawingReturn => {
  const dispatch = useAppDispatch();
  const announcedNumbers = useAppSelector(selectDrawnNumbers);
  const playerCardNumbers = useAppSelector(selectCardNumbers);
  const isDrawing = useAppSelector(selectIsDrawing);
  const intervalRef = useRef<number | null>(null);
  const searchParams = useSearchParams();
  const currentGameId = searchParams.get("id");
  const { data: contractReadsData } = useContractReads();
  const [hasShownWinToast, setHasShownWinToast] = useState(false);
  const [hasShownLoseToast, setHasShownLoseToast] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const isPlayerCardComplete = useCallback(() => {
    if (!playerCardNumbers.length || !announcedNumbers.length) return false;
    return playerCardNumbers.every((number) =>
      announcedNumbers.includes(number)
    );
  }, [playerCardNumbers, announcedNumbers]);

  const stopDrawingProcess = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    dispatch(stopDrawing());
  }, [dispatch]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    dispatch(resetDrawnNumbers());
    setHasShownWinToast(false);
    setHasShownLoseToast(false);
    setIsGameOver(false);
  }, [currentGameId, dispatch]);

  useEffect(() => {
    if (!contractReadsData || !contractReadsData.isDrawnNumbersFilled) return;

    const isCardComplete = isPlayerCardComplete();

    if (isCardComplete && !hasShownWinToast) {
      toast.success("Tebrikler! Oyunu kazandınız!");
      setHasShownWinToast(true);
      setIsGameOver(true);
      stopDrawingProcess();
    }

    if (
      !isCardComplete &&
      announcedNumbers.length === contractReadsData.drawnNumbers.length &&
      contractReadsData.drawnNumbers.length > 0 &&
      !hasShownLoseToast
    ) {
      toast.error("Üzgünüz, oyunu kaybettiniz!");
      setHasShownLoseToast(true);
      setIsGameOver(true);
      stopDrawingProcess();
    }
  }, [
    announcedNumbers,
    contractReadsData,
    hasShownWinToast,
    hasShownLoseToast,
    isPlayerCardComplete,
    stopDrawingProcess,
  ]);

  const announceDrawnNumber = useCallback(
    (numberIndex: number, contractNumbers: readonly number[]) => {
      if (numberIndex < contractNumbers.length) {
        dispatch(addDrawnNumber(contractNumbers[numberIndex]));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (
      isGameOver ||
      !isDrawing ||
      !contractReadsData?.drawnNumbers ||
      !contractReadsData.drawnNumbersTimestamp ||
      !contractReadsData.finalizationCooldown
    ) {
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const drawingStartTime = calculateDrawingStartTime({
      drawnNumbers: contractReadsData.drawnNumbers,
      drawnNumbersTimestamp: contractReadsData.drawnNumbersTimestamp,
      finalizationCooldown: contractReadsData.finalizationCooldown,
    });

    const expectedDrawnCount = calculateExpectedDrawnCount(drawingStartTime);
    const targetIndex = Math.min(
      expectedDrawnCount,
      contractReadsData.drawnNumbers.length
    );

    for (let i = 0; i < targetIndex; i++) {
      announceDrawnNumber(i, contractReadsData.drawnNumbers);
    }

    if (targetIndex >= contractReadsData.drawnNumbers.length) {
      stopDrawingProcess();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      if (isGameOver) {
        stopDrawingProcess();
        return;
      }

      const newExpectedCount = calculateExpectedDrawnCount(drawingStartTime);
      const newTargetIndex = Math.min(
        newExpectedCount,
        contractReadsData.drawnNumbers.length
      );

      if (newTargetIndex > announcedNumbers.length) {
        announceDrawnNumber(
          announcedNumbers.length,
          contractReadsData.drawnNumbers
        );
      }

      if (newTargetIndex >= contractReadsData.drawnNumbers.length) {
        stopDrawingProcess();
      }
    }, DRAW_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isDrawing,
    isGameOver,
    contractReadsData?.drawnNumbers,
    contractReadsData?.drawnNumbersTimestamp,
    contractReadsData?.finalizationCooldown,
    announcedNumbers.length,
    announceDrawnNumber,
    stopDrawingProcess,
  ]);

  return {
    drawnNumbers: announcedNumbers,
    isDrawing,
    isPlayerCardComplete,
    isGameOver,
  };
};
