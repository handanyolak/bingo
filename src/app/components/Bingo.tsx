"use client";

import { useTranslations } from "next-intl";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

import styles from "@/styles/Bingo.module.scss";
import { AppButton } from "@/app/components/common/AppButton";
import { BingoCard } from "@/app/components/BingoCard";
import { DrawnNumbers } from "@/app/components/DrawnNumbers";
import { CardManager } from "@/app/components/CardManager";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectDrawnNumbers, useBingoDrawing } from "@/lib/store/bingo";

import { useContractReads } from "@/lib/web3";
import { useSelectedGameId } from "@/app/hooks/routing/useSelectedGameId";
import { useDrawTimer } from "@/app/hooks/useDrawTimer";
import { PoolInfo } from "@/app/components/PoolInfo";
import { useAccountChange } from "@/app/contexts/AccountChangeContext";

export const Bingo = () => {
  const t = useTranslations("controls");
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const { isDrawing, isGameOver } = useBingoDrawing();
  const dispatch = useAppDispatch();
  const { key } = useAccountChange();

  const { data: contractData, isLoading: contractLoading } = useContractReads();
  const { selectedGameId, updateSelectedGameId, maxGameId } =
    useSelectedGameId();

  useDrawTimer({
    contractData: contractData,
    isGameOver,
  });

  const handleSwitchGame = (offset: number) => {
    const newGameId = selectedGameId + BigInt(offset);
    updateSelectedGameId(newGameId);
  };

  return (
    <div key={key} className={styles.bingo__page}>
      <div className={styles.bingo__container}>
        <div className={styles.bingo__wrapper}>
          <PoolInfo
            prizePoolBalance={contractData?.prizePoolBalance ?? BigInt(0)}
            requestRandomnessPayment={contractData?.requestRandomnessPayment}
            requestRandomNumbersRefund={
              contractData?.requestRandomNumbersRefund
            }
          />
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
          <DrawnNumbers loading={contractLoading} />
        </div>
      </div>
    </div>
  );
};
