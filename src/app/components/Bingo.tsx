"use client";
import { BingoCard } from "@/app/components/BingoCard";
import { DrawnNumbers } from "@/app/components/DrawnNumbers";
import styles from "@/styles/Bingo.module.scss";
import { useTranslations } from "next-intl";
import { AppButton } from "@/app/components/AppButton";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { CardManager } from "@/app/components/CardManager";
import { useAppSelector } from "@/lib/store/hooks";
import {
  selectDrawnNumbers,
  useBingoDrawing,
} from "@/lib/store/features/bingo";

export const Bingo = () => {
  const t = useTranslations("controls");
  const drawnNumbers = useAppSelector(selectDrawnNumbers);
  const { isDrawing } = useBingoDrawing();

  return (
    <div className={styles.bingo__page}>
      <div className={styles.bingo__container}>
        <div className={styles.bingo__wrapper}>
          <CardManager />
          <div className={styles.bingo__game}>
            <BingoCard />
            <div className={styles.bingo__controls}>
              <AppButton
                text={t("previousGame")}
                contentPosition="left"
                content={<ChevronsLeft />}
                className={styles.bingo__control}
              />
              <AppButton
                text={t("nextGame")}
                contentPosition="right"
                content={<ChevronsRight />}
                className={styles.bingo__control}
              />
            </div>
          </div>
          <DrawnNumbers numbers={drawnNumbers} />
        </div>
      </div>
    </div>
  );
};
