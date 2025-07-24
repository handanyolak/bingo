import dynamic from "next/dynamic";

import {
  type LottieTimerProps,
  useLottieTimer,
} from "@/app/components/card-manager";

import timerAnimation from "../../../../public/animations/timer.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

export const LottieTimer = ({
  animationData = timerAnimation,
  remainingTime,
  className,
}: LottieTimerProps) => {
  const { lottieRef } = useLottieTimer({
    animationData,
    remainingTime,
  });

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={false}
      autoplay={false}
      className={className}
    />
  );
};
