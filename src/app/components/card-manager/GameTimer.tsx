import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { LottieTimer, useDrawTimer } from "@/app/components/card-manager";
import styles from "@/app/components/card-manager/GameTimer.module.scss";

export const GameTimer = () => {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  const { remainingTime, minutesRemaining, secondsRemaining } = useDrawTimer(
    {}
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || remainingTime <= 0) return null;

  return (
    <div className={styles.gameTimer__container}>
      <div className={styles.gameTimer__animation}>
        <LottieTimer remainingTime={remainingTime} />
      </div>
      <div className={styles.gameTimer__time}>
        {t("controls.timeRemaining")}{" "}
        {!isNaN(minutesRemaining) ? minutesRemaining : 0}:
        {!isNaN(secondsRemaining)
          ? secondsRemaining.toString().padStart(2, "0")
          : "00"}
      </div>
    </div>
  );
};
