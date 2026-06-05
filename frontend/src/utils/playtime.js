export const loadPlaytime = () => {
  const savedTime = localStorage.getItem("PLAYTIME_TOTAL_MS");
  if (savedTime === null) return 0;
  return Number(savedTime);
};

export const formatPlayTime = (totalMs) => {
  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
