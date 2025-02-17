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
  const currentIndexRef = useRef<number>(drawnNumbers.length);
  const { data: contractReadsData } = useContractReads();

  useEffect(() => {
    if (isDrawing && contractReadsData?.drawnNumbers) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = window.setInterval(() => {
        if (currentIndexRef.current >= contractReadsData.drawnNumbers.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          dispatch(stopDrawing());
          return;
        }

        dispatch(
          addDrawnNumber(
            contractReadsData.drawnNumbers[currentIndexRef.current]
          )
        );
        currentIndexRef.current += 1;
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isDrawing, contractReadsData?.drawnNumbers, dispatch]);

  return {
    drawnNumbers,
    isDrawing,
  };
};
