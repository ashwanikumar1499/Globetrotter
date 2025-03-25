import { useEffect, useState } from "react";

interface UseTimerProps {
  startTime: number;
  onTimeOut: () => void;
  tickInterval?: number;
  autoStart?: boolean;
}

export function useTimer({
  startTime,
  onTimeOut,
  tickInterval = 1000,
  autoStart = true,
}: UseTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(startTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [progress, setProgress] = useState(100);

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(autoStart);
    setTimeRemaining(startTime);
    setProgress(100);
  };

  useEffect(() => {
    if (!isRunning) return;

    const timerId = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - tickInterval / 1000;
        const newPorgress = (newTime / startTime) * 100;
        setProgress(newPorgress);
        if (newTime <= 0) {
          clearInterval(timerId);
          setIsRunning(false);
          onTimeOut();
          return 0;
        }
        return newTime;
      });
    }, tickInterval);

    return () => clearInterval(timerId);
  }, [tickInterval, startTime, isRunning, onTimeOut]);

  // Add a new formatted time getter
  const getFormattedTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = Math.floor(timeRemaining % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    isRunning,
    timeRemaining,
    progress,
    formattedTime: getFormattedTime(),
    start,
    pause,
    reset,
  };
}
