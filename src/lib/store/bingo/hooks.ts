import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectDrawnNumbers, selectIsDrawing } from "./bingoSelector";
import { addDrawnNumber, stopDrawing, resetDrawnNumbers } from "./bingoSlice";
import { useContractReads } from "@/lib/web3";
import { getUnixTimestamp, MS_IN_SECOND } from "@/lib/utils/time";
import { useSearchParams } from "next/navigation";

const DRAW_INTERVAL_MS = 3000;

interface DrawnNumbersConfig {
  drawnNumbers: readonly number[];
  drawnNumbersTimestamp: bigint;
  finalizationCooldown: bigint;
}

interface UseBingoDrawingReturn {
  drawnNumbers: number[];
  isDrawing: boolean;
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
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const isDrawing = useAppSelector(selectIsDrawing);
  const intervalRef = useRef<number | null>(null);
  const searchParams = useSearchParams();
  const currentGameId = searchParams.get("id");
  const { data: contractReadsData } = useContractReads();

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    dispatch(resetDrawnNumbers());
  }, [currentGameId, dispatch]);

  const handleDrawNumber = (
    numberIndex: number,
    contractNumbers: readonly number[]
  ) => {
    if (numberIndex < contractNumbers.length) {
      dispatch(addDrawnNumber(contractNumbers[numberIndex]));
    }
  };

  const stopDrawingProcess = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    dispatch(stopDrawing());
  };

  useEffect(() => {
    if (
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
      handleDrawNumber(i, contractReadsData.drawnNumbers);
    }

    if (targetIndex >= contractReadsData.drawnNumbers.length) {
      stopDrawingProcess();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      const newExpectedCount = calculateExpectedDrawnCount(drawingStartTime);
      const newTargetIndex = Math.min(
        newExpectedCount,
        contractReadsData.drawnNumbers.length
      );

      if (newTargetIndex > drawnNumbers.length) {
        handleDrawNumber(drawnNumbers.length, contractReadsData.drawnNumbers);
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
    contractReadsData?.drawnNumbers,
    contractReadsData?.drawnNumbersTimestamp,
    contractReadsData?.finalizationCooldown,
    dispatch,
    drawnNumbers.length,
  ]);

  return { drawnNumbers, isDrawing };
};
