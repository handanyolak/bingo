"use client";

import { useSelectedGameId } from "@/app/hooks/routing/useRouteParams";
import { useContractReads } from "@/lib/web3";
import { useAppDispatch } from "@/lib/store/hooks";
import { resetStateForNewGame } from "@/lib/store/bingo";
import { dismissAllToasts } from "@/app/hooks/toast/useGameToasts";

export const useGameSwitching = () => {
  const { selectedGameId, maxGameId, updateSelectedGameId } =
    useSelectedGameId();
  const dispatch = useAppDispatch();
  const { isLoading, refetch } = useContractReads();

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
    isDisabledNext: selectedGameId === maxGameId,
    isLoading,
  };
};
