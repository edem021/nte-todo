const RESET_HOUR = 5;

function at5am(date) {
  const next = new Date(date);
  next.setHours(RESET_HOUR, 0, 0, 0);
  return next;
}

/** Next daily reset: today or tomorrow at 5:00 AM (local time). */
export function getNextDailyReset(from = new Date()) {
  const next = at5am(from);
  if (from >= next) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

/** Next weekly reset: next Monday at 5:00 AM (local time). */
export function getNextWeeklyReset(from = new Date()) {
  const next = at5am(from);
  let daysUntilMonday = (1 - next.getDay() + 7) % 7;

  if (daysUntilMonday === 0 && from >= next) {
    daysUntilMonday = 7;
  }

  next.setDate(next.getDate() + daysUntilMonday);
  return next;
}

export function getMsUntilReset(getNextReset) {
  return getNextReset().getTime() - Date.now();
}

export function formatCountdown(ms) {
  if (ms <= 0) return "Resetting...";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, "0");

  if (days > 0) {
    return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  }

  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}
