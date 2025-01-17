import React, { useEffect, useState } from "react";
import { useLottie } from "lottie-react";
import timer from "../../../public/animations/timer.json";

const COUNTDOWN_DURATION = 120; // 2 minutes in seconds

export const CardManager = () => {
  const [timeRemaining, setTimeRemaining] = useState(COUNTDOWN_DURATION);

  const options = {
    animationData: timer,
    loop: false,
    autoplay: false,
  };

  const { View, play, setSpeed } = useLottie(options);

  useEffect(() => {
    const totalFrames = timer.op - timer.ip;
    const frameRate = timer.fr || 30;
    const speed = totalFrames / (COUNTDOWN_DURATION * frameRate);

    setSpeed(speed);
    play();

    const countdownTimer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [play, setSpeed]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-40">{View}</div>
      <div>
        Time Remaining: {minutes}:{seconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
};

export default CardManager;
