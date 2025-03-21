import { useEffect, useRef, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectDrawnNumbers,
  selectIsDrawing,
  selectCardNumbers,
  selectIsGameFinishedInUi,
  selectDrawnNumbersWithTimestamp,
} from "./bingoSelector";
import {
  addDrawnNumber,
  stopDrawing,
  resetDrawnNumbers,
  setGameFinishedInUi,
  setDrawnNumbersWithTimestamp,
  startDrawing,
  resetStateForNewGame,
} from "./bingoSlice";
import { useContractReads } from "@/lib/web3";
import { getUnixTimestamp } from "@/lib/utils/time";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const DRAW_INTERVAL_MS = 3000;
const DRAW_INTERVAL_SEC = DRAW_INTERVAL_MS / 1000;
const ADDITIONAL_TIME_SEC = 5;

export const useBingoDrawing = () => {
  const dispatch = useAppDispatch();
  const announcedNumbers = useAppSelector(selectDrawnNumbers);
  const drawnNumbersWithTimestamp = useAppSelector(
    selectDrawnNumbersWithTimestamp
  );
  const playerCardNumbers = useAppSelector(selectCardNumbers);
  const isDrawing = useAppSelector(selectIsDrawing);
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);
  const intervalRef = useRef<number | null>(null);
  const searchParams = useSearchParams();
  const currentGameId = searchParams.get("id");
  const { data: contractData } = useContractReads();
  const [hasShownWinToast, setHasShownWinToast] = useState(false);
  const [hasShownLoseToast, setHasShownLoseToast] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);

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
    setCurrentNumber(null);
    dispatch(resetStateForNewGame());
  }, [currentGameId, dispatch]);

  useEffect(() => {
    if (!contractData) return;

    if (
      contractData.isDrawnNumbersFilled &&
      contractData.drawnNumbers.length > 0 &&
      drawnNumbersWithTimestamp.length === 0
    ) {
      const startTime =
        Number(contractData.drawnNumbersTimestamp) +
        Number(contractData.finalizationCooldown);

      const numbersWithTimestamp = contractData.drawnNumbers.map(
        (number, index) => ({
          number,
          timestamp:
            startTime + index * DRAW_INTERVAL_SEC + ADDITIONAL_TIME_SEC,
        })
      );

      const maxIndex =
        contractData.winningDrawnNumberIndex > 0
          ? contractData.winningDrawnNumberIndex + 1
          : contractData.drawnNumbers.length;

      dispatch(
        setDrawnNumbersWithTimestamp(numbersWithTimestamp.slice(0, maxIndex))
      );
    }
  }, [
    contractData?.isDrawnNumbersFilled,
    contractData?.drawnNumbers,
    contractData?.drawnNumbersTimestamp,
    contractData?.finalizationCooldown,
    contractData?.winningDrawnNumberIndex,
    drawnNumbersWithTimestamp.length,
    dispatch,
  ]);

  useEffect(() => {
    if (!contractData || !drawnNumbersWithTimestamp.length) return;

    if (
      announcedNumbers.length === drawnNumbersWithTimestamp.length &&
      announcedNumbers.length > 0 &&
      !isGameFinishedInUi
    ) {
      dispatch(setGameFinishedInUi(true));
      stopDrawingProcess();

      if (isPlayerCardComplete() && !hasShownWinToast) {
        toast.success("Congratulations! You won!");
        setHasShownWinToast(true);
      } else if (!isPlayerCardComplete() && !hasShownLoseToast) {
        if (contractData.winningDrawnNumberIndex > 0) {
          toast.error("Sorry, another player won!");
        } else {
          toast.error("Sorry, you lost!");
        }
        setHasShownLoseToast(true);
      }
    }
  }, [
    announcedNumbers.length,
    drawnNumbersWithTimestamp.length,
    isGameFinishedInUi,
    contractData,
    isPlayerCardComplete,
    hasShownWinToast,
    hasShownLoseToast,
    dispatch,
    stopDrawingProcess,
  ]);

  useEffect(() => {
    if (!contractData) return;

    if (isPlayerCardComplete() && !hasShownWinToast && isDrawing) {
      toast.success("Congratulations! You won!");
      setHasShownWinToast(true);
      dispatch(setGameFinishedInUi(true));
      stopDrawingProcess();
    }
  }, [
    isPlayerCardComplete,
    hasShownWinToast,
    isDrawing,
    contractData,
    dispatch,
    stopDrawingProcess,
  ]);

  useEffect(() => {
    if (!drawnNumbersWithTimestamp.length || isGameFinishedInUi || !isDrawing) {
      return;
    }

    const currentTimestamp = getUnixTimestamp();

    let isFirstSync = true;
    let i = 0;

    const processDrawnNumbers = async () => {
      while (
        i < drawnNumbersWithTimestamp.length &&
        drawnNumbersWithTimestamp[i].timestamp <= currentTimestamp
      ) {
        const currentItem = drawnNumbersWithTimestamp[i];

        if (!announcedNumbers.includes(currentItem.number)) {
          dispatch(addDrawnNumber(currentItem.number));
          setCurrentNumber(currentItem.number);

          await new Promise((resolve) => setTimeout(resolve, 1500));
          setCurrentNumber(null);
        }

        i++;
      }

      if (i >= drawnNumbersWithTimestamp.length) {
        dispatch(setGameFinishedInUi(true));
        stopDrawingProcess();
        return;
      }

      if (isFirstSync) {
        isFirstSync = false;

        intervalRef.current = window.setInterval(async () => {
          if (i < drawnNumbersWithTimestamp.length) {
            const item = drawnNumbersWithTimestamp[i];

            dispatch(addDrawnNumber(item.number));
            setCurrentNumber(item.number);

            setTimeout(() => {
              setCurrentNumber(null);
            }, 1500);

            i++;

            if (i >= drawnNumbersWithTimestamp.length) {
              dispatch(setGameFinishedInUi(true));
              stopDrawingProcess();
            }
          }
        }, DRAW_INTERVAL_MS);
      }
    };

    processDrawnNumbers();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    drawnNumbersWithTimestamp,
    isGameFinishedInUi,
    isDrawing,
    announcedNumbers,
    dispatch,
    stopDrawingProcess,
  ]);

  useEffect(() => {
    if (
      !contractData?.isDrawnNumbersFilled ||
      isGameFinishedInUi ||
      isDrawing ||
      !drawnNumbersWithTimestamp.length
    ) {
      return;
    }

    const currentTime = getUnixTimestamp();
    const drawingStartTime = drawnNumbersWithTimestamp[0].timestamp;

    if (currentTime >= drawingStartTime) {
      dispatch(startDrawing());
    } else {
      const timeUntilStart = (drawingStartTime - currentTime) * 1000;
      const timer = setTimeout(() => {
        dispatch(startDrawing());
      }, timeUntilStart);

      return () => clearTimeout(timer);
    }
  }, [
    contractData?.isDrawnNumbersFilled,
    isGameFinishedInUi,
    isDrawing,
    drawnNumbersWithTimestamp,
    dispatch,
  ]);

  return {
    drawnNumbers: announcedNumbers,
    isDrawing,
    isPlayerCardComplete,
    isGameOver: isGameFinishedInUi,
    currentNumber,
    remainingDrawnNumbersCount: contractData
      ? contractData.BINGO_MAX_NUMBER - announcedNumbers.length
      : 0,
  };
};
