import { useEffect, useState } from "react";

const getUnixTimestamp = () => Math.floor(Date.now() / 1000);

const useUnixTimestamp = () => {
  const [timestamp, setTimestamp] = useState(getUnixTimestamp());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(getUnixTimestamp());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timestamp;
};

const secondsToMinutes = (seconds: number) => Math.floor(seconds / 60);

const getRemainingSeconds = (seconds: number) => seconds % 60;

export {
  getUnixTimestamp,
  useUnixTimestamp,
  secondsToMinutes,
  getRemainingSeconds,
};
