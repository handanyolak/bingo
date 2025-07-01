import { useMemo } from "react";
import { BINGO_CARD_SIZE } from "@/constants/bingo";

export const useBingoCardGrid = ({
  cardNumbers,
  drawnNumbers,
}: {
  cardNumbers: number[];
  drawnNumbers: number[];
}) => {
  const emptyGridCells = useMemo(() => {
    return Array.from({ length: BINGO_CARD_SIZE }, (_, i) => i);
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
