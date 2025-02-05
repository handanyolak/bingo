import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectDrawnNumbers, selectIsDrawing } from "./bingoSelector";
import { addDrawnNumber, stopDrawing } from "./bingoSlice";
import { useContractReads } from "@/lib/web3";

interface UseBingoDrawingReturn {
  drawnNumbers: number[];
  isDrawing: boolean;
}

export const useBingoDrawing = (): UseBingoDrawingReturn => {
  const dispatch = useAppDispatch();
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const isDrawing = useAppSelector(selectIsDrawing);
  const intervalRef = useRef<number | null>(null);
  const { data: contractReadsData } = useContractReads();

  useEffect(() => {
    if (isDrawing && contractReadsData?.drawnNumbers) {
      let currentIndex = drawnNumbers.length;

      intervalRef.current = window.setInterval(() => {
        if (currentIndex >= contractReadsData.drawnNumbers.length) {
          dispatch(stopDrawing());
          return;
        }

        dispatch(addDrawnNumber(contractReadsData.drawnNumbers[currentIndex]));
        currentIndex++;
      }, 3000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isDrawing, drawnNumbers, contractReadsData, dispatch]);

  return {
    drawnNumbers,
    isDrawing,
  };
};
