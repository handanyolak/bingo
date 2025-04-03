import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

import {
  selectDrawnNumbers,
  selectIsDrawing,
  selectCardNumbers,
  selectIsGameFinishedInUi,
  selectDrawnNumbersWithTimestamp,
} from "@/lib/store/bingo";
import {
  addDrawnNumber,
  stopDrawing,
  setGameFinishedInUi,
  setDrawnNumbersWithTimestamp,
  startDrawing,
  resetStateForNewGame,
} from "@/lib/store/bingo";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getUnixTimestamp } from "@/lib/utils/time";
import { useContractReads } from "@/lib/web3";
import { ContractReads } from "@/lib/web3";

const DRAWN_NUMBER_TOTAL_INTERVAL_MS = 2000;
const DRAWN_NUMBER_INTERVAL_SEC = DRAWN_NUMBER_TOTAL_INTERVAL_MS / 1000;
const DRAWN_NUMBER_DISPLAY_DURATION_MS = 1500;
const DRAWN_NUMBER_TRANSITION_MS = 500;
const NUMBER_DRAWING_INITIAL_DELAY_SEC = 5;

/**
 * Schedules timestamps for drawn numbers based on contract data
 */
const useDrawnNumbersTimestampScheduler = (
  contractData: ContractReads | undefined
) => {
  const dispatch = useAppDispatch();
  const drawnNumbersWithTimestamp = useAppSelector(
    selectDrawnNumbersWithTimestamp
  );

  useEffect(() => {
    if (!contractData) return;

    if (
      contractData.isDrawnNumbersFilled &&
      contractData.drawnNumbers.length > 0 &&
      drawnNumbersWithTimestamp.length === 0
    ) {
      const drawingStartTime =
        Number(contractData.drawnNumbersTimestamp) +
        Number(contractData.finalizationCooldown);

      const scheduledDrawnNumbers = contractData.drawnNumbers.map(
        (number, index) => ({
          number,
          timestamp:
            drawingStartTime +
            index * DRAWN_NUMBER_INTERVAL_SEC +
            NUMBER_DRAWING_INITIAL_DELAY_SEC,
        })
      );

      const lastDrawnNumberIndexToInclude =
        contractData.winningDrawnNumberIndex > 0
          ? contractData.winningDrawnNumberIndex + 1
          : contractData.drawnNumbers.length;

      dispatch(
        setDrawnNumbersWithTimestamp(
          scheduledDrawnNumbers.slice(0, lastDrawnNumberIndexToInclude)
        )
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
};

/**
 * Updates and adds drawn numbers to the Redux store
 */
const useDrawnNumbersUpdater = () => {
  const dispatch = useAppDispatch();
  const displayedDrawnNumbers = useAppSelector(selectDrawnNumbers);
  const drawnNumbersWithTimestamp = useAppSelector(
    selectDrawnNumbersWithTimestamp
  );
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);
  const isDrawing = useAppSelector(selectIsDrawing);

  const drawnNumbersAnimationQueue = useRef<number[]>([]);
  const trackerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTrackerInterval = () => {
    if (trackerIntervalRef.current) {
      clearInterval(trackerIntervalRef.current);
      trackerIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!drawnNumbersWithTimestamp.length || isGameFinishedInUi) {
      drawnNumbersAnimationQueue.current = [];
      clearTrackerInterval();
      return;
    }

    const findDueDrawnNumbers = (currentTime: number): number[] => {
      const dueDrawnNumbers: number[] = [];
      for (let i = 0; i < drawnNumbersWithTimestamp.length; i++) {
        const drawnNumberWithTime = drawnNumbersWithTimestamp[i];
        if (
          drawnNumberWithTime.timestamp <= currentTime &&
          !displayedDrawnNumbers.includes(drawnNumberWithTime.number)
        ) {
          dueDrawnNumbers.push(drawnNumberWithTime.number);
        }
      }
      return dueDrawnNumbers;
    };

    const processMissedDrawnNumbersAndCheckGameCompletion = () => {
      const currentTimestamp = getUnixTimestamp();
      const missedDrawnNumbers = findDueDrawnNumbers(currentTimestamp);

      if (missedDrawnNumbers.length > 0) {
        missedDrawnNumbers.forEach((drawnNumber) => {
          dispatch(addDrawnNumber(drawnNumber));
        });

        drawnNumbersAnimationQueue.current = [...missedDrawnNumbers];

        if (
          displayedDrawnNumbers.length + missedDrawnNumbers.length >=
          drawnNumbersWithTimestamp.length
        ) {
          dispatch(setGameFinishedInUi(true));
          return true;
        }
      }
      return false;
    };

    const setupPeriodicDrawnNumbersTracker = () => {
      clearTrackerInterval();

      trackerIntervalRef.current = setInterval(() => {
        const currentTime = getUnixTimestamp();
        const newlyDrawnNumbers = findDueDrawnNumbers(currentTime);

        if (newlyDrawnNumbers.length > 0) {
          newlyDrawnNumbers.forEach((drawnNumber) => {
            dispatch(addDrawnNumber(drawnNumber));
          });

          if (drawnNumbersAnimationQueue.current.length === 0) {
            drawnNumbersAnimationQueue.current = [...newlyDrawnNumbers];
          } else {
            drawnNumbersAnimationQueue.current = [
              ...drawnNumbersAnimationQueue.current,
              ...newlyDrawnNumbers,
            ];
          }
        }

        if (displayedDrawnNumbers.length >= drawnNumbersWithTimestamp.length) {
          clearTrackerInterval();
          if (!isGameFinishedInUi) {
            dispatch(setGameFinishedInUi(true));
          }
        }
      }, 1000);
    };

    const isGameCompleted = processMissedDrawnNumbersAndCheckGameCompletion();

    if (!isGameCompleted) {
      setupPeriodicDrawnNumbersTracker();
    }

    return () => {
      clearTrackerInterval();
    };
  }, [
    drawnNumbersWithTimestamp,
    isGameFinishedInUi,
    isDrawing,
    displayedDrawnNumbers,
    dispatch,
  ]);

  return {
    drawnNumbersAnimationQueue,
    displayedDrawnNumbers,
    drawnNumbersWithTimestamp,
  };
};

/**
 * Displays drawn numbers in the UI with animations
 */
const useDrawnNumberDisplayer = (
  drawnNumbersAnimationQueue: React.RefObject<number[]>
) => {
  const [currentDrawnNumber, setCurrentDrawnNumber] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (drawnNumbersAnimationQueue.current.length === 0) return;

    let animationIndex = 0;
    const timeoutRefs: NodeJS.Timeout[] = [];

    const showNextDrawnNumber = () => {
      if (animationIndex >= drawnNumbersAnimationQueue.current.length) {
        drawnNumbersAnimationQueue.current = [];
        return;
      }

      const drawnNumber = drawnNumbersAnimationQueue.current[animationIndex];
      setCurrentDrawnNumber(drawnNumber);

      const hideTimeout = setTimeout(() => {
        setCurrentDrawnNumber(null);

        animationIndex++;

        if (animationIndex < drawnNumbersAnimationQueue.current.length) {
          const nextTimeout = setTimeout(
            showNextDrawnNumber,
            DRAWN_NUMBER_TRANSITION_MS
          );
          timeoutRefs.push(nextTimeout);
        } else {
          drawnNumbersAnimationQueue.current = [];
        }
      }, DRAWN_NUMBER_DISPLAY_DURATION_MS);

      timeoutRefs.push(hideTimeout);
    };

    showNextDrawnNumber();

    return () => {
      timeoutRefs.forEach((timeoutId) => clearTimeout(timeoutId));
      drawnNumbersAnimationQueue.current = [];
    };
  }, [drawnNumbersAnimationQueue.current]);

  return { currentDrawnNumber, setCurrentDrawnNumber };
};

