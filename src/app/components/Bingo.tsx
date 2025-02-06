"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

import styles from "@/styles/Bingo.module.scss";
import { AppButton } from "@/app/components/common/AppButton";
import { Tooltip } from "@/app/components/common/Tooltip";
import { BingoCard } from "@/app/components/BingoCard";
import { DrawnNumbers } from "@/app/components/DrawnNumbers";
import { CardManager } from "@/app/components/CardManager";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectDrawnNumbers,
  startDrawing,
  useBingoDrawing,
} from "@/lib/store/features/bingo";

import { useContractReads } from "@/lib/web3";
import { useSelectedGameId } from "@/app/hooks/routing/useSelectedGameId";
import { useSelectedAddress } from "@/app/hooks/routing/useSelectedAddress";

export const Bingo = () => {
  const t = useTranslations("controls");
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const { isDrawing } = useBingoDrawing();
  const dispatch = useAppDispatch();

  const { data: contractReadsData, isLoading: contractLoading } =
    useContractReads();
  const { selectedGameId, updateSelectedGameId, maxGameId } =
    useSelectedGameId();
  const { selectedAddress } = useSelectedAddress();

  useEffect(() => {
    if (contractReadsData?.isDrawnNumbersFilled) {
      dispatch(startDrawing());
    }
  }, [contractReadsData?.isDrawnNumbersFilled, dispatch]);

  const handleSwitchGame = (offset: number) => {
    const newGameId = selectedGameId + BigInt(offset);
    updateSelectedGameId(newGameId);
  };

  return (
    <div className={styles.bingo__page}>
      <div className={styles.bingo__container}>
        <div className={styles.bingo__wrapper}>
          <Tooltip
            texts={[
              "Randomness Payment: 1 ETH",
              "Random Numbers Refund: 0.00031419852536988 ETH",
            ]}
            position="top"
          >
            <AppButton text="Total Pool Balance: 15 ETH" rounded="lg" />
          </Tooltip>
          <CardManager />
          <div className={styles.bingo__game}>
            <BingoCard />
            <div className={styles.bingo__controls}>
              <AppButton
                text={t("previousGame")}
                contentPosition="left"
                content={<ChevronsLeft />}
                className={styles.bingo__control}
                onClick={() => handleSwitchGame(-1)}
                disabled={selectedGameId === BigInt(0) || contractLoading}
              />
              <AppButton
                text={t("nextGame")}
                contentPosition="right"
                content={<ChevronsRight />}
                className={styles.bingo__control}
                onClick={() => handleSwitchGame(1)}
                disabled={selectedGameId === maxGameId || contractLoading}
              />
            </div>
          </div>
          <DrawnNumbers />
        </div>
      </div>
    </div>
  );
};
