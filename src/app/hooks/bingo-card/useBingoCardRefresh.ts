import { useState } from "react";
import { generateCardNumbers } from "@/lib/store/bingo";
import { useAppDispatch } from "@/lib/store/hooks";
import { CardConfig } from "@/types";

export const useBingoCardRefresh = (cardConfig?: CardConfig) => {
  const [isRefreshingCard, setIsRefreshingCard] = useState(false);
  const dispatch = useAppDispatch();

  const handleCardRefresh = () => {
    if (!cardConfig) return;

    setIsRefreshingCard(true);
    dispatch(generateCardNumbers(cardConfig));

    setTimeout(() => {
      setIsRefreshingCard(false);
    }, 400);
  };

  return {
    isRefreshingCard,
    handleCardRefresh,
  };
};
