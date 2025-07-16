"use client";

import { dismissAllToasts, useSelectedGameId } from "@/app/hooks";
import {
  resetStateForNewGame,
  selectIsGameFinishedInUi,
} from "@/lib/store/bingo";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";

export const useGameSwitching = () => {
  const { selectedGameId, maxGameId, updateSelectedGameId } =
    useSelectedGameId();
  const dispatch = useAppDispatch();
  const { isLoading, refetch } = useContractReads();
  const isGameFinishedInUi = useAppSelector(selectIsGameFinishedInUi);

  const switchGame = async (offset: number) => {
    const newGameId = selectedGameId + BigInt(offset);
    dismissAllToasts();
    dispatch(resetStateForNewGame());
    updateSelectedGameId(newGameId);
    await refetch();
  };

  return {
    switchGame,
    isDisabledPrevious: selectedGameId === BigInt(1),
    isDisabledNext: selectedGameId === maxGameId || !isGameFinishedInUi,
    isLoading,
  };
};
