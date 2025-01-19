import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectDrawnNumbers, selectIsDrawing } from "./bingoSelector";
import { addDrawnNumber, stopDrawing } from "./bingoSlice";

interface UseBingoDrawingReturn {
  drawnNumbers: number[];
  isDrawing: boolean;
}

export const useBingoDrawing = (): UseBingoDrawingReturn => {
  const dispatch = useAppDispatch();
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const isDrawing = useAppSelector(selectIsDrawing);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isDrawing) {
      intervalRef.current = window.setInterval(() => {
        if (drawnNumbers.length >= 75) {
          dispatch(stopDrawing());
          return;
        }

        const allNumbers = new Set<number>(
          Array.from({ length: 75 }, (_, i) => i + 1)
        );
        drawnNumbers.forEach((num) => allNumbers.delete(num));

        const remainingNumbers = Array.from(allNumbers);
        const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
        dispatch(addDrawnNumber(remainingNumbers[randomIndex]));
      }, 3000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isDrawing, drawnNumbers, dispatch]);

  return {
    drawnNumbers,
    isDrawing,
  };
};