/**
 * Manages win/lose states based on game conditions
 */
const useGameStateManager = (contractData: ContractReads | undefined) => {
  const t = useTranslations("toast");
  const dispatch = useAppDispatch();
  const displayedDrawnNumbers = useAppSelector(selectDrawnNumbers);
  const playerCardNumbers = useAppSelector(selectCardNumbers);
  const drawnNumbersWithTimestamp = useAppSelector(
    selectDrawnNumbersWithTimestamp
  );
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);
  const isDrawing = useAppSelector(selectIsDrawing);

  const [hasShownWinToast, setHasShownWinToast] = useState(false);
  const [hasShownLoseToast, setHasShownLoseToast] = useState(false);

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

  useEffect(() => {
    if (!contractData || !drawnNumbersWithTimestamp.length) return;

    if (
      displayedDrawnNumbers.length === drawnNumbersWithTimestamp.length &&
      displayedDrawnNumbers.length > 0 &&
      !isGameFinishedInUi
    ) {
      dispatch(setGameFinishedInUi(true));
      stopDrawingProcess();

      if (isPlayerCardComplete() && !hasShownWinToast) {
        toast.success(t("gameWon"));
        setHasShownWinToast(true);
      } else if (!isPlayerCardComplete() && !hasShownLoseToast) {
        toast.error(t("gameLost"));
        setHasShownLoseToast(true);
      }
    }
  }, [
    displayedDrawnNumbers.length,
    drawnNumbersWithTimestamp.length,
    isGameFinishedInUi,
    contractData,
    isPlayerCardComplete,
    hasShownWinToast,
    hasShownLoseToast,
    dispatch,
    stopDrawingProcess,
    t,
  ]);

  useEffect(() => {
    if (!contractData) return;

    if (isPlayerCardComplete() && !hasShownWinToast && isDrawing) {
      toast.success(t("gameWon"));
      setHasShownWinToast(true);
      dispatch(setGameFinishedInUi(true));
      stopDrawingProcess();
    } else if (
      isGameFinishedInUi &&
      !isPlayerCardComplete() &&
      !hasShownLoseToast &&
      drawnNumbersWithTimestamp.length > 0
    ) {
      toast.error(t("gameLost"));
      setHasShownLoseToast(true);
    }
  }, [
    isPlayerCardComplete,
    hasShownWinToast,
    hasShownLoseToast,
    isDrawing,
    isGameFinishedInUi,
    contractData,
    dispatch,
    stopDrawingProcess,
    drawnNumbersWithTimestamp.length,
    t,
  ]);

  return {
    isPlayerCardComplete,
    stopDrawingProcess,
    setHasShownWinToast,
    setHasShownLoseToast,
  };
};

