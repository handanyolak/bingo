const getUnixTimestamp = () => Math.floor(Date.now() / 1000);

const secondsToMinutes = (seconds: number) => Math.floor(seconds / 60);

const getRemainingSeconds = (seconds: number) => seconds % 60;

export { getUnixTimestamp, secondsToMinutes, getRemainingSeconds };
