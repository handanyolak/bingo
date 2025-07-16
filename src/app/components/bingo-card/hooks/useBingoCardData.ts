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
  const {
    data: {
      isPlayerExists,
      BINGO_MIN_NUMBER,
      BINGO_MAX_NUMBER,
      BINGO_CARD_NUMBERS_COUNT,
      playerDetails,
    } = {},
    isLoading: isContractDataLoading,
    refetch,
  } = useContractReads({
    select: (data) => ({
      isPlayerExists: data.isPlayerExists,
      BINGO_MIN_NUMBER: data.BINGO_MIN_NUMBER,
      BINGO_MAX_NUMBER: data.BINGO_MAX_NUMBER,
      BINGO_CARD_NUMBERS_COUNT: data.BINGO_CARD_NUMBERS_COUNT,
      playerDetails: data.playerDetails,
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

  const playerParticipationStatus: PlayerParticipationStatus = useMemo(() => {
    if (isCurrentGame || isPlayerExists) {
      return "active";
    }
    return "notPlayed";
  }, [isCurrentGame, isPlayerExists]);

  const cardConfig = useMemo(() => {
    if (BINGO_MIN_NUMBER && BINGO_MAX_NUMBER && BINGO_CARD_NUMBERS_COUNT) {
      return {
        BINGO_MIN_NUMBER,
        BINGO_MAX_NUMBER,
        BINGO_CARD_NUMBERS_COUNT,
      };
    }
    return DEFAULT_BINGO_CONFIG;
  }, [BINGO_MIN_NUMBER, BINGO_MAX_NUMBER, BINGO_CARD_NUMBERS_COUNT]);

  useEffect(() => {
    const areCardsEmpty = cardNumbers.length === 0;

    if (
      !isContractDataLoading &&
      isPlayerExists &&
      playerDetails &&
      playerDetails.cardNumbers &&
      Array.isArray(playerDetails.cardNumbers) &&
      playerDetails.cardNumbers.some((n) => n > 0)
    ) {
      dispatch(setCardNumbers(playerDetails!.cardNumbers as BingoCardNumbers));
    } else if (cardConfig && areCardsEmpty) {
      dispatch(generateCardNumbers(cardConfig));
    }
  }, [
    isContractDataLoading,
    isPlayerExists,
    playerDetails,
    dispatch,
    cardConfig,
    cardNumbers,
  ]);

  useEffect(() => {
    if (!isContractDataLoading) {
      refetch();
    }
  }, [selectedGameId, refetch, isContractDataLoading]);

  return {
    cardNumbers,
    drawnNumbers,
    contractData: {
      isPlayerExists,
      BINGO_MIN_NUMBER,
      BINGO_MAX_NUMBER,
      BINGO_CARD_NUMBERS_COUNT,
      playerDetails,
    },
    isContractDataLoading,
    isCurrentGame,
    playerParticipationStatus,
    cardConfig,
    isPlayerCardComplete,
    isGameFinishedInUi,
    dispatch,
  };
};
