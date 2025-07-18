import { useEffect, useMemo } from "react";

import { useBingoDrawing, useSelectedGameId } from "@/app/hooks";
import { DEFAULT_BINGO_CONFIG } from "@/constants/bingo";
import {
  BingoCardNumbers,
  generateCardNumbers,
  selectDrawnNumbers,
  setCardNumbers,
  selectCardNumbers,
  selectIsGameFinishedInUi,
} from "@/lib/store/bingo";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";

type PlayerParticipationStatus = "active" | "notPlayed";

export const useBingoCardData = () => {
  const { data, isLoading, refetch } = useContractReads({
    select: (fullData) => ({
      isPlayerExists: fullData.isPlayerExists,
      BINGO_MIN_NUMBER: fullData.BINGO_MIN_NUMBER,
      BINGO_MAX_NUMBER: fullData.BINGO_MAX_NUMBER,
      BINGO_CARD_NUMBERS_COUNT: fullData.BINGO_CARD_NUMBERS_COUNT,
      playerDetails: fullData.playerDetails,
    }),
  });

  const { selectedGameId, maxGameId } = useSelectedGameId();
  const cardNumbers = useAppSelector(selectCardNumbers);
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);
  const { isPlayerCardComplete } = useBingoDrawing();
  const dispatch = useAppDispatch();

  const isCurrentGame = useMemo(() => {
    if (!maxGameId || !selectedGameId) return true;
    return selectedGameId === maxGameId;
  }, [selectedGameId, maxGameId]);

  const shouldShowRefreshButton = isCurrentGame && !data?.isPlayerExists;

  const playerParticipationStatus: PlayerParticipationStatus = useMemo(() => {
    if (isCurrentGame || data?.isPlayerExists) {
      return "active";
    }
    return "notPlayed";
  }, [isCurrentGame, data?.isPlayerExists]);

  const cardConfig = useMemo(() => {
    if (
      data?.BINGO_MIN_NUMBER &&
      data?.BINGO_MAX_NUMBER &&
      data?.BINGO_CARD_NUMBERS_COUNT
    ) {
      return {
        BINGO_MIN_NUMBER: data.BINGO_MIN_NUMBER,
        BINGO_MAX_NUMBER: data.BINGO_MAX_NUMBER,
        BINGO_CARD_NUMBERS_COUNT: data.BINGO_CARD_NUMBERS_COUNT,
      };
    }
    return DEFAULT_BINGO_CONFIG;
  }, [
    data?.BINGO_MIN_NUMBER,
    data?.BINGO_MAX_NUMBER,
    data?.BINGO_CARD_NUMBERS_COUNT,
  ]);

  useEffect(() => {
    const areCardsEmpty = cardNumbers.length === 0;

    if (
      !isLoading &&
      data?.isPlayerExists &&
      data?.playerDetails &&
      data?.playerDetails.cardNumbers &&
      Array.isArray(data?.playerDetails.cardNumbers) &&
      data?.playerDetails.cardNumbers.some((n) => n > 0)
    ) {
      dispatch(
        setCardNumbers(data?.playerDetails!.cardNumbers as BingoCardNumbers)
      );
    } else if (cardConfig && areCardsEmpty) {
      dispatch(generateCardNumbers(cardConfig));
    }
  }, [
    isLoading,
    data?.isPlayerExists,
    data?.playerDetails,
    dispatch,
    cardConfig,
    cardNumbers,
  ]);

  useEffect(() => {
    if (!isLoading) {
      refetch();
    }
  }, [selectedGameId, refetch, isLoading]);

  return {
    cardNumbers,
    drawnNumbers,
    contractData: {
      isPlayerExists: data?.isPlayerExists,
      BINGO_MIN_NUMBER: data?.BINGO_MIN_NUMBER,
      BINGO_MAX_NUMBER: data?.BINGO_MAX_NUMBER,
      BINGO_CARD_NUMBERS_COUNT: data?.BINGO_CARD_NUMBERS_COUNT,
      playerDetails: data?.playerDetails,
    },
    isLoading,
    isCurrentGame,
    shouldShowRefreshButton,
    playerParticipationStatus,
    cardConfig,
    isPlayerCardComplete,
    isGameFinishedInUi,
    dispatch,
  };
};
