import { useEffect, useState } from "react";
import { formatCountdown, getMsUntilReset } from "../utils/resetTime.js";

const ResetCountdown = ({ getNextReset }) => {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const tick = () => {
      setLabel(formatCountdown(getMsUntilReset(getNextReset)));
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [getNextReset]);

  return <p className="timer">Resets in {label}</p>;
};

export default ResetCountdown;
