import { useMemo } from "react";
import type { NumberGridProps } from "@/types/drawn-numbers";

export const useNumberGrid = (props: NumberGridProps) => {
  const { drawnNumbers, totalCells, isDrawing } = props;

  const placeholderCount = useMemo(() => {
    return (
      totalCells -
      drawnNumbers.length -
      (isDrawing && drawnNumbers.length === 0 ? 1 : 0)
    );
  }, [totalCells, drawnNumbers.length, isDrawing]);

  const placeholderArray = useMemo(() => {
    return Array.from({ length: placeholderCount });
  }, [placeholderCount]);

  return {
    placeholderArray,
    shouldShowLoading: isDrawing && drawnNumbers.length === 0,
  };
};
