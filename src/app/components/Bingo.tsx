"use client";

import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { BingoCard } from "@/app/components/BingoCard";
import { CardManager } from "@/app/components/CardManager";
import { AppButton } from "@/app/components/common/AppButton";
import { DrawnNumbers } from "@/app/components/DrawnNumbers";
import { PoolInfo } from "@/app/components/PoolInfo";
import { useAccountChange } from "@/app/contexts/AccountChangeContext";
import { useSelectedGameId } from "@/app/hooks/routing/useRouteParams";
import { useGameToasts } from "@/app/hooks/toast/useGameToasts";
import { resetStateForNewGame } from "@/lib/store/bingo";
import { useAppDispatch } from "@/lib/store/hooks";
import { useContractReads } from "@/lib/web3";
import styles from "@/styles/Bingo.module.scss";

export const Bingo = () => {
  const t = useTranslations("controls");
  const dispatch = useAppDispatch();
  const { key } = useAccountChange();

  const {
    data: contractData,
    isLoading: contractLoading,
    refetch,
  } = useContractReads();
  const { selectedGameId, updateSelectedGameId, maxGameId } =
    useSelectedGameId();

  const { dismissAllToasts } = useGameToasts(contractData);

  const handleSwitchGame = async (offset: number) => {
    const newGameId = selectedGameId + BigInt(offset);

    dismissAllToasts();

    dispatch(resetStateForNewGame());

    updateSelectedGameId(newGameId);

    await refetch();
  };

  useEffect(() => {
    const loadData = async () => {
      if (!contractLoading) {
        await refetch();
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGameId]);

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
