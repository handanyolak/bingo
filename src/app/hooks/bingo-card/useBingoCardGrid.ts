import { useMemo } from "react";
import { BingoCardGridProps } from "@/types";

export const useBingoCardGrid = (props: BingoCardGridProps) => {
  const { cardNumbers, drawnNumbers } = props;

  const emptyGridCells = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => i);
  }, []);

  const cardNumbersWithDrawnStatus = useMemo(() => {
    return cardNumbers.map((number, index) => ({
      number,
      index,
      isNumberDrawn: drawnNumbers.includes(number),
    }));
  }, [cardNumbers, drawnNumbers]);

  return {
    emptyGridCells,
    cardNumbersWithDrawnStatus,
  };
};