/**
 * Initiates the drawing process at the correct time
 */
const useDrawingStarter = (contractData: ContractReads | undefined) => {
  const dispatch = useAppDispatch();
  const drawnNumbersWithTimestamp = useAppSelector(
    selectDrawnNumbersWithTimestamp
  );
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);
  const isDrawing = useAppSelector(selectIsDrawing);

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
    const firstDrawnNumberTime = drawnNumbersWithTimestamp[0].timestamp;

    if (currentTime >= firstDrawnNumberTime) {
      dispatch(startDrawing());
    } else {
      const timeUntilFirstDraw = (firstDrawnNumberTime - currentTime) * 1000;
      const drawingStartTimer = setTimeout(() => {
        dispatch(startDrawing());
      }, timeUntilFirstDraw);

      return () => clearTimeout(drawingStartTimer);
    }
  }, [
    contractData?.isDrawnNumbersFilled,
    isGameFinishedInUi,
    isDrawing,
    drawnNumbersWithTimestamp,
    dispatch,
  ]);
};

/**
 * Main bingo drawing functionality that combines all other specialized functions
 */
export const useBingoDrawing = () => {
  const searchParams = useSearchParams();
  const currentGameId = searchParams.get("id");
  const { data: contractData } = useContractReads();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetStateForNewGame());
  }, [currentGameId, dispatch]);

  useDrawnNumbersTimestampScheduler(contractData);
  const {
    drawnNumbersAnimationQueue,
    displayedDrawnNumbers,
    drawnNumbersWithTimestamp,
  } = useDrawnNumbersUpdater();
  const { currentDrawnNumber } = useDrawnNumberDisplayer(
    drawnNumbersAnimationQueue
  );
  const { isPlayerCardComplete } = useGameStateManager(contractData);
  useDrawingStarter(contractData);

  const isDrawing = useAppSelector(selectIsDrawing);
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);

  return {
    drawnNumbers: displayedDrawnNumbers,
    isDrawing,
    isPlayerCardComplete,
    isGameOver: isGameFinishedInUi,
    currentNumber: currentDrawnNumber,
    remainingDrawnNumbersCount: contractData
      ? contractData.BINGO_MAX_NUMBER - displayedDrawnNumbers.length
      : 0,
  };
};
