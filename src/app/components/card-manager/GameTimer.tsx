import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";

import { useDrawTimer } from "@/app/components/card-manager";
import styles from "@/app/components/card-manager/GameTimer.module.scss";

import timerAnimation from "../../../../public/animations/timer.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

export const GameTimer = () => {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();
  const lottieAnimationRef = useRef(null);

  const { remainingTime, minutesRemaining, secondsRemaining } = useDrawTimer({
    lottieRef: lottieAnimationRef,
    timerAnimation,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || remainingTime <= 0) return null;

  return (
    <div className={styles.gameTimer__container}>
      <div className={styles.gameTimer__animation}>
        <Lottie
          lottieRef={lottieAnimationRef}
          animationData={timerAnimation}
          loop={false}
          autoplay={false}
        />
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
