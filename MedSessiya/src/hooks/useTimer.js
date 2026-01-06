import { useEffect, useState, useRef } from 'react';

export function useTimer(seconds) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const secondsRef = useRef(seconds);

  // reset timer whenever seconds prop changes
  useEffect(() => {
    secondsRef.current = seconds;
    setTimeLeft(seconds);
    setRunning(seconds > 0);
  }, [seconds]);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft, running]);

  return {
    timeLeft,
    stop: () => setRunning(false),
    start: () => setRunning(true),
  };
}
