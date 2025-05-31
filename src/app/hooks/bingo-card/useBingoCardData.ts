import { useEffect, useMemo } from "react";
import { useSelectedGameId } from "@/app/hooks/routing/useRouteParams";
import { useBingoDrawing } from "@/app/hooks/useBingoDrawing";
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

const DEFAULT_CARD_CONFIG = {
  BINGO_MIN_NUMBER: 1,
  BINGO_MAX_NUMBER: 75,
  BINGO_CARD_NUMBERS_COUNT: 25,
};

type PlayerParticipationStatus = "active" | "notPlayed";

export const useBingoCardData = () => {
  const {
    data: contractData,
    isLoading: isContractDataLoading,
    refetch,
  } = useContractReads();

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
    if (isCurrentGame || contractData?.isPlayerExists) {
      return "active";
    }
    return "notPlayed";
  }, [isCurrentGame, contractData?.isPlayerExists]);

  const cardConfig = useMemo(() => {
    if (contractData) {
      return {
        BINGO_MIN_NUMBER: contractData.BINGO_MIN_NUMBER,
        BINGO_MAX_NUMBER: contractData.BINGO_MAX_NUMBER,
        BINGO_CARD_NUMBERS_COUNT: contractData.BINGO_CARD_NUMBERS_COUNT,
      };
    }
    return DEFAULT_CARD_CONFIG;
  }, [contractData]);

  useEffect(() => {
    const areCardsEmpty = cardNumbers.every((num) => num === 0);

    if (
      !isContractDataLoading &&
      contractData?.isPlayerExists &&
      contractData?.playerDetails &&
      contractData?.playerDetails.cardNumbers &&
      Array.isArray(contractData.playerDetails.cardNumbers) &&
      contractData.playerDetails.cardNumbers.some((n) => n > 0)
    ) {
      dispatch(
        setCardNumbers(
          contractData.playerDetails!.cardNumbers as BingoCardNumbers
        )
      );
    } else if (cardConfig && areCardsEmpty) {
      dispatch(generateCardNumbers(cardConfig));
    }
  }, [isContractDataLoading, contractData, dispatch, cardConfig, cardNumbers]);

  useEffect(() => {
    if (!isContractDataLoading) {
      refetch();
    }
  }, [selectedGameId, refetch, isContractDataLoading]);

  return {
    cardNumbers,
    drawnNumbers,
    contractData,
    isContractDataLoading,
    isCurrentGame,
    playerParticipationStatus,
    cardConfig,
    isPlayerCardComplete,
    isGameFinishedInUi,
    dispatch,
  };
};
