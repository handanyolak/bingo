import React, { useEffect, useState, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import timer from "../../../public/animations/timer.json";
import { useTranslations } from "next-intl";
import { AppButton } from "@/app/components/AppButton";
import styles from "@/styles/CardManager.module.scss";

const COUNTDOWN_DURATION = 120;

export const CardManager = () => {
  const t = useTranslations("controls");

  const [timeRemaining, setTimeRemaining] = useState(COUNTDOWN_DURATION);
  const [isStarted, setIsStarted] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (!isStarted) return;

    const countdownTimer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimeout(() => {
      if (lottieRef.current?.animationItem) {
        const totalFrames = timer.op - timer.ip;
        const frameRate = timer.fr || 30;
        const naturalDuration = totalFrames / frameRate;
        const speedRatio = naturalDuration / COUNTDOWN_DURATION;

        lottieRef.current.animationItem.setSpeed(speedRatio);
        lottieRef.current.animationItem.play();
      }
    }, 100);

    return () => {
      clearInterval(countdownTimer);
    };
  }, [isStarted]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const handleStart = () => {
    setIsStarted(true);
  };

  const isTimeUp = timeRemaining === 0;

  return (
    <div className={styles.cardManager__container}>
      {!isStarted && <AppButton text={t("buyTheCard")} onClick={handleStart} />}
      {isTimeUp && <AppButton text={t("submitCard")} />}
      {!isTimeUp && isStarted && (
        <div className={styles.cardManager__timer}>
          <Lottie
            lottieRef={lottieRef}
            animationData={timer}
            loop={false}
            autoplay={false}
          />
        </div>
      )}
      {isStarted && !isTimeUp && (
        <div className={styles.cardManager__time}>
          Time Remaining: {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      )}
    </div>
  );
};
