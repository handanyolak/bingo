import { useEffect, useState } from "react";

const MS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;

const getUnixTimestamp = () => Math.floor(Date.now() / MS_IN_SECOND);

const useUnixTimestamp = () => {
  const [timestamp, setTimestamp] = useState(getUnixTimestamp());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(getUnixTimestamp());
    }, MS_IN_SECOND);

    return () => clearInterval(interval);
  }, []);

  return timestamp;
};

const secondsToMinutes = (seconds: number) =>
  Math.floor(seconds / SECONDS_IN_MINUTE);

const getRemainingSeconds = (seconds: number) => seconds % SECONDS_IN_MINUTE;

export {
  MS_IN_SECOND,
  SECONDS_IN_MINUTE,
  getUnixTimestamp,
  useUnixTimestamp,
  secondsToMinutes,
  getRemainingSeconds,
};
