const RESET_HOUR = 5;

function at5am(date) {
  const next = new Date(date);
  next.setHours(RESET_HOUR, 0, 0, 0);
  return next;
}

/** Most recent daily reset at or before `from` (today or yesterday 5am). */
export function getLastDailyReset(from = new Date()) {
  const reset = at5am(from);
  if (from < reset) {
    reset.setDate(reset.getDate() - 1);
  }
  return reset;
}

/** Most recent weekly reset (Monday 5am) at or before `from`. */
export function getLastWeeklyReset(from = new Date()) {
  const reset = at5am(from);
  const daysSinceMonday = (reset.getDay() + 6) % 7;
  reset.setDate(reset.getDate() - daysSinceMonday);

  if (from < reset) {
    reset.setDate(reset.getDate() - 7);
  }

  return reset;
}

const LAST_RESET_KEYS = {
  weekly: "WEEKLY_LAST_RESET",
  daily: "DAILY_LAST_RESET",
};

function shouldResetList(listKey, now = new Date()) {
  const getLastReset =
    listKey === "weekly" ? getLastWeeklyReset : getLastDailyReset;
  const lastPeriodReset = getLastReset(now);
  const stored = localStorage.getItem(LAST_RESET_KEYS[listKey]);

  if (stored === null) return true;

  return new Date(stored) < lastPeriodReset;
}

function markListReset(listKey, now = new Date()) {
  const getLastReset =
    listKey === "weekly" ? getLastWeeklyReset : getLastDailyReset;
  localStorage.setItem(
    LAST_RESET_KEYS[listKey],
    getLastReset(now).toISOString(),
  );
}

export function clearCompleted(items) {
  return items.map((item) => ({ ...item, completed: false }));
}

/** Uncheck completed tasks if a daily/weekly reset was missed since last visit. */
export function applyResets(weekly, daily, now = new Date()) {
  let nextWeekly = weekly;
  let nextDaily = daily;

  if (shouldResetList("weekly", now)) {
    nextWeekly = clearCompleted(weekly);
    markListReset("weekly", now);
  }

  if (shouldResetList("daily", now)) {
    nextDaily = clearCompleted(daily);
    markListReset("daily", now);
  }

  return { weekly: nextWeekly, daily: nextDaily };
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
